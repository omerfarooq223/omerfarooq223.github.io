# CI.md — Continuous Integration, Verification & Deployment Manual

> **Purpose**: This document outlines the continuous integration, local testing, static code verification, and deployment protocols for the **Muhammad Umar Farooq Portfolio Site**.

---

## 1. Architectural CI Principles

Because the frontend is built on a **Zero-Build Vanilla Architecture** (ADR-001) and the backend is a decoupled **Serverless FastAPI Proxy** (ADR-004), our CI/CD pipeline does not require heavy bundlers (Webpack, Vite, Rollup) or complex npm compilation stages.

Instead, verification focuses on:
1. **Static Syntax Validation**: Ensuring zero parsing or runtime syntax errors in client JS and backend Python.
2. **Asset Optimization Checks**: Enforcing `.webp` image formats and lightweight payload constraints (`< 150KB`).
3. **Responsive Design & Accessibility**: Ensuring interactive elements (`aria-`, keyboard navigation) and themes (dark/light) function without layout jumps.
4. **Decoupled Deployment Integrity**: Guaranteeing independent deployments for static GitHub Pages and Vercel serverless functions.

---

## 2. Automated & Local Verification Commands

Run these verification commands before committing or deploying any changes:

### A. JavaScript Syntax Verification
Validate all pure ES6+ JavaScript modules to catch syntax errors or invalid tokens:
```bash
node -c js/main.js
node -c js/chatbot-widget.js
node -c js/geometric-background.js
```
*Expected Output: Silent exit code 0.*

### B. Backend Python Syntax Verification
Verify the serverless FastAPI proxy and dependencies:
```bash
python3 -m py_compile api/chat.py
```
*Expected Output: Silent exit code 0.*

### C. Local Preview Server
Start the lightweight static web server to preview changes locally:
```bash
python3 -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) to test:
- Desktop view (`1280px+`), tablet view (`768px`), and mobile view (`375px`).
- Theme switcher (Dark / Light mode contrast and specular highlights).
- Project details modal popup and media carousel navigation.
- Floating AI assistant widget and shimmering skeleton loading state.

---

## 3. Pre-Commit Quality Gate Checklist

Every developer or AI agent must complete this checklist before marking work done:

| Gate | Check Item | Standard / Verification Method |
| :--- | :--- | :--- |
| **JS Syntax** | Client scripts compile cleanly | `node -c <file>.js` returns exit code 0 |
| **Python Syntax** | Backend handler compiles cleanly | `python3 -m py_compile api/chat.py` returns exit code 0 |
| **Console Health** | Zero uncaught runtime errors | DevTools Console has 0 red exceptions on page scroll, filter click, and modal open |
| **Image Standard** | Optimized WebP assets | All newly added project and doc media use `.webp` format (`< 150KB`) |
| **Accessibility** | Keyboard and ARIA compliance | Modals close on `Escape`; clickable controls have `aria-label` or visible labels |
| **Responsive UI** | Mobile to Ultra-wide views | Tested at 375px (iPhone), 768px (iPad), and 1440px+ (Desktop) |
| **Documentation** | Multi-doc sync protocol | `AGENTS.md`, `DECISIONS.md`, `FLOW.md`, and `CI.md` updated |

---

## 4. Deployment Environments & Procedures

### Production Frontend (GitHub Pages)
- **Repository**: `omerfarooq223/omerfarooq223.github.io`
- **Branch**: `main`
- **Hosting**: GitHub Pages serving directly from root `/`.
- **Deployment Process**:
  ```bash
  git add .
  git commit -m "feat/fix: <descriptive message>"
  git push origin main
  ```
  GitHub Pages automatically updates the live edge CDN in ~60 seconds.

### Serverless Backend Proxy (Vercel)
- **Function**: `api/chat.py` (FastAPI streaming proxy)
- **Configuration**: `vercel.json` (explicit `"framework": null` to prevent framework auto-detection collisions; rewrites `/api/(.*)` to `/api/$1`)
- **Environment Variables**:
  - `GROQ_API_KEY`: API key for Groq inference (LLaMA 3.3-70b).
- **Deployment Process**:
  - Automatically triggered on push to `main` via Vercel GitHub integration.
  - Or manually deployed using the Vercel CLI:
    ```bash
    vercel --prod
    ```

---

## 5. Post-Implementation Documentation Sync

Whenever an implementation alters system behavior, verification commands, or user journeys:
1. Update **`CI.md`** if verification commands, deployment steps, or quality gates are modified.
2. Update **`FLOW.md`** if user interactions, loading lifecycles, or state sequences change.
3. Update **`DECISIONS.md`** with an ADR explaining the technical trade-offs.
4. Update **`AGENTS.md`** if new permanent constraints or rules are introduced.
