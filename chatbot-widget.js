// Portfolio Chatbot Widget - FIXED VERSION
// Fixes: name consistency, markdown rendering, XSS, dark mode, variable shadowing, reasoning bar

(function () {
  let embeddingsData = null;
  let isLoading = false;


  async function generateAgentResponse(query) {
    const reasoningContainer = document.getElementById('portfolio-chatbot-reasoning');
    
    const steps = [
      { msg: 'Connecting to Groq reasoning engine...', delay: 350 },
      { msg: 'Scanning portfolio knowledge base...', delay: 500 },
      { msg: 'Composing AI response...', delay: 400 }
    ];

    if (reasoningContainer) {
      reasoningContainer.classList.remove('hidden');
      for (const step of steps) {
        reasoningContainer.innerHTML = `<span class="reason-dot"></span> ${step.msg}`;
        await new Promise(r => setTimeout(r, step.delay));
      }
      reasoningContainer.classList.add('hidden');
    }

    try {
      const response = await fetch('https://omerfarooq223-github-io-git-main-omerfarooq223s-projects.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.answer || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Chatbot API Error:', error);
      return "I'm having trouble connecting to my brain right now. 🧠 Please make sure the Vercel backend is deployed and GROQ_API_KEY is set!";
    }
  }


  // Lightweight markdown renderer for chat messages
  function renderMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')    // **bold**
      .replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>')       // _italic_ (not mid-word underscores)
      .replace(/\n/g, '<br>');                                // newlines
  }

  // Sanitize text to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  const styles = `
    .portfolio-chatbot-icon {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 99999;
      transition: all 0.3s ease;
    }

    .portfolio-chatbot-icon:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }

    .portfolio-chatbot-icon svg {
      width: 24px;
      height: 24px;
      color: white;
    }

    .portfolio-chatbot-window {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 384px;
      height: 600px;
      background: #0f172a;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      z-index: 99999;
      overflow: hidden;
      animation: slideIn 0.3s ease;
      font-family: 'Inter', -apple-system, system-ui, sans-serif;
    }

    .portfolio-chatbot-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .portfolio-chatbot-header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .portfolio-chatbot-header h2::before {
      content: '';
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }

    .portfolio-chatbot-close {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    }

    .portfolio-chatbot-close:hover {
      color: white;
    }

    .portfolio-chatbot-reasoning {
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding: 8px 16px;
      font-size: 11px;
      color: #a78bfa;
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .reason-dot {
      width: 6px;
      height: 6px;
      background: #a78bfa;
      border-radius: 50%;
      animation: pulse 1s infinite;
    }

    .portfolio-chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #0f172a;
    }

    .portfolio-chatbot-messages::-webkit-scrollbar {
      width: 4px;
    }

    .portfolio-chatbot-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .portfolio-chatbot-messages::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }

    .portfolio-chatbot-message {
      display: flex;
      gap: 8px;
      animation: slideIn 0.3s ease;
    }

    .portfolio-chatbot-message.user {
      justify-content: flex-end;
    }

    .portfolio-chatbot-message-content {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
    }

    .portfolio-chatbot-message.bot .portfolio-chatbot-message-content {
      background: rgba(255, 255, 255, 0.06);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .portfolio-chatbot-message.user .portfolio-chatbot-message-content {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
    }

    .portfolio-chatbot-message-content strong {
      color: #a78bfa;
      font-weight: 600;
    }

    .portfolio-chatbot-message-content em {
      color: #94a3b8;
      font-style: italic;
    }

    .portfolio-chatbot-typing {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .portfolio-chatbot-typing span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #475569;
      animation: pulse 1.4s infinite;
    }

    .portfolio-chatbot-typing span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .portfolio-chatbot-typing span:nth-child(3) {
      animation-delay: 0.4s;
    }

    .portfolio-chatbot-form {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding: 12px;
      display: flex;
      gap: 8px;
      background: rgba(255, 255, 255, 0.02);
    }

    .portfolio-chatbot-input {
      flex: 1;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
    }

    .portfolio-chatbot-input::placeholder {
      color: #64748b;
    }

    .portfolio-chatbot-input:focus {
      border-color: #6366f1;
    }

    .portfolio-chatbot-input:disabled {
      background: rgba(255, 255, 255, 0.02);
      cursor: not-allowed;
      color: #475569;
    }

    .portfolio-chatbot-send {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 16px;
      cursor: pointer;
      font-weight: 500;
      transition: opacity 0.2s;
    }

    .portfolio-chatbot-send:hover {
      opacity: 0.9;
    }

    .portfolio-chatbot-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.3;
      }
      50% {
        opacity: 1;
      }
    }

    .hidden {
      display: none !important;
    }

    @media (max-width: 480px) {
      .portfolio-chatbot-window {
        width: 100vw;
        height: 100vh;
        bottom: 0;
        right: 0;
        border-radius: 0;
      }
    }
  `;

  const chatHTML = `
    <button class="portfolio-chatbot-icon" id="portfolio-chatbot-toggle" aria-label="Open chat">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    </button>

    <div class="portfolio-chatbot-window hidden" id="portfolio-chatbot-window">
      <div class="portfolio-chatbot-header">
        <h2>Portfolio Agent</h2>
        <button class="portfolio-chatbot-close" id="portfolio-chatbot-close">✕</button>
      </div>

      <div class="portfolio-chatbot-reasoning hidden" id="portfolio-chatbot-reasoning">
        <span class="reason-dot"></span> Thinking...
      </div>

      <div class="portfolio-chatbot-messages" id="portfolio-chatbot-messages">
        <div class="portfolio-chatbot-message bot">
          <div class="portfolio-chatbot-message-content">
            Hi! 👋 I'm Umar's portfolio agent. Ask me about his projects, skills, education, or experience — I'm here to help!
          </div>
        </div>
      </div>

      <form class="portfolio-chatbot-form" id="portfolio-chatbot-form">
        <input
          type="text"
          class="portfolio-chatbot-input"
          id="portfolio-chatbot-input"
          placeholder="Ask a question..."
          autocomplete="off"
        />
        <button type="submit" class="portfolio-chatbot-send">Send</button>
      </form>
    </div>
  `;

  function init() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const container = document.createElement('div');
    container.innerHTML = chatHTML;
    document.body.appendChild(container);

    const toggle = document.getElementById('portfolio-chatbot-toggle');
    const chatWindow = document.getElementById('portfolio-chatbot-window');
    const closeBtn = document.getElementById('portfolio-chatbot-close');
    const form = document.getElementById('portfolio-chatbot-form');
    const input = document.getElementById('portfolio-chatbot-input');
    const messagesContainer = document.getElementById('portfolio-chatbot-messages');

    toggle.addEventListener('click', () => {
      chatWindow.classList.toggle('hidden');
      toggle.classList.toggle('hidden');
      input.focus();
    });

    closeBtn.addEventListener('click', () => {
      chatWindow.classList.add('hidden');
      toggle.classList.remove('hidden');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message || isLoading) return;

      addMessage('user', message);
      input.value = '';
      input.disabled = true;

      const typingDiv = document.createElement('div');
      typingDiv.className = 'portfolio-chatbot-message bot';
      typingDiv.innerHTML = `
        <div class="portfolio-chatbot-message-content">
          <div class="portfolio-chatbot-typing">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
      messagesContainer.appendChild(typingDiv);
      scrollToBottom();

      isLoading = true;

      generateAgentResponse(message).then(response => {
        typingDiv.remove();
        addMessage('bot', response);
        input.disabled = false;
        input.focus();
        isLoading = false;
      });
    });

    function addMessage(type, text) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `portfolio-chatbot-message ${type}`;

      const content = document.createElement('div');
      content.className = 'portfolio-chatbot-message-content';

      if (type === 'user') {
        // User messages: escape HTML to prevent XSS
        content.textContent = text;
      } else {
        // Bot messages: render markdown safely
        content.innerHTML = renderMarkdown(text);
      }

      messageDiv.appendChild(content);
      messagesContainer.appendChild(messageDiv);
      scrollToBottom();
    }

    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();