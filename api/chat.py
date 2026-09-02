import os
import re
import time
from collections import defaultdict, deque
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq

app = FastAPI()

# Enable CORS for the portfolio site
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://omerfarooq223.github.io",
        "https://www.omerfarooq223.github.io",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)


PORTFOLIO_TOPICS = {
    "umar", "muhammad", "farooq", "portfolio", "project", "projects", "skill", "skills",
    "experience", "education", "umt", "cgpa", "scholarship", "dean", "award", "rector",
    "agent", "agentic", "ai", "ml", "machine learning", "llm", "autograder",
    "python", "fastapi", "groq", "three.js", "contact", "email", "linkedin",
    "career", "work", "background", "internship", "hired", "hire",
    "autoresearch", "careerpilot", "firewatch", "parking", "phishguard",
    "nexusml", "urduplanner", "solana", "jira", "slack", "n8n",
    "shap", "ids", "intrusion", "langgraph", "langchain",
    "os pilot", "ospilot", "workspace recovery", "tauri", "clarityhire",
    "resume screening", "fairlearn", "autoreach", "spatial-fx", "spatial fx",
    "mediapipe", "personadiff", "differential auditing", "pokemon", "tcg",
    "fastify", "gemini", "browser systems", "responsible ai",
    "yolo", "opencv", "computer vision", "nlp", "react", "docker",
    "personal ai employee", "ai employee vault", "mcp", "gmail", "playwright",
    "peer tutoring", "grasp", "shopify", "dispatch",
    "techohub", "intern", "internship", "phone", "inboxverity",
    "panaversity", "turkish", "languages",
    "certificate", "certification", "certified", "claude code", "claude 101",
    "ai fluency", "framework", "foundations", "ai foundations", "applied ai", "openai academy", "anthropic",
    "resume", "cv", "about", "who", "what", "tell", "describe",
    "help", "hello", "hi", "hey", "thanks", "thank",
    "dl-coursework", "deep learning", "pytorch", "tensorflow", "numpy"
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
    return {
        "status": "online",
    }

@app.post("/api/chat")
async def chat(request: ChatRequest, http_request: Request):
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="The portfolio assistant is temporarily unavailable.",
        )

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
- Phone: +92 328 6403551
- LinkedIn: linkedin.com/in/omerfarooq223
- GitHub: github.com/omerfarooq223
- Status: Available for internships, freelance projects, and collaborations in AI, ML and automation.

=== STATS & HONORS ===
- 🏆 1st Place Winner — AI Seekho Day 2026 Gemma Fine-Tuning Hackathon
- CGPA: 3.85 / 4.0 at UMT
- Scholarship: 70% Merit Scholarship
- Projects Shipped: 27+
- Autonomous AI Agents Built: 13+

=== ACHIEVEMENTS & AWARDS ===
1. **1st Place — AI Seekho Day 2026, Gemma Fine-Tuning Competition** (2026): Won 1st place by fine-tuning Google Gemma 4 12B with 4-bit NF4 QLoRA on 1,085 audited and contrastive examples. Achieved 94.40% Accuracy, 94.38% Macro-F1 (472/500 correct) on the 500-example supervised final evaluation.
2. **Rector's Award — UMT**: Awarded for achieving a perfect 4.0 semester SGPA.
3. **Dean's Award — UMT**: Recognized for ranking in the top 10% by SGPA in the AI department.

=== EDUCATION ===
1. BS Artificial Intelligence, 7th semester (Oct 2023 – Present) — UMT, Lahore. CGPA 3.85/4.0, 70% Merit Scholarship, Dean's Award (Top 10%), Rector's Award.
2. FSc Pre-Medical (Sep 2021 – Jun 2023) — Punjab Group of Colleges (PGC). 970 Marks, 88.2%, 50% Scholarship.
3. Matric Science (Jun 2019 – Jun 2021) — Iqra Huffaz Secondary School, Lahore. 1085 Marks, 98.6%, Biology A+, Chemistry A+.

=== EXPERIENCE ===
1. Techohub — Agentic AI Developer Intern (Jun 2026 – Present), hybrid in Lahore. Builds and supports a domain-aware decision-intelligence platform for research, evidence-backed analysis, and structured reports; also supports deployment, client technical assistance, and AI/data solution implementation.
2. UMT — Peer Tutoring (Mar 2025 – Jul 2025): Academic Tutor in Lahore. Tutored peers across AI and programming subjects using adaptive teaching methods and strengthened mentoring and technical communication skills.
3. Shopify Store (Nov 2024 – Jan 2025): Customer Services, Remote. Resolved customer inquiries, handled orders and returns, and managed shipment updates.
4. Grasp Solutions Pvt Ltd (Jun 2024 – Sep 2024): Operations & Client Communication, Lahore. Managed high-volume client and taxi-dispatch coordination under time pressure.
5. SMZ Dispatch Services (Feb 2024 – Apr 2024): Cross-Cultural Communication, Lahore. Coordinated in real time with US-based clients.

