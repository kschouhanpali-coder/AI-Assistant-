// Dynamic API Base URL: prioritize user-saved Backend URL in localStorage, fallback to current environment defaults
let API_BASE = localStorage.getItem('jiet_backend_url') || '';
const currentHostname = window.location.hostname || '127.0.0.1';
let isAutoTunnelResolved = false;

// Global cache for client-side RAG fallback
let cachedDocumentText = null;

// Client-side simple TF-IDF and keyword matching ranker
function rankChunks(chunks, query) {
    const stopWords = new Set(["the", "a", "is", "of", "and", "in", "to", "for", "on", "with", "at", "by", "an", "it", "from", "are", "what", "tell", "me", "about", "how", "can", "you", "we", "i", "do", "does", "any", "some", "my", "your"]);
    const queryTokens = query.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length > 1 && !stopWords.has(t));
        
    if (queryTokens.length === 0) {
        queryTokens.push(...query.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length > 0));
    }

    const scoredChunks = chunks.map(chunk => {
        let score = 0;
        const textLower = chunk.toLowerCase();
        
        const lines = chunk.split('\n');
        const headings = lines.filter(line => line.trim().startsWith('#'));
        const headingsText = headings.join(' ').toLowerCase();

        queryTokens.forEach(token => {
            const regex = new RegExp(token.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            const count = (textLower.match(regex) || []).length;
            const headingCount = (headingsText.match(regex) || []).length;
            score += count + (headingCount * 8);
        });

        const wordCount = chunk.split(/\s+/).length;
        if (wordCount > 0) {
            score = score / Math.sqrt(wordCount);
        }

        return { chunk, score };
    });

    return scoredChunks
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.chunk);
}

// On localhost/127.0.0.1, always bypass saved tunnels and use the local direct server to prevent stale cache blocks
if (currentHostname === 'localhost' || currentHostname === '127.0.0.1') {
    API_BASE = `http://${currentHostname}:8000`;
    isAutoTunnelResolved = true;
} else if (window.location.protocol === 'https:' && API_BASE.startsWith('http://')) {
    console.warn("Cleared insecure HTTP backend URL on HTTPS page to prevent mixed content blocking.");
    localStorage.removeItem('jiet_backend_url');
    API_BASE = '';
}

if (!API_BASE) {
    if (window.location.port === '8000') {
        API_BASE = '';
        isAutoTunnelResolved = true;
    } else if (currentHostname.includes('github.io')) {
        API_BASE = ''; // Will resolve asynchronously via backend_url.json on demand
    } else {
        API_BASE = `http://${currentHostname}:8000`;
    }
} else {
    // Normalize user-provided URL (remove trailing slash if exists)
    API_BASE = API_BASE.replace(/\/$/, '');
    isAutoTunnelResolved = true;
}

// Perform client-side RAG search and AI generation (or raw text fallback)
async function clientSideRag(message, topK, temperature) {
    console.log("Switching to Client-Side RAG Fallback...");
    
    // 1. Load document if not already cached
    if (!cachedDocumentText) {
        console.log("Loading JIET_Master_Document.md client-side...");
        const response = await fetch('./JIET_Master_Document.md');
        if (!response.ok) {
            throw new Error("Unable to fetch master document from server.");
        }
        cachedDocumentText = await response.text();
    }

    // 2. Chunk the document by horizontal rule '---'
    const chunks = cachedDocumentText
        .split(/\n\s*---\s*\n/)
        .map(c => c.trim())
        .filter(c => c.length > 0);

    // 3. Rank chunks based on query
    const ranked = rankChunks(chunks, message);
    if (ranked.length === 0) {
        return {
            answer: "I couldn't find specific information about that in the JIET Master Document. Could you try rephrasing your question?",
            context_used: [],
            is_genai: false
        };
    }

    const topChunks = ranked.slice(0, topK);
    const contextText = topChunks.join('\n\n');

    // 4. If we have a Gemini API key, run generation in client browser
    if (apiKey && apiKey.trim() !== '') {
        console.log("Found Gemini API key. Generating answer using client-side Gemini API...");
        const prompt = `You are the official AI assistant for Jodhpur Institute of Engineering & Technology (JIET).
You must answer the user's question politely and professionally, using ONLY the information provided in the Context below.
If the context doesn't contain the answer, say you don't know based on the provided document.
Use markdown for formatting (bullet points, bold text). Keep it concise but comprehensive.

Context:
${contextText}

User Question: ${message}
`;

        const cleanedKey = apiKey.replace(/[^a-zA-Z0-9_-]/g, '');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanedKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: temperature
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData?.error?.message || `API error (${response.status})`;
            throw new Error(`Gemini API Error: ${errMsg}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const answer = data.candidates[0].content.parts[0].text;
            return {
                answer: answer,
                context_used: topChunks,
                is_genai: true
            };
        } else {
            throw new Error("Invalid response format from Gemini API.");
        }
    } else {
        // No Gemini API Key: return the top chunk content directly as fallback
        console.log("No Gemini API key found. Falling back to direct Local RAG content match...");
        return {
            answer: topChunks[0],
            context_used: topChunks,
            is_genai: false
        };
    }
}

// Asynchronously resolve tunnel URL from backend_url.json if running on GitHub Pages
async function getApiBase() {
    if (isAutoTunnelResolved && API_BASE) {
        return API_BASE;
    }

    if (currentHostname.includes('github.io') || !API_BASE) {
        try {
            console.log("Attempting to auto-discover secure tunnel URL...");
            // Use cache-busting timestamp to prevent stale browser caches
            const response = await fetch(`./backend_url.json?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.url) {
                    console.log("Auto-discovered active secure tunnel:", data.url);
                    API_BASE = data.url.replace(/\/$/, '');
                    isAutoTunnelResolved = true;
                    return API_BASE;
                }
            }
        } catch (e) {
            console.warn("Could not load backend_url.json:", e);
        }
    }

    return API_BASE || `http://${currentHostname}:8000`;
}

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');
const sendBtn = document.getElementById('send-btn');
const suggestions = document.getElementById('suggestions');
const clearBtn = document.getElementById('clear-chat');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const keyStatus = document.getElementById('key-status');
const topKSlider = document.getElementById('top-k-slider');
const topKValue = document.getElementById('top-k-value');
const tempSlider = document.getElementById('temp-slider');
const tempValue = document.getElementById('temp-value');
const chunkSizeSlider = document.getElementById('chunk-size-slider');
const chunkSizeValue = document.getElementById('chunk-size-value');
const chunkOverlapSlider = document.getElementById('chunk-overlap-slider');
const chunkOverlapValue = document.getElementById('chunk-overlap-value');
const reindexBtn = document.getElementById('reindex-btn');
const reindexStatus = document.getElementById('reindex-status');

