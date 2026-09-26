# AGENTS.md — Portfolio Site Developer & Agent Operating Manual

> **System Notice for AI & Human Developers**:  
> This file is the primary operating manual and ground truth for all development agents, AI coding assistants, and engineers working on the **Muhammad Umar Farooq Portfolio Site**. Adhere strictly to these principles, conventions, constraints, and verification protocols.

---

## 1. Project Purpose & Philosophy

The portfolio site (`omerfarooq223.github.io`) is the central digital presence and technical showcase for **Muhammad Umar Farooq**, an AI/ML and Autonomous Systems Engineer.

### Core Architectural Philosophy
1. **Zero Build Step, Zero Framework Overhead**: The frontend is built strictly with modern Vanilla HTML5, CSS3, and JavaScript. No Webpack, Vite, React, or npm build pipelines on the client. It must serve directly from any static web server or GitHub Pages without compilation.
2. **First-Principles Design System**: All styling is driven by custom CSS variables (`--cyan`, `--pink`, `--purple`, `--bg-dark`, etc.) defined in `css/base.css`. No external CSS utility frameworks (e.g., Tailwind, Bootstrap) are allowed.
3. **Glassmorphism & Cyber-Aesthetic Integrity**: Visual language centers around deep slate/navy surfaces (`#090d16`, `#0f172a`), translucent glass panels (`backdrop-filter: blur()`), faceted crystal geometries, and neon chamfered plaques.
4. **Performance & Lightweight Footprint**: All assets must be optimized WebP images (`< 150KB` where possible). Animations must leverage hardware-accelerated properties (`transform`, `opacity`) without blocking the main event loop.
5. **Decoupled Serverless Backend**: Dynamic capabilities (such as the interactive AI chatbot) are decoupled into a lightweight serverless Python FastAPI proxy running on Vercel (`api/chat.py`), protecting secret API keys and streaming tokens directly to the client.

---

## 2. Repository Layout & Architecture

```
portfolio-site/
├── AGENTS.md                   # This file — rules and operational guide
├── README.md                   # Project overview & running instructions
├── index.html                  # Main landing page & primary showcase
├── all-projects.html           # Comprehensive filterable projects catalog
├── privacy.html                # Privacy policy documentation
├── 404.html                    # Cyber-themed error page
├── CV.pdf                      # Resume document
├── llms.txt                    # Structured AI agent crawler & LLM index
├── robots.txt / sitemap.xml    # Search engine optimization indexers
├── vercel.json                 # Serverless routing config for Vercel
├── api/
│   ├── chat.py                 # FastAPI serverless streaming chatbot endpoint
│   └── requirements.txt        # Backend dependencies (fastapi, groq, uvicorn)
├── assets/                     # Favicon, SVG logos & stone textures
├── css/                        # Modular stylesheet architecture
│   ├── base.css                # CSS variables, tokens, resets & typography
│   ├── navigation.css          # Top navigation bar, indicators, theme toggles
│   ├── gateway.css             # Blast door entry portal & initial load sequence
│   ├── hero.css                # Hero display, title gradients, action buttons
│   ├── about.css               # Story section, technical bio & skill chips
│   ├── experience.css          # Cyber work experience & education plaques
│   ├── projects.css            # Bento grid, preview badges, hover states
│   ├── achievements.css        # Honors, hackathons & certification plaques
│   ├── contact.css             # 3D contact stage, social crystal plaque
│   ├── modals.css              # Project detail modal & document lightboxes
│   ├── responsive.css          # Mobile, tablet, and ultra-wide breakpoints
│   └── overrides.css           # Ambient glow and visual polish overrides
├── docs/                       # Technical documentation & certificates
│   ├── DECISIONS.md            # Architecture Decision Records (ADRs)
│   ├── FLOW.md                 # Definitive user and technical workflows
│   ├── CI.md                   # Continuous integration, testing & deployment guide
│   └── certificates/           # Certificate & verification documents (WebP)
├── images/                     # Project screenshots & diagrams (WebP)
└── js/                         # Modular client scripts
    ├── main.js                 # Core UI logic, modal system, scroll observers
    ├── chatbot-widget.js       # Floating AI assistant widget & streaming consumer
    └── geometric-background.js # Canvas 2D interactive geometric particle grid
```

