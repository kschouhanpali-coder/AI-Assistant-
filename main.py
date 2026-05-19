import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# LangChain Imports for RAG
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import MarkdownTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import google.generativeai as genai

app = FastAPI(title="JIET RAG Chatbot")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize global FAISS Vector Store
vector_store = None
DOCUMENT_PATH = "JIET_Master_Document.md"

def init_rag(chunk_size=1000, chunk_overlap=150):
    global vector_store
    if not os.path.exists(DOCUMENT_PATH):
        print(f"Warning: {DOCUMENT_PATH} not found.")
        return False
        
    print(f"Loading and indexing document (chunk_size={chunk_size}, overlap={chunk_overlap})...")
    
    # 1. Load document
    loader = TextLoader(DOCUMENT_PATH, encoding="utf-8")
    documents = loader.load()
    
    # 2. Split into chunks using Markdown splitter
    text_splitter = MarkdownTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    docs = text_splitter.split_documents(documents)
    
    # 3. Create Vector Store with HuggingFace embeddings
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = FAISS.from_documents(docs, embeddings)
    
    print(f"RAG Vector Database initialized with {len(docs)} chunks.")
    return len(docs)

# Initialize RAG on startup
init_rag()

class ChatRequest(BaseModel):
    query: str
    api_key: str = None
    top_k: int = 4
    temperature: float = 0.7
    
class ChatResponse(BaseModel):
    answer: str
    context_used: list[str]
    is_genai: bool

class ReindexRequest(BaseModel):
    chunk_size: int
    chunk_overlap: int

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not vector_store:
        raise HTTPException(status_code=500, detail="RAG Database not initialized.")
        
    # Retrieve relevant documents using Vector Search
    retriever = vector_store.as_retriever(search_kwargs={"k": request.top_k})
    relevant_docs = retriever.invoke(request.query)
    
    if not relevant_docs:
        return ChatResponse(
            answer="I couldn't find specific information about that in the JIET Master Document. Could you try rephrasing your question?",
            context_used=[],
            is_genai=False
        )
        
    context_text = "\n\n".join([doc.page_content for doc in relevant_docs])
    context_used_list = [doc.page_content for doc in relevant_docs]
    is_genai_active = False
    
    # Generate response
    if request.api_key and request.api_key.strip() != "":
        try:
            genai.configure(api_key=request.api_key)
            
            # Create GenerationConfig to apply temperature
            generation_config = genai.types.GenerationConfig(
                temperature=request.temperature
            )
            model = genai.GenerativeModel('gemini-2.5-flash', generation_config=generation_config)
            prompt = f"""You are the official AI assistant for Jodhpur Institute of Engineering & Technology (JIET).
You must answer the user's question politely and professionally, using ONLY the information provided in the Context below.
If the context doesn't contain the answer, say you don't know based on the provided document.
Use markdown for formatting (bullet points, bold text). Keep it concise but comprehensive.

Context:
{context_text}

User Question: {request.query}
"""
            response = model.generate_content(prompt)
            answer = response.text
            is_genai_active = True
        except Exception as e:
            print(f"Gemini API Error: {e}")
            answer = relevant_docs[0].page_content
            is_genai_active = False
    else:
        # Fallback if no API key
        answer = relevant_docs[0].page_content
        is_genai_active = False
        
    return ChatResponse(
        answer=answer,
        context_used=context_used_list,
        is_genai=is_genai_active
    )

@app.post("/api/reindex")
async def reindex_rag(request: ReindexRequest):
    try:
        num_chunks = init_rag(chunk_size=request.chunk_size, chunk_overlap=request.chunk_overlap)
        if num_chunks is False:
             raise HTTPException(status_code=500, detail="Document not found.")
        return {"status": "success", "chunks": num_chunks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/style.css")
async def read_style():
    return FileResponse("style.css")

@app.get("/script.js")
async def read_script():
    return FileResponse("script.js")

@app.get("/")
async def read_index():
    return FileResponse("index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