// Update slider value displays
function bindSlider(slider, display, fixed) {
    if (slider && display) {
        slider.addEventListener('input', (e) => {
            display.textContent = fixed ? parseFloat(e.target.value).toFixed(1) : e.target.value;
        });
    }
}
bindSlider(topKSlider, topKValue, false);
bindSlider(tempSlider, tempValue, true);
bindSlider(chunkSizeSlider, chunkSizeValue, false);
bindSlider(chunkOverlapSlider, chunkOverlapValue, false);

// Reindex Vector DB button
if (reindexBtn) {
    reindexBtn.addEventListener('click', async () => {
        const chunkSize = chunkSizeSlider ? parseInt(chunkSizeSlider.value) : 1000;
        const chunkOverlap = chunkOverlapSlider ? parseInt(chunkOverlapSlider.value) : 150;
        reindexBtn.disabled = true;
        reindexBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Rebuilding...';
        if (reindexStatus) reindexStatus.textContent = '';
        try {
            const currentApiBase = await getApiBase();
            const res = await fetch(`${currentApiBase}/api/reindex`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chunk_size: chunkSize, chunk_overlap: chunkOverlap })
            });
            const data = await res.json();
            if (res.ok) {
                if (reindexStatus) {
                    reindexStatus.textContent = `Rebuilt with ${data.chunks} chunks`;
                    reindexStatus.style.color = '#4ade80';
                }
            } else {
                if (reindexStatus) {
                    reindexStatus.textContent = 'Reindex failed';
                    reindexStatus.style.color = '#f87171';
                }
            }
        } catch (e) {
            if (reindexStatus) {
                reindexStatus.textContent = 'Server not running';
                reindexStatus.style.color = '#f87171';
            }
        } finally {
            reindexBtn.disabled = false;
            reindexBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Rebuild Vector DB';
            setTimeout(() => { if (reindexStatus) reindexStatus.textContent = ''; }, 4000);
        }
    });
}

// Load API key from local storage
let apiKey = (localStorage.getItem('jiet_api_key') || '').replace(/[^a-zA-Z0-9_-]/g, '');
if (apiKey) {
    apiKeyInput.value = apiKey;
    keyStatus.textContent = 'Key loaded from storage';
}

saveKeyBtn.addEventListener('click', () => {
    // Keep ONLY valid ASCII alphanumeric characters, hyphens, and underscores
    const key = apiKeyInput.value.replace(/[^a-zA-Z0-9_-]/g, '');
    if (key) {
        localStorage.setItem('jiet_api_key', key);
        apiKey = key;
        apiKeyInput.value = key; // Update input value with cleaned key
        keyStatus.textContent = 'Saved successfully!';
        keyStatus.style.color = '#4ade80';
        setTimeout(() => { keyStatus.textContent = ''; }, 3000);
    } else {
        localStorage.removeItem('jiet_api_key');
        apiKey = '';
        apiKeyInput.value = '';
        keyStatus.textContent = 'Key removed';
        keyStatus.style.color = '#f87171';
        setTimeout(() => { keyStatus.textContent = ''; }, 3000);
    }
});

