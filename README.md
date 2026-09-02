# Portfolio Site

<div align="center">
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logo=github" alt="Status" />
  <img src="https://img.shields.io/badge/Stack-HTML5%20|%20CSS3%20|%20JS-a855f7?style=for-the-badge" alt="Tech Stack" />
  <img src="https://img.shields.io/badge/Framework-Vanilla-20beff?style=for-the-badge" alt="Vanilla" />
</div>

<p align="center">
  <strong>🌐 Live:</strong> <a href="https://omerfarooq223.github.io">omerfarooq223.github.io</a>
</p>

---

## Overview

A portfolio website built entirely from scratch using vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no bundlers. The design is centered around a dark-mode glassmorphism aesthetic with premium micro-animations and a fully responsive layout.

---

## How It Was Built

### Design Philosophy

The UI was designed from first principles using custom CSS properties as a design token system. The visual language draws from:

- **Glassmorphism** — `backdrop-filter: blur()`, translucent layers, and frosted glass surfaces
- **Chandelier-crystal effects** — Faceted SVG diamond geometry with specular highlight overlays and layered `box-shadow` / `drop-shadow` to simulate light refraction
- **Dark-first palette** — Deep navy/slate backgrounds (`#090d16`, `#0f172a`) paired with neon accents in cyan, purple, and pink
- **Micro-animations** — CSS `transition`, `@keyframes`, and JS-driven reveal-on-scroll for every interactive element

### CSS Architecture

| Technique | Purpose |
|-----------|---------|
| CSS custom properties (`--var`) | Global design tokens (colors, spacing, typography) |
| `clip-path: polygon(...)` | Asymmetrical diamond/faceted shapes for contact icons |
| `backdrop-filter: blur() saturate() brightness()` | Glass/crystal see-through effect |
| SVG `linearGradient` fills | Glossy chandelier gradient on social platform icons |
| `@keyframes` + `animation` | Floating nodes, pulse rings, ambient glow loops |
| `IntersectionObserver` | Scroll-triggered reveal animations |

### JavaScript Features

- **Canvas particle background** — Lightweight 2D canvas animation in the hero section; theme-aware, resets on resize and theme switch
- **Project modal system** — Dynamic modal with multi-image carousel, populated from a JS data array; no page reloads
- **Certificate lightbox** — Gallery built with a `certData[]` array mapped to thumbnail cards; supports keyboard navigation (Escape) and opens in new tab
- **Show More / Show Less** — Toggle for hidden certificate cards, preserving layout
- **AI Chatbot widget** — Powered by Groq API (LLaMA 3 model) via a Python FastAPI backend; streamed responses rendered in a floating chat panel

---

## Project Structure

```
portfolio-site/
├── index.html              # Main portfolio page
├── all-projects.html       # Standalone all-projects page
├── main.js                 # Core portfolio scripts
├── chatbot-widget.js       # Standalone AI chatbot widget
├── geometric-background.js # Canvas particle animation
├── css/                    # Modular CSS architecture
│   ├── base.css            # Root tokens, resets & utilities
│   ├── navigation.css      # Fixed navbar & theme toggle
│   ├── gateway.css         # Blast door gateway overlay
│   ├── hero.css            # Hero section & animations
│   ├── about.css           # Technical story & skills sidebar
│   ├── experience.css      # Cyber experience & education timeline
│   ├── projects.css        # Bento grid & project showcase
│   ├── achievements.css    # Honors, awards & certifications
│   ├── contact.css         # 3D contact stage & crystal plaque
│   ├── modals.css          # Project & document lightboxes
│   ├── responsive.css      # Global media queries
│   └── overrides.css       # Visual refresh & ambient layers
├── images/                 # Project screenshots & assets (WebP optimized)
├── docs/                   # Certificates & documents (WebP optimized)
├── assets/                 # Favicon and stone surface textures
├── api/
│   └── chat.py             # FastAPI serverless chatbot endpoint (Vercel)
├── vercel.json             # Vercel deployment config (serverless functions)
├── CV.pdf                  # Resume
└── README.md
```

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Structure | HTML5, semantic elements |
| Styling | Vanilla CSS3 — custom properties, animations, glassmorphism, SVG gradients |
| Logic | Vanilla JavaScript — DOM, Canvas API, Fetch API, IntersectionObserver |
| Chatbot backend | Python 3, FastAPI, Groq API (LLaMA 3.3-70b) |
| Deployment | GitHub Pages (frontend), Vercel (API serverless function) |
| Image format | WebP (converted with `cwebp` for optimized file sizes) |

---

## Running Locally

No build step required. Serve it with Python or any static file server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

> **Note:** The AI chatbot requires the Vercel-hosted FastAPI backend. Without it, the chat widget loads but API calls will return errors. To run the backend locally:
> ```bash
> cd api
> pip install -r requirements.txt
> uvicorn chat:app --reload
> ```

---

## Asset Optimization

All certificate and project images are stored as `.webp` using `cwebp`:

```bash
cwebp -q 85 input.png -o output.webp
```

This reduces file sizes by 60–80% compared to PNG/JPEG while maintaining visual quality.
