// Portfolio Chatbot Widget - 100% Client-Side (IMPROVED)
// Better response generation, conversational, no APIs needed

(function() {
  let embeddingsData = null;
  let isLoading = false;

  // Load embeddings on page load
  async function loadEmbeddings() {
    try {
      const response = await fetch('./embeddings.json');
      if (!response.ok) throw new Error('Failed to load embeddings');
      embeddingsData = await response.json();
      console.log('✅ Loaded', embeddingsData.chunks.length, 'chunks');
    } catch (error) {
      console.error('⚠️ Could not load embeddings:', error);
      embeddingsData = null;
    }
  }

  // Simple TF-IDF similarity search
  function search(query, topK = 5) {
    if (!embeddingsData) return [];

    const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const scores = [];

    embeddingsData.chunks.forEach((chunk, idx) => {
      const chunkText = chunk.content.toLowerCase();
      const chunkTokens = chunkText.split(/\s+/);

      // Calculate similarity
      let matchCount = 0;
      let totalWeight = 0;

      queryTokens.forEach(qToken => {
        const regex = new RegExp(`\\b${qToken}\\b`, 'g');
        const matches = (chunkText.match(regex) || []).length;
        matchCount += Math.min(matches, 2);
        totalWeight += 1;
      });

      const similarity = totalWeight > 0 ? matchCount / (totalWeight * 2) : 0;

      // Boost repository matches
      if (chunk.repo_name && queryTokens.some(t => chunk.repo_name.toLowerCase().includes(t))) {
        scores.push({ ...chunk, similarity: Math.min(similarity + 0.3, 1) });
      } else {
        scores.push({ ...chunk, similarity });
      }
    });

    return scores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .filter(r => r.similarity > 0.1);
  }

  // IMPROVED: Better response generation
  function generateResponse(query, results) {
    if (results.length === 0) {
      return getOffTopicResponse(query);
    }

    const topResult = results[0];
    const confidence = topResult.similarity;

    if (confidence < 0.2) {
      return getOffTopicResponse(query);
    }

    let response = '';

    switch (topResult.type) {
      case 'repository':
        response = generateRepoResponse(topResult);
        break;
      case 'skills':
        response = generateSkillsResponse();
        break;
      case 'experience':
        response = generateExperienceResponse();
        break;
      case 'education':
        response = generateEducationResponse();
        break;
      case 'profile':
        response = generateProfileResponse();
        break;
      default:
        response = topResult.content.substring(0, 300);
    }

    // Add relevant sources
    const relevantSources = results.slice(0, 2).map(r => r.repo_name || r.type);
    const uniqueSources = [...new Set(relevantSources)].filter(s => s);
    if (uniqueSources.length > 0) {
      response += '\n\n_Sources: ' + uniqueSources.join(', ') + '_';
    }

    return response;
  }

  function generateRepoResponse(repo) {
    const name = repo.repo_name;
    const content = repo.content;

    // Extract key info
    const descMatch = content.match(/Description:([^Problem]*)/);
    const desc = descMatch ? descMatch[1].trim().substring(0, 150) : '';

    const problemMatch = content.match(/Problem Solved:([^Key]*)/);
    const problem = problemMatch ? problemMatch[1].trim().substring(0, 150) : '';

    const featuresMatch = content.match(/Key Features:([^Tech]*)/);
    const features = featuresMatch ? featuresMatch[1].trim().split(',').slice(0, 2).join(', ') : '';

    const techMatch = content.match(/Tech Stack:([^GitHub]*)/);
    const tech = techMatch ? techMatch[1].trim().split(',').slice(0, 3).join(', ') : '';

    const templates = [
      `**${name}** is one of my key projects. It solves this problem: ${problem}. I built it using ${tech}, and it includes features like ${features}. You can check out the code on GitHub!`,
      
      `I built **${name}**, which ${desc}. The main problem it solves: ${problem}. Tech stack includes ${tech}. It's a project I'm proud of!`,
      
      `Let me tell you about **${name}** — ${desc}. It helps with: ${problem}. Built with ${tech}. Check it out on GitHub!`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  function generateSkillsResponse() {
    const templates = [
      `I specialize in **AI/ML Engineering**. My core skills: Python (Advanced), FastAPI, Streamlit, and LLM integration (Groq, Claude). I also work with Computer Vision (YOLO, OpenCV), NLP, and automation tools like n8n and Docker. On the web side: React, HTML/CSS/JavaScript. Data: Pandas, NumPy, MySQL, SQLite, Parquet.`,

      `My technical stack spans: **Languages** — Python (Advanced), C++, SQL, JavaScript. **AI/ML** — Agentic AI, LLM integration, computer vision, NLP, machine learning pipelines. **Frameworks** — FastAPI, Flask, Streamlit, Gradio. **Tools** — Docker, Git, n8n, Jupyter, PyMuPDF, Playwright. **Databases** — MySQL, SQLite, MongoDB.`,

      `I'm skilled in full-stack AI engineering: Python (my main language), FastAPI for backends, Streamlit for data apps, React for frontends. Deep expertise in agentic AI systems, LLM integration, computer vision with YOLO, and NLP. I also handle DevOps (Docker), automation (n8n), and data engineering (Pandas, SQL, Parquet).`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  function generateExperienceResponse() {
    return `I have diverse professional experience that shaped my work ethic and communication skills. I've worked in customer services (resolving inquiries, managing post-purchase support), operations and dispatch coordination (handling high-volume interactions), and academic tutoring (helping peers grasp complex concepts). Each role taught me discipline, reliability, and how to communicate effectively under pressure. All while maintaining a 3.81 GPA in my AI degree!`;
  }

  function generateEducationResponse() {
    return `I'm currently pursuing my **BS in Artificial Intelligence** at the University of Management & Technology (UMT) in Lahore, Pakistan. I maintain a **3.81 GPA** on a **70% merit scholarship** and was recognized with the **Dean's Award** for being in the top 10% of my department by SGPA. I'm also enrolled in the **Panaversity Agentic AI Program** to stay at the cutting edge of AI engineering.`;
  }

  function generateProfileResponse() {
    return `I'm **Muhammad Umar Farooq**, a BS Artificial Intelligence student at UMT Lahore. I maintain a 3.81 CGPA on a 70% merit scholarship and earned the Dean's Award. I specialize in building **production-grade autonomous AI agents** and have shipped **14+ projects** including multiple agentic systems. My focus: LLMs, agentic AI architecture, multi-agent systems, and practical ML pipelines that solve real problems. Currently learning through the Panaversity Agentic AI Program. 🚀`;
  }

  function getOffTopicResponse(query) {
    const templates = [
      `I'm not sure about that! 😄 But I'd love to tell you about my AI projects, technical skills, or professional background. What interests you?`,

      `That's outside my knowledge base! 🤔 Feel free to ask me about my portfolio — my projects, experience in AI/ML, or what I've built.`,

      `Good question, but I'm here to help you learn about my work! 😊 Ask me about my projects, skills, or how I got into AI.`,

      `I'm not an expert on that! 😅 But I know everything about my portfolio. Want to hear about my agentic AI projects or my skills?`,

      `Hmm, I'm not equipped to answer that. 🤔 But I'd love to chat about my projects, experience, or AI/ML background instead!`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // UI Styles (same as before)
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
      background: white;
      border-radius: 12px;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      display: flex;
      flex-direction: column;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .portfolio-chatbot-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .portfolio-chatbot-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .portfolio-chatbot-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }

    .portfolio-chatbot-close:hover {
      opacity: 0.8;
    }

    .portfolio-chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
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
      max-width: 75%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .portfolio-chatbot-message.bot .portfolio-chatbot-message-content {
      background: #f1f5f9;
      color: #1e293b;
    }

    .portfolio-chatbot-message.user .portfolio-chatbot-message-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
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
      background: #cbd5e1;
      animation: pulse 1.4s infinite;
    }

    .portfolio-chatbot-typing span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .portfolio-chatbot-typing span:nth-child(3) {
      animation-delay: 0.4s;
    }

    .portfolio-chatbot-form {
      border-top: 1px solid #e2e8f0;
      padding: 12px;
      display: flex;
      gap: 8px;
    }

    .portfolio-chatbot-input {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }

    .portfolio-chatbot-input:focus {
      border-color: #667eea;
    }

    .portfolio-chatbot-input:disabled {
      background: #f1f5f9;
      cursor: not-allowed;
    }

    .portfolio-chatbot-send {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

  // HTML
  const chatHTML = `
    <button class="portfolio-chatbot-icon" id="portfolio-chatbot-toggle" aria-label="Open chat">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    </button>

    <div class="portfolio-chatbot-window hidden" id="portfolio-chatbot-window">
      <div class="portfolio-chatbot-header">
        <h2>Omer's Portfolio</h2>
        <button class="portfolio-chatbot-close" id="portfolio-chatbot-close">✕</button>
      </div>

      <div class="portfolio-chatbot-messages" id="portfolio-chatbot-messages">
        <div class="portfolio-chatbot-message bot">
          <div class="portfolio-chatbot-message-content">
            Hi! 👋 I'm Omer's portfolio chatbot. Ask me anything about his projects, skills, or experience.
          </div>
        </div>
      </div>

      <form class="portfolio-chatbot-form" id="portfolio-chatbot-form">
        <input
          type="text"
          class="portfolio-chatbot-input"
          id="portfolio-chatbot-input"
          placeholder="Ask about projects, skills..."
          autocomplete="off"
        />
        <button type="submit" class="portfolio-chatbot-send">Send</button>
      </form>
    </div>
  `;

  // Initialize
  function init() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const container = document.createElement('div');
    container.innerHTML = chatHTML;
    document.body.appendChild(container);

    loadEmbeddings();

    const toggle = document.getElementById('portfolio-chatbot-toggle');
    const window = document.getElementById('portfolio-chatbot-window');
    const closeBtn = document.getElementById('portfolio-chatbot-close');
    const form = document.getElementById('portfolio-chatbot-form');
    const input = document.getElementById('portfolio-chatbot-input');
    const messagesContainer = document.getElementById('portfolio-chatbot-messages');

    toggle.addEventListener('click', () => {
      window.classList.toggle('hidden');
      toggle.classList.toggle('hidden');
      input.focus();
    });

    closeBtn.addEventListener('click', () => {
      window.classList.add('hidden');
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

      setTimeout(() => {
        typingDiv.remove();

        if (!embeddingsData) {
          addMessage('bot', '⚠️ Could not load knowledge base. Please refresh the page.');
          input.disabled = false;
          isLoading = false;
          return;
        }

        const results = search(message);
        const response = generateResponse(message, results);
        addMessage('bot', response);

        input.disabled = false;
        input.focus();
        isLoading = false;
      }, 300);
    });

    function addMessage(type, text) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `portfolio-chatbot-message ${type}`;

      const content = document.createElement('div');
      content.className = 'portfolio-chatbot-message-content';
      content.innerHTML = text;

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