<div align="center">

# 🤖 JIET AI Assistant

**Instant answers about admissions, placements, courses, and campus life.**

An intelligent conversational AI interface for JIET Jodhpur, powered by Retrieval-Augmented Generation (RAG) to deliver accurate, source-backed answers to student and applicant questions.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Try_Now-00C7B7?style=for-the-badge)](https://jietassistant.netlify.app)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square)
![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-4B8BBE?style=flat-square)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=flat-square)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [How RAG Works](#-how-rag-works)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Key Information](#-key-information)
- [Performance Tips](#-performance-tips)
- [Troubleshooting](#-troubleshooting)
- [Browser Compatibility](#-browser-compatibility)
- [Project Structure](#-project-structure)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Disclaimer](#️-disclaimer)
- [Support](#-support)

---

## 🎯 Overview

**JIET AI Assistant** gives prospective and current students a fast, conversational way to get information about JIET Jodhpur — instead of digging through PDFs and web pages. Every answer is grounded in a real knowledge base through RAG, so responses come with source references rather than generic AI guesses, covering everything from admission eligibility to placement statistics to campus facilities.

---

## 🌐 Live Demo

<div align="center">

### 👉 [**Try JIET AI Assistant Now**](https://jietassistant.netlify.app)

*Runs live in your browser — no installation required.*

</div>

---

## ✨ Features

<table>
<tr>
<td valign="top" width="50%">

### 🧠 Intelligence
- **Smart Query Understanding** — ultra-fast NLP powered by Groq (LLaMA 3.3 70B)
- **RAG-Powered Responses** — accurate, source-backed answers via retrieval-augmented generation
- **Source Tracking** — view retrieved context and source documents
- **Real-time Responses** — instant query processing with a clean UI

</td>
<td valign="top" width="50%">

### 📚 Knowledge Base
- Admission requirements & eligibility criteria
- Placement statistics & career opportunities
- Undergraduate & postgraduate programs (B.Tech, M.Tech, MBA, MCA, PhD)
- Campus facilities & infrastructure details
- Course specializations across 8+ academic streams

</td>
</tr>
</table>

### ⚙️ Configurable RAG Parameters

| Parameter | Purpose |
|---|---|
| **Top-K Sources** | Adjustable relevance filtering |
| **Temperature** | Control response creativity (0–1 scale) |
| **Chunk Size** | Optimize text segmentation |
| **Chunk Overlap** | Fine-tune context retention |
| **Vector DB Rebuilding** | Manual index updates |

---

## 🔍 How RAG Works

1. **Indexing** — the JIET knowledge base is converted into vector embeddings
2. **Retrieval** — the user query is matched against indexed content using semantic search
3. **Augmentation** — the top-K most relevant documents are retrieved based on similarity
4. **Generation** — Groq generates a contextual response using the retrieved documents
5. **Source Display** — original sources are displayed for verification

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML, CSS, JavaScript |
| **AI / LLM** | Groq API (LLaMA 3.3 70B Versatile) |
| **Backend / RAG** | FastAPI, LangChain, FAISS Vector Database with semantic search |
| **Architecture** | Hybrid (FastAPI backend + browser fallback) |

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.9+
- Groq API key

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/JIET-AI-Assistant.git
cd JIET-AI-Assistant
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Get an API key and configure `.env`**

Visit the [Groq Console](https://console.groq.com/keys), create a free API key, and add it to your `.env` file:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

**4. Run the backend and application**
```bash
python run_servers.py
```

Then navigate to **http://127.0.0.1:8000/** 🚀

---

## 📖 Usage

### Basic Query

| Step | Action |
|---|---|
| 1️⃣ | Type your question in the input field |
| 2️⃣ | Press Enter or click the send button |
| 3️⃣ | Receive an AI-powered response with source references |

### Example Queries
- *"What are the admission requirements for B.Tech?"*
- *"Tell me about placement statistics"*
- *"What courses are offered in CSE?"*
- *"What is the duration of M.Tech programs?"*

### RAG Settings
Access **RAG Settings** in the sidebar to fine-tune:
- **Top-K (Sources)** — number of relevant sources to retrieve (1–10)
- **Temperature** — response creativity level (0.0 = deterministic, 1.0 = creative)
- **Chunk Size** — text segment size for the vector database (256–2048 tokens)
- **Chunk Overlap** — overlap between chunks for context continuity

### RAG Inspector
Monitor retrieved context in real time:
- View source documents used for responses
- Track retrieval relevance scores
- Verify information sources

---

## 📚 Key Information

### Programs Offered
| Level | Programs |
|---|---|
| **Undergraduate** | B.Tech (4 years) |
| **Postgraduate** | M.Tech, MBA, MCA (2 years each) |
| **Doctoral** | PhD programs |
| **Professional** | Diplomas in various fields |

### Specializations
`Computer Science & Engineering (CSE)` · `CSE with AI/ML` · `Cyber Security` · `Electronics & Communication Engineering (ECE)` · `Electrical Engineering` · `Mechanical Engineering` · `Civil Engineering` · `Data Science` · `Cloud Computing` · `IoT` · and more

### Contact
**JIET Jodhpur**
- 🌐 Website: [jiet.ac.in](https://jiet.ac.in)
- 📧 Email: admissions@jiet.ac.in

---

## ⚡ Performance Tips

- Adjust **Top-K** to balance speed vs. relevance
- Lower **Temperature** for factual consistency
- Rebuild the Vector DB periodically for updated information
- Clear your browser cache if experiencing issues

---

## 🔧 Troubleshooting

<details>
<summary><strong>API Key Not Working</strong></summary>

- Verify the key is valid from your Groq Console
- Check the browser console for error messages
- Ensure the API is enabled on your account
</details>

<details>
<summary><strong>No Results Retrieved</strong></summary>

- Try rephrasing your question
- Increase Top-K sources in RAG settings
- Rebuild the Vector Database from settings
</details>

<details>
<summary><strong>Slow Responses</strong></summary>

- Reduce Chunk Size
- Decrease Top-K sources
- Check your internet connection
</details>

---

## ✅ Browser Compatibility

| Browser | Minimum Version |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## 📁 Project Structure

```bash
JIET-AI-Assistant/
├── index.html          # Main interface
├── style.css           # UI styling
├── script.js           # Frontend logic
├── main.py             # FastAPI & RAG backend
├── run_servers.py      # Server launcher
├── .env                # API keys and environment variables
└── README.md
```

---

## 🎯 Future Enhancements

- [ ] Backend server integration
- [ ] Database persistence
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Export conversation history
- [ ] Voice input/output
- [ ] Mobile app version

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This is an unofficial AI assistant for JIET Jodhpur. For official information, please visit [jiet.ac.in](https://jiet.ac.in) or contact the admissions office directly.

---

## 💬 Support

For issues, questions, or suggestions:
- Open a GitHub Issue
- Check existing documentation
- Contact the repository maintainer
