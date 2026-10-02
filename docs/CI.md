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

## Targeted Scroll and Entrance Verification (2026-10-02)

- Syntax-check client scripts with `node --check` and executable inline scripts in `index.html`.
- In a fresh session, confirm the gateway first renders 0%, advances monotonically to 100%, and same-session reload skips it. Verify click/Enter/Escape skip behavior.
- At widths 375, 768, and 1440, inspect dark/light rendering and horizontal overflow. Compare hero bounds to confirm that name cleanup does not change typography or layout.
- Verify the circuit script remains unchanged when only offscreen CSS work is optimized. During repeated scrolling, its canvas must keep updating with the original pulse, glow, routing, and interaction effects.
- Check infinite effects in distant sections pause and resume before entering the viewport. Ensure finite reveals and effects already paused by existing hover controls are not resumed by the visibility observer.
- Check project modal image cycling, Escape and backdrop closing, certificate lightbox closing, project filters, internal anchor targets, and zero uncaught exceptions.
- For performance comparisons, verify stylesheets/images loaded without failed requests, then use the same viewport, fonts-loaded state, scripted scrolling, and CPU throttle; compare style/paint workload as well as frame intervals. Do not infer a universal FPS guarantee from a single synthetic run.

### Material gateway checks

Inspect a fresh-session gateway at 375×812, 768×900, 1440×900, and 667×375. Verify the nameplate and controls fit, text stays legible, duplicated door leaves align at the center seam, and the gateway has no infinite decorative animations. Check natural 0–100 progress, button/click and keyboard skipping, reduced-motion skipping, returning-session dismissal, and the 1.15-second reveal. Syntax-check executable inline scripts after removing the audio/flash code. Confirm the circuit background script has no diff.

### Social hover and mobile menu checks

At desktop width, hover LinkedIn, GitHub, LeetCode, and Hugging Face in both themes and inspect their faceted silhouettes for rectangular backing edges. At 375 and 768 pixels, verify the menu toggle has a transparent background, no native border, theme-aware visible bars, and a visible keyboard focus outline. Test opening, Escape closing, and closing after selecting a navigation link. Verify zero uncaught browser exceptions and confirm the original circuit script remains unchanged.

### Project-card visibility and accent checks

At 375, 768, and 1440 px in both themes, confirm no horizontal overflow and inspect hero, Projects, and Skills text/gradient contrast. Scroll past the first featured project cards while Projects remains visible: their infinite effects must pause outside the 200 px margin, then resume when revisited. Expand additional projects, confirm far cards pause and approaching cards resume, then collapse and repeat. Check project modal image cycling, Escape/backdrop closing, certificate closing, and catalog filters with zero uncaught exceptions. Confirm `js/geometric-background.js` is unchanged. Update shared stylesheet/script cache versions across the landing page, catalog, and privacy page whenever changing their shared assets.


### Gateway color accents

At 375, 768, and 1440 px, inspect the teal nameplate/controls and muted brass opening label. Confirm the name stays off-white, both door leaves align, and no new decorative loops appear. The progress sequence and entry control retain their existing behavior.


### Distinct accent colors

Inspect About in both themes: violet story/text/stat accents must be visibly distinct from cyan, green, and gold. Check the Languages & Frameworks, FSc Pre-Medical, and UMT Tutoring & Online Instruction cards use the same restrained violet as “27+ Projects Shipped,” and light-mode text remains legible. Inspect About, Projects, Skills, and Contact heading gradient stops for royal-blue/magenta blends while preserving their existing layout and timing.


### Colored trim and stamped gateway badge

Check the MUF badge, Portfolio label, and entry control do not overlap at 375 px. Inspect the paired leaves at desktop/tablet widths for aligned trim and panel reflections. At 667×375, confirm the nameplate and loader fit. Verify the new decoration adds no infinite gateway effects and preserves 0–100 progress and skipping.


### Gateway footer placement

At 375×812, 768×900, 1440×900, and 667×375, inspect the gateway bottom strip: label/tag must fit inside it, remain vertically centered, and not overlap. Confirm zero vertical padding, row layout in mobile, and no inherited footer backdrop blur. Both door copies must align before the reveal.
