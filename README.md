<div align="center">

<img src="https://img.shields.io/badge/🤖-JIET_AI_Assistant-6C5CE7?style=for-the-badge&labelColor=2D3436" alt="JIET AI Assistant" height="60"/>

### Instant, source-backed answers about admissions, placements, courses & campus life

*A Retrieval-Augmented Generation (RAG) assistant built for JIET Jodhpur — no more digging through PDFs.*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Try_it_now-00C7B7?style=for-the-badge)](https://jietassistant.netlify.app)

<br/>

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-RAG_Pipeline-1C3C3C?style=flat-square)](https://www.langchain.com/)
[![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-4B8BBE?style=flat-square)](https://github.com/facebookresearch/faiss)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=flat-square)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

<br/>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Configuration Reference](#configuration-reference)
- [Program Information](#program-information)
- [Performance Tuning](#performance-tuning)
- [Troubleshooting](#troubleshooting)
- [Browser Support](#browser-support)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License & Disclaimer](#license--disclaimer)
- [Support](#support)

<br/>

## Overview

**JIET AI Assistant** is a conversational interface that gives prospective and current students a fast way to get accurate information about **JIET Jodhpur** — admissions, eligibility, placements, courses, and campus facilities — without searching through scattered PDFs and web pages.

Every response is grounded in a real knowledge base via **Retrieval-Augmented Generation (RAG)**, so answers come with cited sources rather than generic AI guesses.

> **[Try the live demo →](https://jietassistant.netlify.app)** — runs entirely in your browser, no installation required.

<br/>

## Features

<table>
<tr>
<td width="50%" valign="top">

### Intelligence
- Smart query understanding powered by Groq's LLaMA 3.3 70B for near-instant NLP
- RAG-grounded responses — every answer traces back to real source content
- Transparent sourcing — inspect the retrieved context behind any answer
- Real-time chat with a clean, responsive UI

</td>
<td width="50%" valign="top">

### Knowledge Coverage
- Admission requirements & eligibility criteria
- Placement statistics & career outcomes
- UG & PG programs — B.Tech, M.Tech, MBA, MCA, PhD
- Campus facilities & infrastructure
- 8+ academic streams and specializations

</td>
</tr>
</table>

### Configurable RAG Parameters

| Parameter | Purpose |
|---|---|
| **Top-K Sources** | Controls how many relevant documents are retrieved |
| **Temperature** | Balances factual precision vs. response creativity |
| **Chunk Size** | Optimizes how source text is segmented for indexing |
| **Chunk Overlap** | Preserves context continuity between chunks |
| **Vector DB Rebuild** | Manually refresh the index with updated content |

<br/>

## How It Works

```
1. Indexing        Knowledge base is embedded into a vector store
2. Retrieval        User query is matched via semantic search
3. Augmentation     Top-K most relevant documents are pulled in
4. Generation       Groq (LLaMA 3.3 70B) generates a grounded response
5. Source Display   Original sources are surfaced for verification
```

<br/>

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML, CSS, JavaScript |
| **AI / LLM** | Groq API — LLaMA 3.3 70B Versatile |
| **Backend / RAG** | FastAPI, LangChain, FAISS vector database |
| **Architecture** | Hybrid — FastAPI backend with browser-side fallback |

<br/>

## Getting Started

### Prerequisites

- Python 3.9+
- A modern browser (Chrome, Firefox, Safari, or Edge)
- A free Groq API key (console.groq.com/keys)

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

**3. Configure your environment**

Create a `.env` file in the project root:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

**4. Launch the app**
```bash
python run_servers.py
```

Then open **http://127.0.0.1:8000/** in your browser.

<br/>

## Usage Guide

### Asking a Question

| Step | Action |
|---|---|
| 1 | Type your question into the chat input |
| 2 | Press Enter or click send |
| 3 | Receive an AI-generated answer with cited sources |

### Example Queries

- "What are the admission requirements for B.Tech?"
- "Tell me about placement statistics."
- "What courses are offered in CSE?"
- "What is the duration of M.Tech programs?"

### RAG Inspector

Use the sidebar's RAG Settings panel to monitor and fine-tune retrieval in real time:
- View the source documents behind each response
- Track retrieval relevance scores
- Cross-check the information sources

<br/>

## Configuration Reference

| Setting | Range | Recommended | Effect |
|---|---|---|---|
| Top-K Sources | 1–10 | 3–5 | Higher = broader context, slower response |
| Temperature | 0.0–1.0 | 0.2–0.4 | Lower = more deterministic, factual answers |
| Chunk Size | 256–2048 tokens | 512 | Larger = more context per chunk |
| Chunk Overlap | — | 10–20% of chunk size | Improves continuity across chunk boundaries |

<br/>

## Program Information

### Programs Offered

| Level | Programs | Duration |
|---|---|---|
| Undergraduate | B.Tech | 4 years |
| Postgraduate | M.Tech, MBA, MCA | 2 years |
| Doctoral | PhD | Variable |
| Professional | Diplomas in various fields | Varies |

### Specializations

Computer Science & Engineering (CSE), CSE with AI/ML, Cyber Security, Electronics & Communication Engineering (ECE), Electrical Engineering, Mechanical Engineering, Civil Engineering, Data Science, Cloud Computing, IoT, and more

### Official Contact

**JIET Jodhpur**
Website: jiet.ac.in — Email: admissions@jiet.ac.in

<br/>

## Performance Tuning

- Lower Top-K for faster responses; raise it for broader coverage
- Lower Temperature for more consistent, factual answers
- Rebuild the vector database periodically to reflect updated content
- Clear your browser cache if the UI behaves unexpectedly

<br/>

## Troubleshooting

<details>
<summary><strong>API key not working</strong></summary>
<br/>

- Confirm the key is valid in your Groq Console
- Check the browser console for error output
- Make sure the API is enabled on your Groq account
</details>

<details>
<summary><strong>No results retrieved</strong></summary>
<br/>

- Rephrase your question
- Increase Top-K sources in RAG settings
- Rebuild the vector database from settings
</details>

<details>
<summary><strong>Slow responses</strong></summary>
<br/>

- Reduce chunk size
- Decrease Top-K sources
- Check your internet connection
</details>

<br/>

## Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

<br/>

## Project Structure

```
JIET-AI-Assistant/
├── index.html          Main chat interface
├── style.css            UI styling
├── script.js            Frontend logic
├── main.py               FastAPI & RAG backend
├── run_servers.py        Server launcher
├── .env                   API keys & environment variables
└── README.md
```

<br/>

## Roadmap

- [ ] Persistent backend database
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Conversation history export
- [ ] Voice input/output
- [ ] Mobile app version

<br/>

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/AmazingFeature`
3. Commit your changes — `git commit -m 'Add AmazingFeature'`
4. Push the branch — `git push origin feature/AmazingFeature`
5. Open a pull request

<br/>

## License & Disclaimer

Licensed under the MIT License (see LICENSE).

> This is an unofficial, independently built AI assistant for JIET Jodhpur. For official information, visit jiet.ac.in or contact the admissions office directly.

<br/>

## Support

- Open a GitHub Issue for bugs or feature requests
- Check the documentation above before filing a new issue
- Reach out to the repository maintainer for anything else
