import os
import json
from fastapi import FastAPI, HTTPException
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

@app.get("/api/health")
async def health():
    key = os.environ.get("GROQ_API_KEY")
    return {
        "status": "online",
        "groq_key_detected": key is not None and len(key) > 0,
        "key_prefix": key[:4] + "..." if key else None
    }

@app.post("/api/chat")
async def chat(request: ChatRequest):
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured in Vercel")

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
2. Keep answers concise (2-4 sentences max).
3. Use Markdown formatting for emphasis (e.g., **bold** for project names).
4. Always refer to him as "Umar".
5. If asked about contact info, mention his LinkedIn (in profile) or his email (momerfarooq223@gmail.com).

Answer the following user query:
"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            temperature=0.7,
            max_tokens=512,
        )

        answer = completion.choices[0].message.content
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
