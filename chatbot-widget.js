// Portfolio Chatbot Widget - PREMIUM THEME-AWARE VERSION
// Enhancements: Branded header, sharp typography, unified input bar, 60fps rAF scroll handling

(function () {
  let isLoading = false;

  async function generateAgentResponse(query) {
    try {
      const response = await fetch('https://omerfarooq223-github-io-git-main-omerfarooq223s-projects.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      if (!response.ok) {
        let detail = '';
        try {
          const errorData = await response.json();
          detail = errorData?.detail || '';
        } catch (_) {
          // Ignore JSON parse issues and fall back to status-based handling.
        }

        if (response.status === 429) {
          return "You're sending messages too quickly. Please wait a few minutes and try again.";
        }

        throw new Error(detail || `API request failed (${response.status})`);
      }

      const data = await response.json();
      return data.answer || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Chatbot API Error:', error);
      return `I'm having trouble connecting to my brain. 🧠\n\n**Error:** ${error.message}`;
    }
  }

  function renderMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  const styles = `
    .portfolio-chatbot-icon {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--cyan, #00e5ff) 0%, var(--purple, #a855f7) 100%);
      border: none;
      border-radius: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
      z-index: 99999;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .portfolio-chatbot-icon:hover {
      transform: scale(1.08) translateY(-4px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.35);
    }

    .portfolio-chatbot-icon svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .portfolio-chatbot-window {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 400px;
      max-width: calc(100vw - 48px);
      height: 620px;
      background: var(--surface, #0c0d18);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
      border-radius: 24px;
      box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      z-index: 99999;
      overflow: hidden;
      animation: chatSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }

    @keyframes chatSlideIn {
      from { opacity: 0; transform: translateY(30px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .portfolio-chatbot-header {
      background: rgba(255, 255, 255, 0.02);
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));
      position: relative;
    }

    .portfolio-chatbot-header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 800;
      color: var(--text, #fff);
      display: flex;
      align-items: center;
      gap: 12px;
      letter-spacing: -0.02em;
    }

    .header-accent-dot {
      width: 10px;
      height: 10px;
      background: var(--cyan);
      border-radius: 50%;
      position: relative;
    }

    .header-accent-dot::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid var(--cyan);
      animation: pulse 2s infinite;
    }

    .portfolio-chatbot-close {
      background: transparent;
      border: none;
      color: var(--muted2, #8888aa);
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s;
    }

    .portfolio-chatbot-close:hover {
      color: var(--text, #fff);
    }

    .portfolio-chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: var(--bg, #07080f);
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent;
    }

    .portfolio-chatbot-message-content {
      max-width: 90%;
      padding: 14px 18px;
      border-radius: 18px;
      font-size: 14.5px;
      line-height: 1.6;
    }

    .portfolio-chatbot-message.bot .portfolio-chatbot-message-content {
      background: var(--surface, #0c0d18);
      color: var(--text, #eeeef5);
      border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
      border-bottom-left-radius: 4px;
    }

    .portfolio-chatbot-message.user .portfolio-chatbot-message-content {
      background: linear-gradient(135deg, var(--cyan, #00e5ff) 0%, var(--purple, #a855f7) 100%);
      color: white;
      border-bottom-right-radius: 4px;
      align-self: flex-end;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 229, 255, 0.15);
    }

    .portfolio-chatbot-suggestions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin-top: 20px;
    }

    .portfolio-chatbot-suggestion {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 13.5px;
      color: var(--text, #fff);
      text-align: left;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      font-weight: 600;
    }

    .portfolio-chatbot-suggestion:hover {
      background: rgba(0, 229, 255, 0.12);
      border-color: var(--cyan, #00e5ff);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .suggestion-featured {
      border-left: 4px solid var(--cyan);
      background: rgba(0, 229, 255, 0.05);
    }

    .portfolio-chatbot-input-area {
      padding: 20px 24px;
      background: var(--surface, #0c0d18);
      border-top: 1px solid var(--border, rgba(255, 255, 255, 0.08));
    }

    .unified-input-bar {
      display: flex;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
      border-radius: 14px;
      padding: 6px 6px 6px 16px;
      transition: all 0.3s;
    }

    .unified-input-bar:focus-within {
      border-color: var(--cyan, #00e5ff);
      background: rgba(255, 255, 255, 0.06);
      box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.1);
    }

    .portfolio-chatbot-input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--text, #fff);
      font-size: 14.5px;
      outline: none;
      font-family: inherit;
    }

    .portfolio-chatbot-input::placeholder {
      color: var(--muted2, #8888aa);
    }

    .portfolio-chatbot-send-btn {
      width: 40px;
      height: 40px;
      background: var(--cyan);
      color: #000;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .portfolio-chatbot-send-btn:hover {
      filter: brightness(1.1);
      transform: scale(1.05);
    }

    .reason-dot {
      width: 6px;
      height: 6px;
      background: var(--cyan, #00e5ff);
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;
    }

    .hidden { display: none !important; }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 0.3; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }
  `;

  const chatHTML = `
    <button class="portfolio-chatbot-icon" id="portfolio-chatbot-toggle" aria-label="Open AI Assistant">
      <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
    </button>

    <div class="portfolio-chatbot-window hidden" id="portfolio-chatbot-window">
      <div class="portfolio-chatbot-header">
        <h2><span class="header-accent-dot"></span> Agentic Portfolio Assistant</h2>
        <button class="portfolio-chatbot-close" id="portfolio-chatbot-close" aria-label="Close Chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div class="portfolio-chatbot-messages" id="portfolio-chatbot-messages">
        <div class="portfolio-chatbot-message bot">
          <div class="portfolio-chatbot-message-content">
            Expertly trained on Umar's work. Ask me about specific projects, technical skills, or professional background.
            <div class="portfolio-chatbot-suggestions" id="portfolio-chatbot-suggestions"></div>
          </div>
        </div>
      </div>

      <div class="portfolio-chatbot-input-area">
        <form class="unified-input-bar" id="portfolio-chatbot-form">
          <input type="text" class="portfolio-chatbot-input" id="portfolio-chatbot-input" placeholder="Ask about Umar..." autocomplete="off">
          <button type="submit" class="portfolio-chatbot-send-btn" aria-label="Send Message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  `;

  function init() {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'portfolio-chatbot-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const container = document.createElement('div');
    container.id = 'portfolio-chatbot-container';
    container.innerHTML = chatHTML;
    document.body.appendChild(container);

    const toggle = document.getElementById('portfolio-chatbot-toggle');
    const chatWindow = document.getElementById('portfolio-chatbot-window');
    const closeBtn = document.getElementById('portfolio-chatbot-close');
    const form = document.getElementById('portfolio-chatbot-form');
    const input = document.getElementById('portfolio-chatbot-input');
    const messagesContainer = document.getElementById('portfolio-chatbot-messages');
    const suggestionsContainer = document.getElementById('portfolio-chatbot-suggestions');

    const prompts = [
      { text: "Umar's Background", featured: true },
      { text: "AutoGrader Project", featured: false },
      { text: "Agentic AI Experience", featured: false },
      { text: "Skills Audit", featured: false },
      { text: "Contact Information", featured: false }
    ];

    function renderSuggestions() {
      if (!suggestionsContainer) return;
      suggestionsContainer.innerHTML = '';
      prompts.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'portfolio-chatbot-suggestion' + (p.featured ? ' suggestion-featured' : '');
        btn.textContent = p.text;
        btn.type = 'button';
        btn.onclick = () => handleUserInput(p.text);
        suggestionsContainer.appendChild(btn);
      });
    }

    renderSuggestions();

    toggle.addEventListener('click', () => {
      chatWindow.classList.toggle('hidden');
      toggle.classList.toggle('hidden');
      input.focus();
    });

    closeBtn.addEventListener('click', () => {
      chatWindow.classList.add('hidden');
      toggle.classList.remove('hidden');
    });

    const footer = document.querySelector('footer');
    let ticking = false;

    function updateChatbotPosition() {
      if (!footer) return;
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const baseBottom = 24;
      let targetBottom = baseBottom;

      if (footerRect.top < windowHeight) {
        targetBottom = baseBottom + (windowHeight - footerRect.top);
      }
      
      toggle.style.bottom = targetBottom + 'px';
      chatWindow.style.bottom = targetBottom + 'px';
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateChatbotPosition);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      window.requestAnimationFrame(updateChatbotPosition);
    });

    updateChatbotPosition();

    async function handleUserInput(message) {
      if (!message || isLoading) return;
      
      const userMsgDiv = document.createElement('div');
      userMsgDiv.className = 'portfolio-chatbot-message user';
      userMsgDiv.innerHTML = `<div class="portfolio-chatbot-message-content">${message}</div>`;
      messagesContainer.appendChild(userMsgDiv);
      
      input.value = '';
      input.disabled = true;
      if (suggestionsContainer) suggestionsContainer.classList.add('hidden');

      const typingDiv = document.createElement('div');
      typingDiv.className = 'portfolio-chatbot-message bot';
      typingDiv.innerHTML = `<div class="portfolio-chatbot-message-content"><span class="reason-dot"></span> Thinking...</div>`;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      isLoading = true;
      generateAgentResponse(message).then(response => {
        typingDiv.remove();
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'portfolio-chatbot-message bot';
        botMsgDiv.innerHTML = `<div class="portfolio-chatbot-message-content">${renderMarkdown(response)}</div>`;
        messagesContainer.appendChild(botMsgDiv);
        input.disabled = false;
        input.focus();
        isLoading = false;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserInput(input.value.trim());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();