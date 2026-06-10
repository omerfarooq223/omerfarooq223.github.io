import os
import json
import re
import time
from collections import defaultdict, deque
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

app = FastAPI()

# Enable CORS for the portfolio site
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now, can be restricted to your domain
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str


PORTFOLIO_TOPICS = {
    "umar", "muhammad", "farooq", "portfolio", "project", "projects", "skill", "skills",
    "experience", "education", "umt", "cgpa", "scholarship", "dean", "award", "rector",
    "agent", "agentic", "ai", "ml", "machine learning", "llm", "autograder",
    "python", "fastapi", "groq", "three.js", "contact", "email", "linkedin",
    "career", "work", "background", "internship", "hired", "hire",
    "autoresearch", "careerpilot", "firewatch", "parking", "phishguard",
    "nexusml", "urduplanner", "solana", "jira", "slack", "n8n",
    "shap", "ids", "intrusion", "langgraph", "langchain",
    "yolo", "opencv", "computer vision", "nlp", "react", "docker",
    "personal ai employee", "mcp", "gmail", "playwright",
    "peer tutoring", "grasp", "shopify", "dispatch",
    "resume", "cv", "about", "who", "what", "tell", "describe",
    "help", "hello", "hi", "hey", "thanks", "thank"
}

OFF_TOPIC_FALLBACK = (
    "I can only answer questions about Umar's portfolio, projects, skills, education, "
    "experience, or contact details."
)

RATE_LIMIT_MAX_REQUESTS = 20
RATE_LIMIT_WINDOW_SECONDS = 10 * 60
REQUEST_LOGS = defaultdict(deque)


def _normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip().lower())


def is_portfolio_related(message: str) -> bool:
    normalized = _normalize_text(message)
    if not normalized:
        return False

    # Fast keyword/topic gate to block random usage.
    return any(topic in normalized for topic in PORTFOLIO_TOPICS)


def get_client_ip(request: Request) -> str:
    # Vercel/Proxies usually pass client IP in X-Forwarded-For.
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


def is_rate_limited(client_ip: str) -> bool:
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW_SECONDS
    logs = REQUEST_LOGS[client_ip]

    while logs and logs[0] < window_start:
        logs.popleft()

    if len(logs) >= RATE_LIMIT_MAX_REQUESTS:
        return True

    logs.append(now)
    return False

@app.get("/api/health")
async def health():
    key = os.environ.get("GROQ_API_KEY")
    return {
        "status": "online",
        "groq_key_detected": key is not None and len(key) > 0,
        "key_prefix": key[:4] + "..." if key else None
    }

