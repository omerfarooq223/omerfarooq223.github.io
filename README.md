# Portfolio Site

<div align="center">
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logo=github" alt="Status" />
  <img src="https://img.shields.io/badge/Stack-HTML5%20|%20CSS3%20|%20JS-a855f7?style=for-the-badge" alt="Tech Stack" />
</div>

<p align="center">
  <strong>🌐 Live:</strong> <a href="https://omerfarooq223.github.io">omerfarooq223.github.io</a>
</p>

## What This Is

A personal portfolio website built entirely from scratch with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools. Designed to showcase AI/ML projects with a premium, immersive dark-mode aesthetic.

## Site Features

- **2D Canvas Ambient Background** — Lightweight particle flow animation in the hero section, theme-aware and responsive.
- **AI Chatbot Widget** — Integrated chatbot powered by Groq API & LLaMA 3 via a FastAPI backend, answers questions about the portfolio content.
- **Project Modals** — Click-to-expand project cards with multi-image carousels, tech stack tags, and GitHub links.
- **Category Filtering** — Filter projects by tag (Agentic AI, ML/DL, Computer Vision, Automation, etc.) with animated transitions.
- **Certification Lightbox** — Gallery with lightbox preview for 13 professional certifications stored as optimized WebP.
- **Light / Dark Mode** — Full dual-theme support with smooth CSS transitions and persistent toggle.
- **Glassmorphism UI** — Extensive use of CSS custom properties, backdrop-filters, and cyan/purple/pink gradient accents.
- **Fully Responsive** — Fluid layout built from scratch, renders correctly across all device sizes.
- **Document Preview Modal** — In-page preview for PDFs and certificate images without navigating away.

## Project Structure

```
portfolio-site/
├── index.html              # Main portfolio page
├── style.css               # Styles for index.html
├── main.js                 # Scripts for index.html
├── all-projects.html       # Dedicated all-projects page
├── chatbot-widget.js       # AI chatbot widget
├── images/                 # Project screenshots & assets (WebP)
├── docs/                   # Certificates & documents
├── api/
│   └── chat.py             # FastAPI serverless chatbot endpoint
├── vercel.json             # Vercel deployment config
├── CV.pdf                  # Resume
└── README.md
```

## Tech Stack

| Layer | Tools |
|-------|-------|
| Structure | HTML5, semantic elements |
| Styling | Vanilla CSS3 (custom properties, animations, glassmorphism) |
| Logic | Vanilla JavaScript (DOM manipulation, canvas, fetch API) |
| Chatbot API | Python, FastAPI, Groq API |
| Deployment | GitHub Pages (frontend), Vercel (API) |

## Running Locally

No build step required. Open `index.html` directly in a browser, or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

> The chatbot requires the Vercel backend to be running. Without it, the chatbot widget will load but won't return responses.

<hr>
<p align="center">
  <i>Designed and developed by Muhammad Umar Farooq.</i>
</p>
