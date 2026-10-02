// Theme-aware portfolio assistant

(function () {
  let isLoading = false;
  const PROD_CHAT_API_URL = 'https://omerfarooq223-github-io.vercel.app/api/chat';

  async function postChat(url, query) {
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query })
    });
  }

  async function generateAgentResponse(query) {
    try {
      let endpoint = window.PORTFOLIO_CHAT_API_URL;
      if (!endpoint) {
        if (location.hostname.endsWith('github.io') || location.protocol === 'file:') {
          endpoint = PROD_CHAT_API_URL;
        } else {
          endpoint = '/api/chat';
        }
      }

      let response;
      try {
        response = await postChat(endpoint, query);
        // Fallback to production endpoint if local returns 404/405/501 (e.g. running basic static file server)
        if (!response.ok && [404, 405, 501].includes(response.status) && endpoint !== PROD_CHAT_API_URL) {
          response = await postChat(PROD_CHAT_API_URL, query);
        }
      } catch (netErr) {
        if (endpoint !== PROD_CHAT_API_URL) {
          response = await postChat(PROD_CHAT_API_URL, query);
        } else {
          throw netErr;
        }
      }

      if (response.ok) {
        const data = await response.json();
        if (data && data.answer) {
          return data.answer;
        }
      }

      if (response.status === 429) {
        return "You're sending messages too quickly. Please wait a moment before trying again.";
      }

      let errorDetail = '';
      try {
        const errorData = await response.json();
        errorDetail = errorData?.detail || '';
      } catch (_) {}

      if (errorDetail) {
        return errorDetail;
      }

      return "I'm having trouble connecting to the AI assistant right now. Please try again in a moment or contact Umar directly at momerfarooq223@gmail.com.";
    } catch (error) {
      console.error('Chatbot API Error:', error);
      return "I'm having trouble connecting to the AI assistant right now. Please check your connection or contact Umar directly at momerfarooq223@gmail.com.";
    }
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderMarkdown(text) {
    return escapeHTML(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  const styles = `
    .portfolio-chatbot-icon {
      position: fixed !important;
      bottom: var(--chatbot-bottom, 24px);
      right: 24px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--cyan, #00e5ff) 0%, var(--steel-blue, #5ba9d6) 100%);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
      z-index: 99999;
      will-change: transform;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, bottom .25s ease;
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
      color: var(--text, #eef3f5);
      border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
      border-bottom-left-radius: 4px;
    }

    .portfolio-chatbot-message.user .portfolio-chatbot-message-content {
      background: linear-gradient(135deg, var(--cyan, #00e5ff) 0%, var(--steel-blue, #5ba9d6) 100%);
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

    /* 4-Line Shimmering Loading Skeleton */
    .portfolio-chatbot-skeleton-wrap {
      display: flex;
      flex-direction: column;
      gap: 9px;
      width: 220px;
      padding: 4px 0;
    }

    .chatbot-skeleton-line {
      height: 11px;
      border-radius: 5px;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.06) 25%, rgba(0, 229, 255, 0.22) 50%, rgba(255, 255, 255, 0.06) 75%);
      background-size: 200% 100%;
      animation: chatbotShimmer 1.5s infinite linear;
    }

    @keyframes chatbotShimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    html[data-theme="light"] .chatbot-skeleton-line {
      background: linear-gradient(90deg, rgba(15, 23, 42, 0.06) 25%, rgba(3, 105, 161, 0.22) 50%, rgba(15, 23, 42, 0.06) 75%);
      background-size: 200% 100%;
    }

    @media (prefers-reduced-motion: reduce) {
      .chatbot-skeleton-line {
        animation: none;
        background-position: 50% 0;
      }
    }

    .hidden { display: none !important; }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 0.3; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }

    @media (max-width: 480px) {
      .portfolio-chatbot-window {
        width: 100% !important;
        max-width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
        bottom: 0 !important;
        right: 0 !important;
        border-radius: 0 !important;
        border: none !important;
      }
      .portfolio-chatbot-icon {
        bottom: var(--chatbot-bottom, 16px) !important;
        right: 16px !important;
        width: 50px !important;
        height: 50px !important;
      }
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
        <h2><span class="header-accent-dot"></span> Umar's Portfolio Assistant</h2>
        <button class="portfolio-chatbot-close" id="portfolio-chatbot-close" aria-label="Close Chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div class="portfolio-chatbot-messages" id="portfolio-chatbot-messages" role="log" aria-live="polite">
        <div class="portfolio-chatbot-message bot">
          <div class="portfolio-chatbot-message-content">
            Updated with Umar's current projects, skills, education, certifications, and experience. What would you like to explore?
            <div class="portfolio-chatbot-suggestions" id="portfolio-chatbot-suggestions"></div>
          </div>
        </div>
      </div>

      <div class="portfolio-chatbot-input-area">
        <form class="unified-input-bar" id="portfolio-chatbot-form">
          <input type="text" class="portfolio-chatbot-input" id="portfolio-chatbot-input" placeholder="Ask about a project, skill, or experience..." aria-label="Ask about a project, skill, or experience" autocomplete="off" maxlength="1000">
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

    // Keep the floating launcher above the footer and its back-to-top control.
    const pageFooter = document.querySelector('body > footer');
    let footerTicking = false;

    function updateFooterClearance() {
      footerTicking = false;
      const baseBottom = window.innerWidth <= 480 ? 16 : 24;
      if (!pageFooter) {
        toggle.style.setProperty('--chatbot-bottom', `${baseBottom}px`);
        return;
      }

      const footerTop = pageFooter.getBoundingClientRect().top;
      const visibleFooterHeight = Math.max(0, window.innerHeight - footerTop);
      const safeBottom = baseBottom + visibleFooterHeight;
      toggle.style.setProperty('--chatbot-bottom', `${safeBottom}px`);
    }

    function scheduleFooterClearance() {
      if (footerTicking) return;
      footerTicking = true;
      window.requestAnimationFrame(updateFooterClearance);
    }

    window.addEventListener('scroll', scheduleFooterClearance, { passive: true });
    window.addEventListener('resize', scheduleFooterClearance, { passive: true });
    updateFooterClearance();

    const prompts = [
      { text: "What are Umar's latest projects?", featured: true },
      { text: "Tell me about OS Pilot", featured: false },
      { text: "How does ClarityHire handle bias?", featured: false },
      { text: "Explain PersonaDiff", featured: false },
      { text: "Skills & tech stack", featured: false },
      { text: "What is Umar doing at Techohub?", featured: false }
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

    async function handleUserInput(message) {
      if (!message || isLoading) return;

      const userMsgDiv = document.createElement('div');
      userMsgDiv.className = 'portfolio-chatbot-message user';
      const userMsgContent = document.createElement('div');
      userMsgContent.className = 'portfolio-chatbot-message-content';
      userMsgContent.textContent = message;
      userMsgDiv.appendChild(userMsgContent);
      messagesContainer.appendChild(userMsgDiv);

      input.value = '';
      input.disabled = true;
      if (suggestionsContainer) suggestionsContainer.classList.add('hidden');

      const typingDiv = document.createElement('div');
      typingDiv.className = 'portfolio-chatbot-message bot';
      typingDiv.innerHTML = `
        <div class="portfolio-chatbot-message-content">
          <div class="portfolio-chatbot-skeleton-wrap" aria-label="Thinking..." role="status">
            <div class="chatbot-skeleton-line" style="width: 82%;"></div>
            <div class="chatbot-skeleton-line" style="width: 100%;"></div>
            <div class="chatbot-skeleton-line" style="width: 58%;"></div>
          </div>
        </div>
      `;
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
