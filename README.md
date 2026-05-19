# JIET AI Assistant 🤖

An intelligent conversational AI interface for JIET Jodhpur that provides instant access to admissions, placements, courses, and campus information using advanced retrieval-augmented generation (RAG) technology.

## 🌐 Live Demo

---

## Features ✨

- **Smart Query Understanding**: Natural language processing powered by Google Gemini API
- **RAG-Powered Responses**: Retrieval-Augmented Generation for accurate, source-backed answers
- **Comprehensive Knowledge Base**: 
  - 📝 Admission requirements & eligibility criteria
  - 💼 Placement statistics & career opportunities
  - 🎓 Undergraduate & postgraduate programs (B.Tech, M.Tech, MBA, MCA, PhD)
  - 🏫 Campus facilities & infrastructure details
  - 📚 Course specializations across 8+ academic streams

- **Configurable RAG Parameters**:
  - Top-K Sources: Adjustable relevance filtering
  - Temperature: Control response creativity (0-1 scale)
  - Chunk Size: Optimize text segmentation
  - Chunk Overlap: Fine-tune context retention
  - Vector DB Rebuilding: Manual index updates

- **Source Tracking**: View retrieved context and source documents
- **Real-time Responses**: Instant query processing with clean UI

## Tech Stack 🛠️

- **Frontend**: HTML, CSS, JavaScript
- **AI/LLM**: Google Gemini API
- **Search & RAG**: Local Vector Database with semantic search
- **Architecture**: Client-side with backend API integration

## Project Structure

```
JIET-AI-Assistant/
├── index.html          # Main interface
├── styles.css          # UI styling
├── script.js           # Frontend logic
├── config.js           # API configuration
└── README.md           # Documentation
```

## Getting Started 🚀

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/JIET-AI-Assistant.git
cd JIET-AI-Assistant
```

2. **Get API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key for Gemini API

3. **Configure API Key**
   - Open the application in your browser
   - Go to Settings panel
   - Enter your Gemini API key
   - The key is stored locally for your session

4. **Run Locally**
```bash
# Using Python
python -m http.server 5500

# Or use any local server of your choice
# Then navigate to: http://127.0.0.1:5500/index.html
```

## Usage 📖

### Basic Query
1. Type your question in the input field
2. Press Enter or click the send button
3. Receive AI-powered response with source references

### Example Queries
- "What are the admission requirements for B.Tech?"
- "Tell me about placement statistics"
- "What courses are offered in CSE?"
- "What is the duration of M.Tech programs?"

### RAG Settings
Access **RAG Settings** in the sidebar to fine-tune:
- **Top-K (Sources)**: Number of relevant sources to retrieve (1-10)
- **Temperature**: Response creativity level (0.0 = deterministic, 1.0 = creative)
- **Chunk Size**: Text segment size for vector database (256-2048 tokens)
- **Chunk Overlap**: Overlap between chunks for context continuity

### RAG Inspector
Monitor retrieved context in real-time:
- View source documents used for responses
- Track retrieval relevance scores
- Verify information sources

## Key Information 📚

### Programs Offered
- **Undergraduate**: B.Tech (4 years)
- **Postgraduate**: M.Tech, MBA, MCA (2 years each)
- **Doctoral**: PhD programs
- **Professional**: Diplomas in various fields

### Specializations
- Computer Science & Engineering (CSE)
- CSE with AI/ML
- Cyber Security
- Electronics & Communication Engineering (ECE)
- Electrical Engineering
- Mechanical Engineering
- Civil Engineering
- Data Science
- Cloud Computing
- IoT & More

### Contact
**JIET Jodhpur**
- Website: [jiet.ac.in](https://jiet.ac.in)
- Email: admissions@jiet.ac.in

## Screenshots 📸

![JIET AI Assistant - Main Interface](./screenshot1.png)
![RAG Settings & Query Response](./screenshot2.png)
![Admission Details Retrieval](./screenshot3.png)

## How RAG Works 🔍

1. **Indexing**: JIET knowledge base is converted into vector embeddings
2. **Retrieval**: User query is matched against indexed content using semantic search
3. **Augmentation**: Top-K relevant documents are retrieved based on similarity
4. **Generation**: Gemini AI generates contextual response using retrieved documents
5. **Source Display**: Original sources are displayed for verification

## API Configuration 🔑

The application uses:
- **Gemini API**: For natural language understanding and generation
- **Local Vector DB**: For semantic search and document retrieval

No backend server required - runs entirely client-side with API calls.

## Browser Compatibility ✅

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips ⚡

- Adjust **Top-K** to balance speed vs relevance
- Lower **Temperature** for factual consistency
- Rebuild Vector DB periodically for updated information
- Clear browser cache if experiencing issues

## Troubleshooting 🔧

### API Key Not Working
- Verify key is valid from Google AI Studio
- Check browser console for error messages
- Ensure API is enabled in your Google account

### No Results Retrieved
- Try rephrasing your question
- Increase Top-K sources in RAG settings
- Rebuild Vector Database from settings

### Slow Responses
- Reduce Chunk Size
- Decrease Top-K sources
- Check your internet connection

## Future Enhancements 🎯

- [ ] Backend server integration
- [ ] Database persistence
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Export conversation history
- [ ] Voice input/output
- [ ] Mobile app version

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer ⚠️

This is an unofficial AI assistant for JIET Jodhpur. For official information, please visit [jiet.ac.in](https://jiet.ac.in) or contact the admissions office directly.

## Support 💬

For issues, questions, or suggestions:
- Open an GitHub Issue
- Check existing documentation
- Contact the repository maintainer

---

**Made with ❤️ for JIET Jodhpur community**

⭐ If you find this helpful, please consider giving it a star!