// Load and manage Backend / Tunnel URL
const apiUrlInput = document.getElementById('api-url-input');
const saveUrlBtn = document.getElementById('save-url-btn');
const urlStatus = document.getElementById('url-status');
const tunnelSettingsGroup = document.getElementById('tunnel-settings-group');

// Double-click Settings title to toggle hidden Developer Mode panel
const settingsHeader = document.querySelector('.sidebar h3');
if (settingsHeader && tunnelSettingsGroup) {
    settingsHeader.style.cursor = 'pointer';
    settingsHeader.title = 'Double-click to toggle advanced settings';
    settingsHeader.addEventListener('dblclick', () => {
        const isHidden = tunnelSettingsGroup.style.display === 'none';
        tunnelSettingsGroup.style.display = isHidden ? 'block' : 'none';
        urlStatus.textContent = isHidden ? 'Advanced developer settings revealed!' : '';
        urlStatus.style.color = '#38bdf8';
        if (isHidden) {
            setTimeout(() => { urlStatus.textContent = ''; }, 3000);
        }
    });
}

if (apiUrlInput) {
    apiUrlInput.value = localStorage.getItem('jiet_backend_url') || '';
}

if (saveUrlBtn) {
    saveUrlBtn.addEventListener('click', () => {
        const url = apiUrlInput.value.trim();
        if (url) {
            const normalizedUrl = url.replace(/\/$/, '');
            
            // Validate secure protocols on HTTPS hosting
            if (window.location.protocol === 'https:' && normalizedUrl.startsWith('http://')) {
                urlStatus.textContent = '⚠️ HTTPS pages require a secure https:// Tunnel URL!';
                urlStatus.style.color = '#f87171';
                return;
            }
            
            localStorage.setItem('jiet_backend_url', normalizedUrl);
            API_BASE = normalizedUrl;
            urlStatus.textContent = 'URL saved successfully!';
            urlStatus.style.color = '#4ade80';
            setTimeout(() => { urlStatus.textContent = ''; }, 3000);
        } else {
            localStorage.removeItem('jiet_backend_url');
            // Reset to defaults
            const hostname = window.location.hostname || '127.0.0.1';
            API_BASE = `http://${hostname}:8000`;
            if (window.location.port === '8000') {
                API_BASE = '';
            } else if (hostname.includes('github.io')) {
                API_BASE = '';
            }
            apiUrlInput.value = '';
            urlStatus.textContent = 'Reset to default URL';
            urlStatus.style.color = '#f87171';
            setTimeout(() => { urlStatus.textContent = ''; }, 3000);
        }
    });
}



function createMessageElement(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.innerHTML = isUser ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    
    if (isUser) {
        messageContent.textContent = content;
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
    } else {
        messageContent.innerHTML = marked.parse(content);
        
        // Add copy button wrapper for bot messages
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('bot-content-wrapper');
        contentWrapper.style.position = 'relative';
        contentWrapper.style.display = 'flex';
        contentWrapper.style.flexDirection = 'column';
        contentWrapper.style.gap = '8px';
        contentWrapper.style.width = '100%';
        
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        copyBtn.classList.add('copy-btn');
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(content).then(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        };
        
        contentWrapper.appendChild(messageContent);
        contentWrapper.appendChild(copyBtn);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentWrapper);
    }
    
    // Add timestamp
    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    const now = new Date();
    timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    messageContainer.classList.add(isUser ? 'user-container' : 'bot-container');
    
    messageContainer.appendChild(messageDiv);
    messageContainer.appendChild(timestamp);

    return messageContainer;
}

