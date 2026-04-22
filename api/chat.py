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
    "experience", "education", "umt", "cgpa", "scholarship", "dean", "award",
    "agent", "agentic", "ai", "ml", "machine learning", "llm", "autograder",
    "python", "fastapi", "groq", "three.js", "contact", "email", "linkedin",
    "career", "work", "background", "internship", "hired", "hire"
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
    
    system_prompt = f"""
You are Muhammad Umar Farooq's AI Portfolio Agent. Your goal is to help visitors (recruiters, engineers, etc.) learn about Umar.

### CRITICAL INFO ABOUT UMAR:
- Full Name: Muhammad Umar Farooq
- Education: BS Artificial Intelligence (6th Semester) at UMT Lahore.
- Stats: 3.81 CGPA, 70% Merit Scholarship, Dean's Award (Top 10%).
- Projects: 14+ shipped projects, specialization in Agentic AI and ML pipelines.
- Persona: Professional, confident, helpful, and technically precise.

### INSTRUCTIONS:
1. Answer the visitor's questions about Umar's portfolio, skills, and background.
2. Keep answers concise (max 2 short sentences).
3. Use Markdown formatting for emphasis (e.g., **bold** for project names).
4. Always refer to him as "Umar".
5. If asked about contact info, mention his LinkedIn (in profile) or his email (momerfarooq223@gmail.com).
6. If a query is unrelated to Umar's portfolio/career, refuse with exactly:
   "I can only answer questions about Umar's portfolio, projects, skills, education, experience, or contact details."

Answer the following user query:
"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.35,
            max_tokens=120,
        )

        answer = completion.choices[0].message.content
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
