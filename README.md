<div align="center" id="top">

# 🤖 JIET AI Assistant

**Instant, source-backed answers about admissions, placements, courses & campus life.**

A Retrieval-Augmented Generation (RAG) assistant built for JIET Jodhpur — no more digging through PDFs.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Try_it_now-00C7B7?style=for-the-badge)](https://jietassistant.netlify.app)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-RAG_Pipeline-1C3C3C?style=flat-square)
![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-4B8BBE?style=flat-square)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=flat-square)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [How It Works](#️-how-it-works)
- [Architecture](#️-architecture)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Configuration Reference](#-configuration-reference)
- [Program Information](#-program-information)
- [Performance Tuning](#-performance-tuning)
- [Project Structure](#-project-structure)
- [Browser Support](#-browser-support)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [Credits & Support](#-credits--support)

---

## 📋 Overview

**JIET AI Assistant** is a conversational interface that gives prospective and current students a fast way to get accurate information about **JIET Jodhpur** — admissions, eligibility, placements, courses, and campus facilities — without searching through scattered PDFs and web pages.

Every response is grounded in a real knowledge base via **Retrieval-Augmented Generation (RAG)**, so answers come with cited sources rather than generic AI guesses.

---

## 🌐 Live Demo

<div align="center">

### 👉 [**Chat with JIET AI Assistant**](https://jietassistant.netlify.app)

*Runs live in your browser — no installation required.*

</div>

---

## ✨ Features

<table>
<tr>
<td valign="top" width="50%">

### 🧠 Intelligence
- **Smart Query Understanding** — powered by Groq's LLaMA 3.3 70B for near-instant NLP
- **RAG-Grounded Responses** — every answer traces back to real source content
- **Transparent Sourcing** — inspect the retrieved context behind any answer
- **Real-time Chat** — clean, responsive conversational UI
- **Semantic Search** — matches queries to most relevant knowledge base documents

</td>
<td valign="top" width="50%">

### 📚 Knowledge Coverage
- **Admission requirements & eligibility criteria**
- **Placement statistics & career outcomes**
- **UG & PG Programs** — B.Tech, M.Tech, MBA, MCA, PhD
- **Campus facilities & infrastructure**
- **8+ academic streams and specializations**
- **Student life & campus amenities**

</td>
</tr>
</table>

---

## 🏗️ How It Works

```
1. Indexing        Knowledge base is embedded into a vector store
2. Retrieval       User query is matched via semantic search
3. Augmentation    Top-K most relevant documents are pulled in
4. Generation      Groq (LLaMA 3.3 70B) generates a grounded response
5. Source Display  Original sources are surfaced for verification
```

---

## 🎯 Architecture

### Core Components

| Component | Description |
|---|---|
| **Query Interface** | Clean chat input accepting natural language questions |
| **Vector Indexer** | FAISS vector store embedding knowledge base content |
| **Semantic Retriever** | Matches queries to relevant documents via similarity search |
| **RAG Pipeline** | LangChain orchestration combining retrieval + generation |
| **LLM Engine** | Groq API (LLaMA 3.3 70B) for response generation |
| **Source Display** | Shows retrieved documents for transparency & verification |

### System Integration

| Layer | Technology |
|---|---|
| **Frontend** | HTML, CSS, JavaScript |
| **AI / LLM** | Groq API — LLaMA 3.3 70B Versatile |
| **Backend / RAG** | FastAPI, LangChain, FAISS vector database |
| **Architecture** | Hybrid — FastAPI backend with browser-side fallback |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Web Framework** | FastAPI + HTML/CSS/JS |
| **LLM & NLP** | Groq (LLaMA 3.3 70B) |
| **RAG Pipeline** | LangChain |
| **Vector Database** | FAISS |
| **Server** | Python 3.9+ |
| **Deployment** | Netlify |

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+** installed
- A modern browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+)
- A **free Groq API key** from [console.groq.com/keys](https://console.groq.com/keys)
- Internet connection

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/JIET-AI-Assistant.git
cd JIET-AI-Assistant
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Set up environment variables**

Create a `.env` file in the project root:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

> Get your free API key at [console.groq.com/keys](https://console.groq.com/keys)

**4. Launch the application**
```bash
python run_servers.py
```

Then open **http://127.0.0.1:8000/** in your browser ✨

---

## 📖 Usage Guide

### Asking a Question

| Step | Action |
|---|---|
| 1️⃣ | Type your question into the chat input |
| 2️⃣ | Press Enter or click the send button |
| 3️⃣ | Receive an AI-generated answer with cited sources |

### Example Queries

- "What are the admission requirements for B.Tech?"
- "Tell me about placement statistics for CSE graduates."
- "What courses are offered in Computer Science Engineering?"
- "What is the duration of M.Tech programs?"
- "How many specializations are available?"
- "What are the campus facilities?"

### RAG Settings Inspector

Use the sidebar's **RAG Settings** panel to monitor and fine-tune retrieval in real time:

- 📄 **View Source Documents** — see the context behind each response
- 📊 **Track Relevance Scores** — monitor how relevant retrieved documents are
- ⚙️ **Adjust Parameters** — customize Top-K, Temperature, and Chunk settings
- 🔄 **Rebuild Vector DB** — refresh the index with updated content

---

## 🔧 Configuration Reference

### RAG Parameters

| Setting | Range | Recommended | Effect |
|---|---|---|---|
| **Top-K Sources** | 1–10 | 3–5 | Higher = broader context, slower response |
| **Temperature** | 0.0–1.0 | 0.2–0.4 | Lower = more deterministic, factual answers |
| **Chunk Size** | 256–2048 tokens | 512 | Larger = more context per chunk |
| **Chunk Overlap** | — | 10–20% of chunk size | Improves continuity across chunk boundaries |
| **Vector DB Rebuild** | Manual trigger | On-demand | Refresh index with latest content |

---

## 📚 Program Information

### Programs Offered

| Level | Programs | Duration |
|---|---|---|
| **Undergraduate** | B.Tech | 4 years |
| **Postgraduate** | M.Tech, MBA, MCA | 2 years |
| **Doctoral** | PhD | Variable |
| **Professional** | Diplomas (various fields) | Varies |

### Academic Specializations

**Engineering:** Computer Science & Engineering (CSE), CSE with AI/ML, Cyber Security, Electronics & Communication Engineering (ECE), Electrical Engineering, Mechanical Engineering, Civil Engineering

**Emerging Fields:** Data Science, Cloud Computing, IoT, Artificial Intelligence, Machine Learning, and more

### Official Contact

**JIET Jodhpur**
- 🌐 Website: [jiet.ac.in](https://jiet.ac.in)
- 📧 Email: [admissions@jiet.ac.in](mailto:admissions@jiet.ac.in)

---

## ⚡ Performance Tuning

| Action | Benefit |
|---|---|
| Lower Top-K sources | Faster responses, focused answers |
| Raise Top-K sources | Broader context, more comprehensive answers |
| Lower Temperature | More consistent, factual answers |
| Higher Temperature | More creative, varied responses |
| Smaller Chunk Size | Faster processing, focused context |
| Larger Chunk Size | More detailed context per chunk |
| Periodic DB Rebuild | Fresh, up-to-date knowledge base |

---

## 📁 Project Structure

```bash
JIET-AI-Assistant/
├── index.html              # Main chat interface
├── style.css               # UI styling & responsive design
├── script.js               # Frontend logic & interactions
├── main.py                 # FastAPI & RAG backend
├── run_servers.py          # Application launcher
├── requirements.txt        # Python dependencies
├── .env                    # API keys & configuration
├── uploads/                # Generated content storage
└── README.md               # Documentation
```

---

## 🌐 Browser Support

| Browser | Minimum Version |
|---|---|
| **Chrome** | 90+ |
| **Firefox** | 88+ |
| **Safari** | 14+ |
| **Edge** | 90+ |

---

## 🐛 Troubleshooting

<details>
<summary><strong>❌ API key not working</strong></summary>
<br/>

**Solutions:**
- Verify the API key in your [Groq Console](https://console.groq.com/keys)
- Check the browser console (F12 → Console tab) for error messages
- Ensure the Groq API is enabled on your account
- Try generating a new API key

</details>

<details>
<summary><strong>❌ No results retrieved</strong></summary>
<br/>

**Solutions:**
- Rephrase your question in different words
- Increase **Top-K sources** in RAG settings (try 5–7)
- **Rebuild the vector database** from settings panel
- Check that knowledge base documents are properly indexed

</details>

<details>
<summary><strong>❌ Slow responses</strong></summary>
<br/>

**Solutions:**
- Reduce **Chunk Size** to 256–384
- Decrease **Top-K sources** to 3
- Check your internet connection speed
- Try during off-peak hours (less server load)

</details>

<details>
<summary><strong>❌ Chat not responding</strong></summary>
<br/>

**Solutions:**
- Clear your browser cache (Ctrl+Shift+Del)
- Refresh the page (Ctrl+R or Cmd+R)
- Check browser console for JavaScript errors
- Restart the Python server (`python run_servers.py`)

</details>

---

## 🗺️ Roadmap

- [ ] Persistent backend database for conversation history
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Advanced analytics dashboard for admissions insights
- [ ] Conversation history export (PDF, CSV)
- [ ] Voice input/output (speech-to-text, text-to-speech)
- [ ] Mobile app version (iOS & Android)
- [ ] Integration with JIET's official systems
- [ ] Custom chatbot for departments/faculty

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository on GitHub
2. **Create a feature branch** — `git checkout -b feature/AmazingFeature`
3. **Make your changes** and test thoroughly
4. **Commit clearly** — `git commit -m 'Add AmazingFeature'`
5. **Push to branch** — `git push origin feature/AmazingFeature`
6. **Open a Pull Request** with clear description

### Areas for Contribution

- 📚 Expanding the knowledge base
- 🐛 Bug fixes and optimizations
- 💡 New features or improvements
- 📖 Documentation improvements
- 🌍 Translation support

---

## ❓ FAQ

**Q: Can I use this for other institutions?**
A: Yes! The architecture is generic and works with any institution's knowledge base. Clone the repo and update the knowledge base documents.

**Q: How much does it cost to run?**
A: The Groq API tier is free with a usage limit. Check [console.groq.com](https://console.groq.com) for current pricing.

**Q: Can I add custom documents to the knowledge base?**
A: Yes! Add PDF/text files to the knowledge base directory and rebuild the vector database from settings.

**Q: How accurate are the responses?**
A: Accuracy depends on the knowledge base quality. Responses are grounded in real documents and cite sources for verification.

**Q: Can I deploy this on my own server?**
A: Yes! You can deploy the FastAPI backend on any server (AWS, Azure, DigitalOcean, etc.) and the frontend on Netlify or your own hosting.

**Q: What if the knowledge base is outdated?**
A: Update the source documents and click **Rebuild Vector Database** in RAG Settings to refresh the index.

**Q: Is user data saved?**
A: No. By default, conversations are not persisted. See the Roadmap for future database integration.

---

## 👤 Credits & Support

<div align="center">

🤖

### Built for JIET Jodhpur

*"Instant answers, grounded in knowledge."*

</div>

<br/>

> 📬 **Feedback & Support** — [Open a GitHub Issue](https://github.com/yourusername/JIET-AI-Assistant/issues) with details
>
> 🐛 **Found a bug?** Report it with steps to reproduce and expected vs. actual behavior
>
> 💡 **Have a feature idea?** [Start a discussion](https://github.com/yourusername/JIET-AI-Assistant/discussions)
>
> ⭐ **Enjoying this?** A star helps others discover it!

<br/>

JIET AI Assistant is powered by **FastAPI + LangChain + FAISS**, with intelligence from **Groq's LLaMA 3.3 70B**, deployed on **Netlify**.

<div align="center">

<br/>

<sub>⭐ If JIET AI Assistant helped you, consider giving it a star on GitHub.</sub>

<br/>

**Version 1.0.0** · Status: ✅ Active & Maintained

<br/>

**[⬆ Back to top](#top)**

</div>