---

## 3. Strict Development Conventions & Agent Guardrails

### A. Frontend Rules (HTML & CSS)
- **Do NOT introduce React, Vue, Next.js, or Tailwind** into this repository. The user has intentionally committed to a clean, zero-dependency, vanilla stack.
- **Maintain Modular CSS**: When adding or updating styles, place them in their respective domain stylesheet inside `css/`. Never add huge ad-hoc style blocks in `index.html` unless explicitly required for critical above-the-fold inline speed.
- **Semantic HTML**: Maintain clean document hierarchy (`<header>`, `<nav>`, `<main>`, `<section id="...">`, `<article>`, `<footer>`). Ensure every modal and interactive trigger contains proper `aria-` attributes and keyboard accessibility (`Escape` key listeners).
- **Asset Formats**: Images added to `images/` or `docs/` must be in `.webp` format to maintain Google Lighthouse 95+ performance scores.
- **Social & OpenGraph Cards**: `assets/og-image.jpg` must follow the clean, simplistic, aesthetic cyber-slate design language (1200x630, frosted glass badge, crisp typography, atmospheric ambient glow) rather than noisy, cluttered circuit boards.

### B. JavaScript Rules
- **Pure Vanilla JS (ES6+)**: Use standard DOM APIs (`document.querySelector`, `classList`, `addEventListener`, `fetch`).
- **Event Delegation**: Use event delegation for dynamically mapped project cards or list items to avoid memory leaks.
- **No Global Scope Pollution**: Keep variables scoped, or encapsulate them inside modular IIFEs or custom classes/objects.
- **Defensive Error Handling**: Always wrap network operations (e.g. chatbot streaming, clipboard copying) in `try...catch` blocks with user-friendly fallback messaging.

### C. Backend & API Rules (`api/chat.py`)
- **Never expose raw API keys**: Secrets (`GROQ_API_KEY`, etc.) must reside exclusively in environment variables (`.env` or Vercel Environment Variables).
- **Streaming by Default**: Chat responses must stream using `StreamingResponse` (`text/event-stream`) to minimize Time-to-First-Token (TTFT).

---

## 4. Pre-Commit Verification Checklist

Before finalizing any changes or submitting pull requests, every agent or developer must verify:
1. **Visual Consistency**: Check responsive layout on Mobile (`375px`), Tablet (`768px`), and Desktop (`1280px+`).
2. **Modal Integrity**: Ensure `openProjectModal()` and document lightbox open cleanly, cycle images without layout jumps, and close properly via backdrop click or `Escape` key.
3. **No Console Errors**: Open Developer Tools and ensure 0 uncaught exceptions during scroll, modal open, and filter switching.
4. **Link Integrity**: Check all internal jump links (`#about`, `#projects`, `#experience`) and external GitHub/Live links.

---

## 5. Mandatory Documentation Update Protocol

To prevent documentation drift and preserve institutional knowledge across AI sessions and development sprints, every agent and engineer **MUST** adhere to the following documentation protocol:

1. **Important Instruction Capture (`AGENTS.md`)**:
   - Whenever any important user instruction, design rule, architectural constraint, or project convention is established, you **MUST immediately update `AGENTS.md`** to record it.
   - Future agents look to `AGENTS.md` as the ground truth. Undocumented rules will be lost between sessions.

2. **Continuous Post-Implementation Updates (`docs/DECISIONS.md`, `docs/FLOW.md`, `docs/CI.md`)**:
   - **`docs/DECISIONS.md`**: Whenever a new feature, visual pattern, or architectural choice is made (e.g., adding shimmer skeleton loading, reverting text effects, refactoring modals, repository reorganization), you **MUST add or update an ADR** in `docs/DECISIONS.md` explaining the context, options considered, and decision rationale.
   - **`docs/FLOW.md`**: Whenever runtime behaviors, lifecycle sequences, event flows, or user interactions change (e.g., chatbot skeleton loading flow, modal autoplay, scroll reveals), you **MUST update `docs/FLOW.md`** and its sequence diagrams.
   - **`docs/CI.md`**: Whenever verification commands, static test steps, syntax checks, or deployment configurations are modified, you **MUST update `docs/CI.md`** to keep the pipeline and verification instructions accurate.

