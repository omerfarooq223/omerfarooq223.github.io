import json
from http.server import BaseHTTPRequestHandler
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import requests

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle chat requests"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)
            message = data.get('message', '')

            if not message:
                response = {'error': 'No message provided'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return

            groq_key = os.environ.get('GROQ_API_KEY')
            if not groq_key:
                response = {'error': 'GROQ_API_KEY not configured'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return

            groq_response = requests.post(
                'https://api.groq.com/openai/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {groq_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'mixtral-8x7b-32768',
                    'messages': [
                        {
                            'role': 'system',
                            'content': '''You are Omer's portfolio chatbot. You help recruiters and visitors learn about Omer's experience, projects, and skills.

Omer is a BS Artificial Intelligence student at UMT Lahore with a 3.81 CGPA. He has built 14+ projects including:
- Personal AI Employee: Gmail monitoring agent with human-in-the-loop approval
- AutoGrader: AI-powered grading system with plagiarism detection
- CareerPilot: AI coach that tracks GitHub and suggests projects
- UrduPlanner: Lesson planner that generates Word docs from PDFs
- And 10+ more projects in agentic AI, ML, and automation

Skills: Python (Advanced), FastAPI, Streamlit, LLMs (Groq, Claude), Computer Vision, NLP, n8n automation, and more.

Answer questions directly and confidently. Keep answers concise (2-3 sentences). Be conversational but professional.'''
                        },
                        {
                            'role': 'user',
                            'content': message
                        }
                    ],
                    'temperature': 0.7,
                    'max_tokens': 500
                },
                timeout=30
            )

            if groq_response.status_code == 200:
                answer = groq_response.json()['choices'][0]['message']['content'].strip()
                response = {
                    'answer': answer,
                    'sources': ['Omer\'s Portfolio Data']
                }
            else:
                response = {
                    'error': f'Groq API error: {groq_response.status_code}',
                    'answer': 'Sorry, I\'m having trouble responding right now. Try again in a moment.'
                }

            self.wfile.write(json.dumps(response).encode('utf-8'))

        except Exception as e:
            response = {'error': str(e), 'answer': 'An error occurred. Please try again.'}
            self.wfile.write(json.dumps(response).encode('utf-8'))
