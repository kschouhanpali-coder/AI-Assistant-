// Dynamic API Base URL: use relative paths only if served on the FastAPI port (8000), fallback to current hostname
const hostname = window.location.hostname || '127.0.0.1';
let API_BASE = `http://${hostname}:8000`;
if (window.location.port === '8000') {
    API_BASE = '';
} else if (hostname.includes('github.io')) {
    // When hosted on GitHub Pages (HTTPS), point to the local backend.
    // Note: You must run the Python backend locally, and your browser must allow 
    // mixed content (or localhost access) for this to work.
    API_BASE = 'http://localhost:8000';
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
            const res = await fetch(`${API_BASE}/api/reindex`, {
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
let apiKey = localStorage.getItem('jiet_api_key') || '';
if (apiKey) {
    apiKeyInput.value = apiKey;
    keyStatus.textContent = 'Key loaded from storage';
}

saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        localStorage.setItem('jiet_api_key', key);
        apiKey = key;
        keyStatus.textContent = 'Saved successfully!';
        keyStatus.style.color = '#4ade80';
        setTimeout(() => { keyStatus.textContent = ''; }, 3000);
    } else {
        localStorage.removeItem('jiet_api_key');
        apiKey = '';
        keyStatus.textContent = 'Key removed';
        keyStatus.style.color = '#f87171';
        setTimeout(() => { keyStatus.textContent = ''; }, 3000);
    }
});



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
        const response = await fetch(`${API_BASE}/api/chat`, {
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
        console.error('Error:', error);
        removeTypingIndicator();
        chatContainer.appendChild(createMessageElement('Network error. Is the server running?', false));
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