@app.post("/api/chat")
async def chat(request: ChatRequest, http_request: Request):
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured in Vercel")

    client_ip = get_client_ip(http_request)
    if is_rate_limited(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please try again in a few minutes.",
        )

    user_message = _normalize_text(request.message)
    if not user_message:
        return {"answer": "Please ask a question about Umar's portfolio."}

    # Hard guardrail: do not call the LLM for off-topic prompts.
    if not is_portfolio_related(user_message):
        return {"answer": OFF_TOPIC_FALLBACK}

    client = Groq(api_key=api_key)
    
    system_prompt = """
You are Muhammad Umar Farooq's AI Portfolio Agent. Your goal is to help visitors (recruiters, engineers, etc.) learn about Umar.
Use ONLY the knowledge provided below. Do NOT fabricate information.

=== ABOUT UMAR ===
- Full Name: Muhammad Umar Farooq
- Title: AI Engineer & Builder
- Tagline: "Production-minded AI-Engineer building autonomous systems that are useful, not just impressive."
- Location: Lahore, Pakistan (open to remote work)
- Email: momerfarooq223@gmail.com
- LinkedIn: linkedin.com/in/omerfarooq223
- GitHub: github.com/omerfarooq223
- Status: Available for internships, freelance projects, and collaborations in AI, ML and automation.

=== STATS ===
- CGPA: 3.81 / 4.0 at UMT
- Scholarship: 70% Merit Scholarship
- Projects Shipped: 17+
- AI Agents Built: 8+

=== EDUCATION ===
1. BS Artificial Intelligence (Oct 2023 – Present) — UMT, Lahore. CGPA 3.81/4.0, 70% Merit Scholarship, Dean's Award (Top 10%), Rector's Award.
2. FSc Pre-Medical (Sep 2021 – Jun 2023) — Punjab Group of Colleges (PGC). 970 Marks, 88.2%, 50% Scholarship.
3. Matric Science (Jun 2019 – Jun 2021) — Iqra Huffaz Secondary School, Lahore. 1085 Marks, 98.6%, Biology A+, Chemistry A+.

=== EXPERIENCE ===
1. UMT — Peer Tutoring (Mar 2025 – Jul 2025): Academic Tutor in Lahore. Tutored peers across multiple subjects, improving academic performance. Adapted teaching methods to fit different learning styles.
2. Shopify Store (Nov 2024 – Jan 2025): Customer Services, Remote. Resolved customer inquiries via email and chat, managed post-purchase support.
3. Grasp Solutions Pvt Ltd (Jun 2024 – Sep 2024): Operations & Client Communication, Lahore. High-volume client interactions under strict time constraints.
4. SMZ Dispatch Services (Feb 2024 – Apr 2024): Sales & Cross-Cultural Communication, Lahore. Real-time coordination with US-based clients.

=== PROJECTS (ordered by importance) ===
1. **AutoGrader Agent** [Featured, 2026] — Comprehensive academic evaluation agent with integrated vision analysis for diagrams, dual-similarity plagiarism detection, and automated rubric generation. Generates well-formatted Excel sheets for students and class reports. Tech: Python, Groq LLaMA 3.3, PyMuPDF, openpyxl.
2. **Personal AI Employee** [2026] — Autonomous human-in-the-loop agent for Gmail monitoring and LinkedIn automation, featuring a continuous reasoning loop and MCP-style tool integration. Tech: Claude Code, Flask, Gmail API, Playwright.
3. **CareerPilot: AI CTO** [2026] — Autonomous Observe-Analyze-Plan agent that audits repositories, tracks hirability scores, and delivers continuous weekly coaching through an interactive chat interface. Tech: FastAPI, SQLite, GitHub Actions, MCP.
4. **SHAP-Explained Agentic IDS** [2026] — Hybrid intrusion detection system combining Random Forest classification, SHAP feature explanations, and LangGraph-based verification with autonomous red teaming. Tech: SHAP, LangGraph, Flask, React.
5. **FireWatch AI** [2026] — Autonomous YOLOv8-powered safety system that detects and segments fire/smoke in real-time and triggers agentic incident response protocols along with RAG implemented chatbot. Tech: FastAPI, YOLOv8l, React, RAG, Gmail API.
6. **AutoResearch Agent** [2026] — Autonomous research engine that performs multi-source web synthesis and generates professional PDF reports. Tech: LLMs, Groq, Tavily, PDF.
7. **UrduPlanner Agent** [2026] — Specialized NLP pipeline performing intelligent OCR reconstruction for mangled text and RTL alignment. Tech: OCR, Groq, NLP, Python.
8. **Parking Detection System** [2026] — Real-time vision system using YOLOv8m and DBSCAN spatial clustering to rank available parking spots based on proximity, density, and accessibility. Includes a HuggingFace API Chatbot. Tech: YOLOv8m, Gradio, OpenCV, Image Processing.
9. **NexusML: MLOps** — Production-ready inference pipeline featuring DistilBERT benchmarks and a 1TB scaling strategy. Tech: DistilBERT, FastAPI, Docker, Spark.
10. **Language Recognition** — Logistic regression classifier built from scratch with custom feature engineering to identify languages from text, with interactive inference UI. Tech: Python, Scikit-learn, Jupyter, NLP.
11. **PhishGuard AI** — Chrome extension and FastAPI backend that detects phishing emails with heuristic feature extraction, Hugging Face inference support, and Groq LLM risk analysis. Tech: FastAPI, Chrome Extension, Groq, Hugging Face.
12. **Solana Trading Agent** — Modular skills-based trading agent for the Solana ecosystem, featuring automated risk management math, price sentinel monitoring, and secure trade logging. Tech: Claude Code, Solana, Web3.
13. **Jira–Slack Integration** — Advanced n8n workflows for cross-platform issue tracking and automated notifications, optimizing team communication through REST API orchestration. Tech: n8n, Jira, Slack, REST APIs.

=== SKILLS ===
AI & ML: LLM Integration (Groq, Ollama), Agentic AI Architecture, Machine Learning, Computer Vision (OpenCV, YOLO), NLP & Text Classification, Scikit-learn.
Languages & Frameworks: Python (Advanced), React/Vite, C++/C, SQL (SQLite, PostgreSQL), HTML5/CSS3/JavaScript.
Tools & Automation: Cursor/VS Code, Google Antigravity, n8n Workflow Automation, Git/GitHub, PyMuPDF/Openpyxl, Docker/Postman.
Currently Learning: Multi-agent Systems, LangChain/LangGraph, FastAPI, LeetCode, Docker.

=== RESPONSE INSTRUCTIONS ===
1. Answer visitors' questions about Umar's portfolio, skills, projects, education, experience, and contact.
2. Keep answers concise (max 3 short sentences).
3. Use Markdown for emphasis (e.g., **bold** for project names).
4. Always refer to him as "Umar".
5. If asked about contact info, share email (momerfarooq223@gmail.com) and mention LinkedIn.
6. If a query is unrelated to Umar's portfolio/career, respond with exactly:
   "I can only answer questions about Umar's portfolio, projects, skills, education, experience, or contact details."
7. When listing projects, mention the most relevant ones (don't list all 13 unless asked).
8. Be professional, confident, helpful, and technically precise.
"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.35,
            max_tokens=200,
        )

        answer = completion.choices[0].message.content
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
