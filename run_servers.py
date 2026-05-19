import os
import sys
import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Starting JIET Chatbot Backend (Pure Local - No Tunnels)...")
    print("=" * 60)
    print("✨ Chatbot runs purely on your Mac at: http://127.0.0.1:8000")
    print("👉 Press Ctrl+C at any time to stop the server.")
    print("=" * 60)
    
    # Run FastAPI app directly with uvicorn on localhost
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