function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('message', 'bot-message');
    indicatorDiv.id = 'typing-indicator';

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

    const content = document.createElement('div');
    content.classList.add('message-content', 'typing-indicator');
    content.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';

    indicatorDiv.appendChild(avatar);
    indicatorDiv.appendChild(content);
    chatContainer.appendChild(indicatorDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Set marked options for security and styling
marked.setOptions({
    breaks: true,
    gfm: true
});

async function sendMessage(message) {
    if (!message.trim()) return;

    // Hide suggestions
    if (suggestions) {
        suggestions.style.display = 'none';
    }

    // Add user message to UI
    chatContainer.appendChild(createMessageElement(message, true));
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Clear input
    userInput.value = '';
    userInput.style.height = '44px'; // Reset height
    sendBtn.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
        const topK = topKSlider ? parseInt(topKSlider.value) : 4;
        const temperature = tempSlider ? parseFloat(tempSlider.value) : 0.7;
        const currentApiBase = await getApiBase();
        const response = await fetch(`${currentApiBase}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: message,
                api_key: apiKey,
                top_k: topK,
                temperature: temperature
            })
        });

        const data = await response.json();
        removeTypingIndicator();

        if (response.ok) {
            chatContainer.appendChild(createMessageElement(data.answer, false));
            
            // Dynamic RAG status badge switcher
            const statusBadge = document.getElementById('rag-status-badge');
            if (statusBadge) {
                if (data.is_genai) {
                    statusBadge.className = 'rag-status-badge active-mode';
                    statusBadge.querySelector('.status-text').textContent = 'Gen AI + RAG';
                } else {
                    statusBadge.className = 'rag-status-badge local-mode';
                    statusBadge.querySelector('.status-text').textContent = 'Local RAG';
                }
            }
            
            if (data.context_used) {
                updateInspector(data.context_used);
            }
        } else {
            chatContainer.appendChild(createMessageElement('Sorry, an error occurred while connecting to the server.', false));
        }
    } catch (error) {
        console.warn('Backend server unreachable, attempting client-side RAG fallback:', error);
        try {
            const topK = topKSlider ? parseInt(topKSlider.value) : 4;
            const temperature = tempSlider ? parseFloat(tempSlider.value) : 0.7;
            const clientResult = await clientSideRag(message, topK, temperature);
            
            removeTypingIndicator();
            chatContainer.appendChild(createMessageElement(clientResult.answer, false));
            
            // Update status badge
            const statusBadge = document.getElementById('rag-status-badge');
            if (statusBadge) {
                if (clientResult.is_genai) {
                    statusBadge.className = 'rag-status-badge active-mode';
                    statusBadge.querySelector('.status-text').textContent = 'Client RAG + Gemini';
                } else {
                    statusBadge.className = 'rag-status-badge local-mode';
                    statusBadge.querySelector('.status-text').textContent = 'Client RAG (Local)';
                }
            }
            
            if (clientResult.context_used) {
                updateInspector(clientResult.context_used);
            }
        } catch (fallbackError) {
            console.error('Client-side RAG fallback also failed:', fallbackError);
            removeTypingIndicator();
            
            let errorMsg = 'Sorry, I am having trouble reaching the assistant server. Please check your connection and try again.';
            if (window.location.protocol === 'https:' || (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')) {
                errorMsg = '⚠️ **Connection Error:** Browsers block secure online pages from accessing local backend servers directly. To run 100% locally with zero configuration, please open **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)** in a new browser tab to start chatting!';
            }
            
            chatContainer.appendChild(createMessageElement(errorMsg, false));
        }
    } finally {
        sendBtn.disabled = false;
        userInput.focus();
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(userInput.value);
});

// Auto-grow textarea height and enter-key submission
let lastLength = 0;
if (userInput) {
    userInput.addEventListener('input', () => {
        const currentLength = userInput.value.length;
        // Only reset height to auto if user is deleting text (length decreased)
        if (currentLength < lastLength) {
            userInput.style.height = '44px'; // Reset to base height to allow shrinking
        }
        lastLength = currentLength;

        // Calculate perfect height
        const newHeight = Math.min(userInput.scrollHeight, 120);
        userInput.style.height = newHeight + 'px';
        
        // Show scrollbar only when height exceeds max limit
        if (userInput.scrollHeight > 120) {
            userInput.style.overflowY = 'auto';
        } else {
            userInput.style.overflowY = 'hidden';
            userInput.scrollTop = 0;
        }
    });

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent default newline behavior
            chatForm.dispatchEvent(new Event('submit')); // Trigger form submission
        }
    });
}

// For suggestions to work
window.fillAndSend = function(text) {
    sendMessage(text);
}

clearBtn.addEventListener('click', () => {
    const welcomeHtml = `
        <div class="message-container bot-container">
            <div class="message bot-message">
                <div class="avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="message-content">
                    Hello! I'm the official AI Assistant for JIET Jodhpur. How can I help you today?
                </div>
            </div>
            <div class="timestamp">System</div>
        </div>
    `;
    chatContainer.innerHTML = welcomeHtml;
    if (suggestions) {
        chatContainer.appendChild(suggestions);
        suggestions.style.display = 'flex';
    }
    
    // Clear inspector
    updateInspector([]);
});

function updateInspector(contextList) {
    const inspectorContent = document.getElementById('inspector-content');
    if (!inspectorContent) return;

    if (!contextList || contextList.length === 0) {
        inspectorContent.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-database"></i>
                <p>No context retrieved.</p>
            </div>
        `;
        return;
    }

    let html = '';
    contextList.forEach((context, index) => {
        html += `
            <div class="context-chunk">
                <h4>Source ${index + 1}</h4>
                <div class="chunk-text">${marked.parse(context)}</div>
            </div>
        `;
    });
    
    inspectorContent.innerHTML = html;
}
