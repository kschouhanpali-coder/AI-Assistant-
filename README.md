<div align="center">

# 🤖 JIET AI Assistant 🤖

### Ask Anything. Get Source-Backed Answers.

![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![Type](https://img.shields.io/badge/Type-RAG%20Chatbot-00C7B7?style=for-the-badge)

A Retrieval-Augmented Generation (RAG) assistant built for JIET Jodhpur. Get instant, source-backed answers about admissions, placements, courses, and campus life, with no more digging through PDFs.

*Instant answers, grounded in knowledge.*

</div>

---

## 🚀 Live Demo

<div align="center">

### **[▶️ CHAT WITH JIET AI ASSISTANT - Live Demo](https://jietassistant.netlify.app)**

*Open the app, add your free Groq API key in Settings, and start asking questions!*

</div>

---

## ✨ Features

- 📚 **RAG-Grounded Answers** - Every response is built from retrieved knowledge base content, not generic AI guesses
- 🔍 **RAG Inspector** - View the exact context retrieved for each answer
- 🧠 **Semantic Search** - FAISS vector search matches your question to the most relevant documents
- 💬 **Real-Time Chat** - Clean, responsive conversational interface
- 🎯 **Quick Prompts** - One-tap topics: Admission Process, Placements, Campus Facilities, B.Tech Programs
- ⚙️ **Adjustable RAG Settings** - Tune Top-K, Temperature, Chunk Size, and Chunk Overlap
- 🔄 **Rebuild Vector DB** - Refresh the index whenever the knowledge base changes
- 🔌 **Flexible Backend** - Connect to a FastAPI backend (local or tunneled) or use Local RAG mode

---

## 🏁 Quick Start

### Use Online
No installation needed! [Launch the live demo](https://jietassistant.netlify.app)

### Run Locally

**Prerequisites:** Python 3.9+ and a free Groq API key from [console.groq.com/keys](https://console.groq.com/keys)

1. Clone the repository:
```bash
git clone https://github.com/kschouhanpali-coder/JIET-AI-Assistant.git
cd JIET-AI-Assistant
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the project root:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

4. Start the app:
```bash
python run_servers.py
```

5. Open `http://127.0.0.1:8000/` in your browser

---

## 🎯 How to Use

1. **Add Your Key** - open **Settings** and enter your Groq API key
2. **Ask a Question** - type it in the chat box, or tap a quick prompt
3. **Read the Answer** - responses are generated from the retrieved knowledge base content
4. **Inspect the Sources** - open the **RAG Inspector** to see the context behind the answer
5. **Fine-Tune** - adjust the RAG settings to change how much context is retrieved
6. **Refresh** - click **Rebuild Vector DB** after updating the knowledge base

> ⚠️ Answers depend on the knowledge base. Always confirm important details such as fees, dates, and eligibility on the official website: [jietjodhpur.ac.in](https://jietjodhpur.ac.in).

---

## 🗂️ RAG Settings

| Setting | Default | What It Does |
|---------|---------|--------------|
| **Top-K (Sources)** | 4 | How many documents are retrieved per question |
| **Temperature** | 0.7 | Lower is more factual and consistent; higher is more varied |
| **Chunk Size** | 1000 | Size of each document chunk in the index |
| **Chunk Overlap** | 150 | Overlap between chunks to keep context across boundaries |
| **Rebuild Vector DB** | Manual | Refreshes the index with the latest content |

---

## 💻 Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** FastAPI (Python)
- **RAG Pipeline:** LangChain
- **Vector Database:** FAISS
- **LLM Provider:** Groq
- **Deployment:** Netlify (frontend)

---

## 📝 License

MIT License - Free to use and modify

---

<div align="center">

**[Live Demo](https://jietassistant.netlify.app) | [GitHub](https://github.com/kschouhanpali-coder/JIET-AI-Assistant) | [Report Issues](https://github.com/kschouhanpali-coder/JIET-AI-Assistant/issues)**

*Instant answers, grounded in knowledge.* 🤖

</div>