=== PROFESSIONAL DEVELOPMENT ===
- Panaversity Agentic AI Program (Jan 2026 – Present): Agentic AI, Claude Code, tool integration, MCP, foundational agentic patterns, and advanced agent design.

=== PROJECTS (ordered by importance) ===
1. **Reliable Evidence-Based Claim Verification with Gemma 4** [🏆 1st Place Winner — AI Seekho Day 2026] — Three-way evidence-verification system fine-tuned from Google Gemma 4 12B using 4-bit NF4 QLoRA. Starting from 1,000 noisy labeled examples, the training curriculum was audited to 935 reliable examples and extended with 150 targeted contrastive examples (1,085 total). The final frozen checkpoint achieved 94.40% Accuracy and 94.38% Macro-F1 (472 / 500 correct) on the 500-example supervised final evaluation benchmark with deterministic inference. Tech: Gemma 4 12B, 4-bit NF4 QLoRA, PEFT, PyTorch, bitsandbytes, Transformers, NLP.
2. **Personal AI Employee** [Featured, 2026] — Autonomous human-in-the-loop agent for Gmail monitoring and LinkedIn automation, featuring a continuous reasoning loop and MCP-style tool integration. Tech: Claude Code, Flask, Gmail API, Playwright.
3. **AutoGrader Agent** [2026] — Comprehensive academic evaluation agent with integrated vision analysis for diagrams, dual-similarity plagiarism detection, and automated rubric generation. Generates well-formatted Excel sheets for students and class reports. Tech: Python, Groq LLaMA 3.3, PyMuPDF, openpyxl.
4. **SHAP-Explained Agentic IDS** [2026] — Hybrid intrusion detection system combining Random Forest classification, SHAP feature explanations, and LangGraph-based verification with autonomous red teaming. Tech: SHAP, LangGraph, Flask, React.
5. **InboxVerity AI** (previously presented as PhishGuard AI) [2026] — Gmail/Outlook Chrome extension and FastAPI backend that extracts open emails, combines heuristic and URL/domain signals with Groq classification, stores scan history, and displays an in-page safety sidebar. Tech: FastAPI, Groq, Chrome Extension, React.
5. **CareerPilot: AI CTO** [2026] — Autonomous Observe-Analyze-Plan agent that audits repositories, tracks hirability scores, and delivers continuous weekly coaching through an interactive chat interface. Tech: FastAPI, SQLite, GitHub Actions, MCP.
6. **FireWatch AI** [2026] — Autonomous YOLOv8-powered safety system that detects and segments fire/smoke in real-time and triggers agentic incident response protocols along with RAG implemented chatbot. Tech: FastAPI, YOLOv8l, React, RAG, Gmail API.
7. **AutoResearch Agent** [2026] — Autonomous research engine that performs multi-source web synthesis and generates professional PDF reports. Tech: LLMs, Groq, Tavily, PDF.
8. **Parking Detection System** [2026] — Real-time vision system using YOLOv8m and DBSCAN spatial clustering to rank available parking spots based on proximity, density, and accessibility. Includes a HuggingFace API Chatbot. Tech: YOLOv8m, Gradio, OpenCV, Image Processing.
9. **UrduPlanner Agent** [2026] — Specialized NLP pipeline performing intelligent OCR reconstruction for mangled text and RTL alignment. Tech: OCR, Groq, NLP, Python.
10. **OS Pilot** [2026] — Local-first multi-agent workspace recovery system that diagnoses storage pressure, proposes cleanup plans, and quarantines only human-approved rebuildable artifacts. Tech: React, Tauri, FastAPI, SQLite, Groq.
11. **ClarityHire** [2026] — Human-in-the-loop resume screening and bias-audit platform with blind screening, explainable hybrid ranking, Fairlearn metrics, live agent traces, and exportable reports. Tech: FastAPI, React, Celery, Redis, Fairlearn.
12. **PersonaDiff** [2026] — Evidence-first differential web auditing platform that compares isolated browser personas using tamper-evident captures, deterministic metrics, PII redaction, and offline replay. Tech: TypeScript, Playwright, Fastify, React, PostgreSQL.
13. **AutoReach Hub** [2026] — Privacy-first multi-channel outreach platform with Gemini-generated copy, Microsoft 365 OAuth, SMTP support, contact categories, and WhatsApp deep links. Tech: Python, Flask, Gemini, Microsoft Graph.
14. **Spatial-FX** [2026] — Real-time browser computer-vision playground with hand tracking, gesture recognition, air painting, cinematic effects, and an invisibility mode. Tech: MediaPipe, Canvas 2D, Web Audio, JavaScript.
15. **Pokémon TCG AI Battle Agent** [2026] — State-aware game agent evolved across 18 versions, with multi-turn planning, local simulation, and a 91.5% certified local win rate across 294 matches. Tech: Python, heuristics, simulation, Kaggle.
16. **NexusML: MLOps** — Production-ready inference pipeline featuring DistilBERT benchmarks and a 1TB scaling strategy. Tech: DistilBERT, FastAPI, Docker, Spark.
17. **Language Recognition** — Logistic regression classifier built from scratch with custom feature engineering to identify languages from text, with interactive inference UI. Tech: Python, Scikit-learn, Jupyter, NLP.
18. **Solana Trading Agent** — Modular skills-based trading agent for the Solana ecosystem, featuring automated risk management math, price sentinel monitoring, and secure trade logging. Tech: Claude Code, Solana, Web3.
19. **Jira–Slack Integration** — Advanced n8n workflows for cross-platform issue tracking and automated notifications, optimizing team communication through REST API orchestration. Tech: n8n, Jira, Slack, REST APIs.
20. **DL Coursework** — Coursework and hands-on experiments covering fundamentals through CNNs, transfer learning, RNNs/LSTMs, and sequence modeling in PyTorch & TensorFlow. Tech: PyTorch, TensorFlow, Python, NumPy.

=== SKILLS ===
AI & ML: LLM Integration (Groq, Gemini, Claude, LLaMA), Agentic AI Architecture, Multi-Agent Systems, LangGraph, Explainable AI (SHAP), Responsible AI (FairLearn), Machine Learning, Computer Vision (OpenCV, YOLO), NLP, Semantic Search, Scikit-learn.
Languages & Frameworks: Python (Advanced / Production), FastAPI, Flask, React, Vite, C++, SQL (SQLite, PostgreSQL), HTML5/CSS3/JavaScript.
Tools & Automation: n8n Workflow Automation, MCP (Model Context Protocol) Tooling, Playwright, Git/GitHub, GitHub Actions, PyMuPDF, openpyxl, python-docx, Docker, Postman, Claude Code, Antigravity IDE.
Languages: Urdu (Native), English (Advanced), Turkish (Basic).
Interests: Competitive programming, open-source AI projects, agentic AI development, and applied cybersecurity.

=== CERTIFICATIONS ===
Umar holds 16 professional certifications (including DataCamp, OpenAI, Anthropic, Kaggle, and Google credentials):
1. **AI Engineer for Developers Associate** — DataCamp (September 2026, Credential ID: AIEDA0016575880195)
2. **Working with the OpenAI API** — DataCamp (September 2026, Certificate ID: #49,665,886)
3. **5-Day AI Agents: Intensive Vibe Coding Course** — Kaggle / Google (Certificate of Completion, July 2026)
4. **AI Fluency for Students** — Anthropic (Certificate of Completion)
5. **Claude 101** — Anthropic (Certificate of Completion)
6. **Claude Code 101** — Anthropic (Certificate of Completion)
7. **AI Foundations** — OpenAI Academy (Course Completion Certificate, issued June 2026)
8. **AI Fluency: Framework & Foundations** — Anthropic (Certificate of Completion)
9. **Applied AI Foundations** — OpenAI Academy (Course Completion Certificate, issued June 2026)
10. **Claude Code in Action** — Anthropic (Certificate of Completion)
11. **Claude Platform 101** — Anthropic (Certificate of Completion)
12. **AI Fluency: AI Capabilities & Limitations** — Anthropic (Certificate of Completion)
13. **Machine Learning Explainability** — Kaggle (Certificate of Completion)
14. **Intro to AI Ethics** — Kaggle
15. **Peer Tutoring Certificate** — UMT
16. **Intro to Generative AI** — Google

=== RESPONSE INSTRUCTIONS ===
1. Answer visitors' questions about Umar's portfolio, skills, projects, education, experience, and contact.
2. Keep answers concise (max 3 short sentences).
3. Use Markdown for emphasis (e.g., **bold** for project names).
4. Always refer to him as "Umar".
5. If asked about contact info, share email (momerfarooq223@gmail.com), phone (+92 328 6403551), and mention LinkedIn.
6. If a query is unrelated to Umar's portfolio/career, respond with exactly:
   "I can only answer questions about Umar's portfolio, projects, skills, education, experience, or contact details."
7. When listing projects, mention the most relevant ones (don't list all 20 unless asked).
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
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="The portfolio assistant is temporarily unavailable.",
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
