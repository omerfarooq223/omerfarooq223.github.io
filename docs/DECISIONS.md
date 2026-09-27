# DECISIONS.md — Architecture & Technical Decision Records (ADR)

This document records the foundational architectural, design, and technical decisions made for the **Muhammad Umar Farooq Portfolio Site**. It provides the concrete context, rationale, alternatives considered, and trade-offs for each decision so any engineer can understand and defend the system.

## ADR-004: WebP Certificate Previews with Original PDF Links

### Status
**Accepted**

### Context
The certificates section needs lightweight previews for the card grid while preserving the original documents for visitors who want to inspect or download them.

### Decision and Rationale
New certificate cards use optimized WebP previews, while their lightbox "Open in New Tab" actions target the original PDFs stored in `docs/certificates/`. This keeps the grid fast without replacing the source documents with lossy previews.

### Consequences
Certificate metadata remains in the existing HTML and lightbox data array, with one preview asset and one source document per new certificate.

---

## ADR-001: Zero-Build Vanilla Stack (HTML5 / CSS3 / ES6 JS)

### Status
**Accepted**

### Context
A developer portfolio needs to be fast, reliable, permanently accessible, and easy to maintain without continuous dependency updates, breaking bundler migrations, or complex CI/CD compilation pipelines.

### Options Considered
1. **Next.js / React (SSR / SSG)**: Industry-standard React framework with file-based routing and rich component ecosystems.
2. **Vite + React / Vue (SPA)**: Lightweight client bundler with fast HMR.
3. **Zero-Build Vanilla Stack (HTML5 / CSS3 / ES6 JS)**: Native browser standards served directly by any web server (GitHub Pages, Vercel, Netlify).

### Decision and Rationale
We chose the **Zero-Build Vanilla Stack**.
* **Zero Maintenance Churn**: No `npm install`, no `node_modules` security alerts, no Webpack/Vite version mismatches, and no build pipeline breakages years into the future.
* **Instant First Contentful Paint (FCP)**: The browser parses static HTML and modular CSS directly without needing to download, parse, and execute a 200KB–500KB React runtime bundle before rendering.
* **Host Anywhere**: The entire site can be deployed instantly on GitHub Pages with zero build config, or hosted locally via `python3 -m http.server`.

### Consequences
* **Benefits**: 100/100 Lighthouse performance potential, zero build dependencies, universal hosting compatibility, extreme reliability.
* **Trade-offs**: Components cannot use JSX or reactive state frameworks; dynamic DOM manipulations must be written with clean, standard DOM APIs.

---

## ADR-002: Modular CSS Architecture with Design Tokens vs Tailwind CSS

### Status
**Accepted**

### Context
The site features a sophisticated cyber/glassmorphism design with neon accents, faceted polygons, specular highlights, and ambient glow effects. We needed an organized styling structure that avoided monolithic CSS files while maintaining full stylistic control.

### Options Considered
1. **Tailwind CSS**: Utility-first CSS framework with predefined classes.
2. **CSS Preprocessors (SASS/SCSS)**: Nested rules, mixins, and compilation step.
3. **Modular Vanilla CSS with Custom Properties (Design Tokens)**: Native CSS partitioned into domain stylesheets (`css/base.css`, `css/hero.css`, `css/projects.css`, etc.) driven by root CSS variables.

### Decision and Rationale
We chose **Modular Vanilla CSS with Custom Properties**.
* **Zero Build Dependency**: Avoids the Tailwind PostCSS compilation pipeline, adhering to ADR-001.
* **Native Custom Properties**: Tokens (`--cyan: #00e5ff`, `--pink: #ff2a85`, `--glass-bg: rgba(15, 23, 42, 0.7)`) allow instant real-time theme adaptation and uniform styling across all components.
* **Domain Partitioning**: Separating stylesheets by section (`navigation.css`, `projects.css`, `contact.css`, `modals.css`) ensures high maintainability and avoids 5,000-line monolithic files.
* **Complex Cyber Effects**: Intricate styling (such as `clip-path: polygon(...)`, multiple layered `box-shadow` glows, and `backdrop-filter: blur()`) is cleaner in dedicated CSS rules than in long strings of inline Tailwind utility classes.

### Consequences
* **Benefits**: No build tooling, total design freedom, readable HTML markup, clean separation of concerns.
* **Trade-offs**: Requires disciplined adherence to design token naming conventions rather than relying on framework-enforced constraints.

---

## ADR-003: Dynamic In-Memory Modal System vs Separate Multi-Page Layouts

### Status
**Accepted**

### Context
Showcasing detailed technical projects requires deep-dive descriptions, architecture highlights, multi-image slideshows, and metric badges. We needed to choose how users transition from the portfolio overview to project deep dives.

### Options Considered
1. **Multi-Page Architecture (MPA)**: Each project has its own separate HTML page (e.g., `/projects/gemma-claim.html`).
2. **Dynamic In-Memory Modal System**: A single reusable modal DOM structure in `index.html` dynamically populated from structured JavaScript objects (`main.js`).

### Decision and Rationale
We chose the **Dynamic In-Memory Modal System**.
* **Zero Page Reload Delay**: Clicking "View Details" opens instantly with a smooth glassmorphism fade-in without triggering a server request or blank page reload.
* **Mobile-App Polish**: Preserves user scroll position on the main landing page; closing the modal returns the user precisely where they were browsing.
* **Centralized Data Structure**: Project content (slides, titles, tags, descriptions, GitHub links) is maintained cleanly in a structured JavaScript data array, making updates rapid and consistent.

### Consequences
* **Benefits**: Ultra-fast navigation, app-like feel, preserved scroll context, unified carousel controls.
* **Trade-offs**: Deep linking directly to a specific project modal from an external URL requires URL hash/query param parsing (`?project=...`).

---

## ADR-004: Serverless Python FastAPI Proxy for AI Chatbot with Streaming

### Status
**Accepted**

### Context
The portfolio features an interactive AI chatbot that can answer visitor questions about Muhammad's background, projects, skills, and resume. We needed a secure, low-latency, and cost-efficient backend.

### Options Considered
1. **Client-Side API Calls**: Browser calls LLM APIs (OpenAI/Groq) directly using an exposed client-side API key.
2. **Dedicated VPS / Always-On Server (DigitalOcean / EC2)**: Running a 24/7 Node.js or Python server.
3. **Serverless Python FastAPI Endpoint on Vercel (`api/chat.py`)**: Stateless serverless function invoking Groq API (LLaMA 3.3-70b) with streaming responses.

### Decision and Rationale
We chose **Serverless Python FastAPI on Vercel with Streaming**.
* **Absolute Secret Security**: Keeps API keys strictly on the backend; client never sees the secret token.
* **Zero Idle Cost**: Runs on Vercel's generous free serverless tier, executing only when a visitor actually messages the chatbot.
* **Streamed Responses (`StreamingResponse`)**: Tokens stream to the client in real-time via Server-Sent Events (SSE), reducing perceived latency from ~3 seconds to under 200ms.
* **Model Selection (Groq LLaMA 3.3-70b)**: Extremely high inference speed (~300 tokens/sec) at near-zero operating cost with state-of-the-art conversational quality.

### Consequences
* **Benefits**: Fast response streaming, 100% secret safety, zero infrastructure cost, clean separation from frontend.
* **Trade-offs**: Cold-start latency on first invocation after long idle periods (~500ms–1s).

---

## ADR-005: 100% WebP Image Optimization Pipeline

### Status
**Accepted**

### Context
The portfolio features heavy visual elements: certificates, architecture diagrams, project mockups, and stone textures. Raw PNGs and high-res JPEGs would inflate page size past 25MB, ruining mobile load times and SEO scores.

### Options Considered
1. **Standard PNG / JPEG Formats**: High quality but large file sizes (often 1–4MB per image).
2. **Third-Party Image CDN (Cloudinary / Imgix)**: Dynamic cloud transformations with external URL dependencies.
3. **Local WebP Optimization (`cwebp` batch conversion)**: Converting all assets to `.webp` format at quality level 80–85.

### Decision and Rationale
We chose **Local WebP Optimization**.
* **60–80% File Size Reduction**: Large 3MB PNG screenshots drop to 150KB–250KB with zero noticeable loss in visual fidelity.
* **Self-Contained**: No dependency on third-party image delivery services or monthly bandwidth caps.
* **Universal Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge) support WebP natively.

### Consequences
* **Benefits**: Sub-second asset load times, low mobile bandwidth usage, top Lighthouse performance.
* **Trade-offs**: New images added to `images/` or `docs/` must be pre-converted using `cwebp` before committing.

---

## ADR-006: 4-Line CSS Shimmering Skeleton Loading for Asynchronous States

### Status
**Accepted**

### Context
During asynchronous operations (such as waiting for the AI Chatbot's serverless LLM streaming response), the interface previously rendered a static text label (`<span class="reason-dot"></span> Thinking...`). This lacked visual polish, failed to communicate the structural shape of impending content, and felt like an outdated web widget. At the same time, we needed a solution with zero external libraries.

### Options Considered
1. **Lottie / SVG Animation Libraries**: High visual fidelity but introduces external runtime scripts or heavy JSON files.
2. **Standard CSS Spinner / Bouncing Dots**: Simple, but doesn't preview content shape and feels generic.
3. **4-Line Pure CSS Shimmering Skeleton**: Using an oversized gradient (`background-size: 200% 100%`) animated via `background-position` over multi-width placeholder bars.

### Decision and Rationale
We chose the **4-Line Pure CSS Shimmering Skeleton**.
* **Zero Dependencies**: Requires only native CSS custom properties and standard DOM elements; zero JavaScript animation loops.
* **Hardware Accelerated**: Animating gradient position on GPU layers incurs negligible CPU overhead and never blocks the main thread.
* **App-Grade Polish**: Mirrors industry-leading AI applications (Claude, ChatGPT, Notion) by previewing multi-line paragraph structure (`82%`, `100%`, `58%` line widths) with a sweeping cyan/white luminescence.
* **Theme-Aware**: Seamlessly transitions between cyber slate dark mode and crisp high-contrast light mode using CSS custom properties.

### Consequences
* **Benefits**: Instant visual feedback, premium modern feel, zero framework overhead, fully responsive.
* **Trade-offs**: Requires dedicated markup injection during async waiting states.

---

## ADR-007: Resilient Dual-Tier Chatbot Endpoint Resolution & Groq Model Fallback

### Status
**Accepted**

### Context
GitHub Pages is a 100% static hosting environment that returns HTTP `405 Method Not Allowed` for any `POST` requests to `/api/chat`. Furthermore, local static servers (`python3 -m http.server`) do not execute serverless Python functions, causing local frontend tests to fail unless a separate Uvicorn instance is running. Additionally, upstream LLM provider model availability can shift over time (e.g. model deprecations).

### Options Considered
1. **Hardcoded Single Endpoint**: Force all environments (local, staging, production) to always call the remote production Vercel URL.
2. **Strict Environment Splitting**: Keep `/api/chat` for local development and require running local Uvicorn concurrently, but fail on GitHub Pages if Vercel URL is not injected via a build step.
3. **Resilient Dynamic Dual-Tier Fallback**: Detect current host (GitHub Pages, `file:`, or `localhost`), attempt local `/api/chat` if available, and gracefully auto-retry with production Vercel (`https://omerfarooq223-github-io.vercel.app/api/chat`) upon encountering HTTP 404, 405, or 501. Combine this with multi-model candidate fallback on the backend.

### Decision and Rationale
We chose the **Resilient Dynamic Dual-Tier Fallback**.
* **Zero Config for GitHub Pages**: The chatbot immediately routes to the live production Vercel backend without requiring an npm/webpack build step.
* **Instant Local Testing**: Developers can run simple static servers (`python3 -m http.server 8000`) and the chatbot continues functioning seamlessly by gracefully falling back to production.
* **Model Resilience**: The FastAPI backend dynamically cascades across top-performing Groq models (`qwen/qwen3.8-27b`, `qwen/qwen3.6-27b`, `openai/gpt-oss-120b`, `groq/compound`) to prevent 404 outages if an upstream model is retired.

### Consequences
* **Benefits**: 100% uptime across static GitHub Pages, local development, and preview deployments; zero build tool requirements.
* **Trade-offs**: Requires CORS headers on the Vercel backend to accept requests from both `localhost` and `github.io`.

---

## ADR-008: Retirement of Obsolete Contact Form Handler & Unused Form CSS

### Status
**Accepted**

### Context
An old contact form submission handler (`handleContactSubmit`) was present in `main.js`, and 165+ lines of `.ct-form-...` styles remained in `css/contact.css`. These were relics from an early iteration before the interactive 3D crystal contact stage and monolith plaque were built. The form inputs (`contact-name`, `contact-email`, `contact-message`) did not exist anywhere in the DOM.

### Decision and Rationale
We completely purged `handleContactSubmit` from `main.js`, removed its accompanying dead styles (`.ct-form-card`, `.ct-form-input`, `.ct-form-textarea`, `.ct-form-status`, `.ct-dev-profiles`, `.ct-dev-node`) from `css/contact.css`, and removed the defunct `.reason-dot` rule from `chatbot-widget.js`.
* **Zero Dead Weight**: Eliminates unreferenced global functions on `window` and trims stylesheet payload.
* **Architecture Purity**: Leaves the contact section logic strictly focused on the active 3D monolith stage and crystal social links.

### Consequences
* **Benefits**: Clean DOM integration, reduced file sizes, zero uncalled functions or orphaned CSS rules.
* **Trade-offs**: None.

---

## ADR-009: Hybrid Progressive Scroll Progress Bar (CSS Scroll Timeline + GPU scaleX Fallback)

### Status
**Accepted**

### Context
The site features a top fixed reading progress bar (`#bar`). The previous implementation modified `bar.style.width` on scroll events, which triggered browser layout reflow calculations on every scroll frame. While modern CSS introduced `animation-timeline: scroll()`, browser support remains non-universal (Firefox has it disabled by default, and older iOS versions lack support).

### Options Considered
1. **Legacy Width Animation**: Updating `bar.style.width = ...` in JavaScript. Universal, but causes layout reflows on every tick.
2. **Pure CSS `animation-timeline: scroll()` with zero JS**: Completely native and zero-JS, but fails for ~15-20% of users on Firefox and older mobile devices.
3. **Hybrid Progressive Enhancement**: Use `@supports (animation-timeline: scroll())` for native off-thread compositor animation where available, paired with GPU-accelerated `transform: scaleX(progress)` in JavaScript for unsupported browsers.

### Decision and Rationale
We chose **Hybrid Progressive Enhancement**.
* **Zero Reflow**: Switching from `width` to `transform: scaleX()` eliminates all document layout calculations, moving rendering entirely to the GPU compositor.
* **Native Off-Thread in Modern Engines**: Modern Chromium and Safari 18+ run the scrollbar animation purely in CSS on the compositor thread with zero script execution.
* **100% Universal Compatibility**: Firefox and legacy iOS devices automatically fall back to the GPU `scaleX` script, ensuring no visitor sees a broken progress indicator.

### Consequences
* **Benefits**: True 60fps/120fps smooth scrolling, zero reflow overhead, 100% browser compatibility.
* **Trade-offs**: Requires maintaining the small JS calculation block alongside the `@supports` CSS query.

---

## ADR-010: Repository Root Cleanup & Structured Directory Architecture

### Status
**Accepted**

### Context
Over successive iterations, the repository root accumulated 20 loose files, including 5 distinct Markdown files (`README.md`, `AGENTS.md`, `DECISIONS.md`, `FLOW.md`, `CI.md`), 3 loose JavaScript scripts (`main.js`, `chatbot-widget.js`, `geometric-background.js`), a Python backend dependency file (`requirements.txt`), and image certificates loose inside `docs/`. This caused visual clutter on GitHub, mixed client-side scripts with root configs, and conflated documentation files with certificate assets.

### Options Considered
1. **Leave All Files at Root**: Low effort, but creates visual disorganization, violates GitHub repository design best practices, and mixes backend, frontend, and architectural documents in a single directory.
2. **Move Everything into Subdirectories**: Move all files into subfolders. However, moving `README.md` breaks the GitHub front page, and moving `index.html` or `404.html` breaks GitHub Pages static hosting.
3. **Domain-Separated Layered Architecture**:
   - Keep only entry points and public documentation at root (`index.html`, pages, `README.md`, `AGENTS.md`, SEO indexers, `vercel.json`, `CV.pdf`).
   - Relocate client-side scripts to `js/` (`js/main.js`, `js/chatbot-widget.js`, `js/geometric-background.js`), mirroring `css/`.
   - Relocate Python dependencies to `api/requirements.txt`, adhering to Vercel's Serverless Python directory convention.
   - Relocate technical documentation to `docs/` (`docs/DECISIONS.md`, `docs/FLOW.md`, `docs/CI.md`).
   - Group certificate images under `docs/certificates/`.

### Decision and Rationale
We chose **Domain-Separated Layered Architecture**.
* **Clean GitHub Landing Experience**: Visitors and hiring managers viewing the GitHub repository see a clean, professional root consisting solely of `README.md`, `AGENTS.md`, pages, and standard web root manifests.
* **Script and Style Symmetry**: JavaScript files now reside in `js/`, directly mirroring the modular `css/` directory layout.
* **Separation of Concerns**: Python backend dependencies are co-located with `api/chat.py`, preventing backend configs from polluting the frontend workspace.
* **Dedicated Documentation Hub**: Architecture decisions, workflows, and CI instructions now reside together inside `docs/`, with credentials organized inside `docs/certificates/`.

### Consequences
* **Benefits**: Pristine GitHub presentation, standard developer ergonomics, clear asset organization, zero 404 broken paths.
* **Trade-offs**: Script tags and certificate image references updated across HTML and JS files.

---

## ADR-011: Simplistic & Aesthetic OpenGraph Social Card Redesign

### Status
**Accepted**

### Context
The previous OpenGraph social card (`assets/og-image.jpg`) suffered from visual clutter, with excessive glowing circuit lines, busy circuit traces, microchips, and dense text badges. When shared across LinkedIn, Twitter/X, Discord, or WhatsApp, the card appeared noisy and fragmented rather than reflecting the refined, premium cyber-slate aesthetic of the portfolio.

### Options Considered
1. **Retain Dense Circuit Artwork**: High contrast and cyber-themed, but visually overwhelming and hard to read at standard social feed thumbnail dimensions.
2. **Plain Minimalist Monochromatic Card**: Very simple, but loses the distinctive neon cyan/purple ambient atmosphere and glassmorphism identity of the site.
3. **Aesthetic Glassmorphic Plaque with Atmospheric Glow**: Clean obsidian slate canvas (`#060911`) with subtle cyan and purple atmospheric radial glows, faint geometric grid texture, and a centered frosted glass plaque containing crisp, high-contrast typography, live status pill, and concise metadata.

### Decision and Rationale
We chose the **Aesthetic Glassmorphic Plaque with Atmospheric Glow**:
* **Visual Clarity & Readability**: Crisp headline typography (`Muhammad Umar Farooq`), clean role descriptor (`Autonomous AI Engineer / LLM Systems Specialist / Full-Stack ML`), and categorized skill tags (`Agentic Workflows`, `RAG & Knowledge Graphs`, `Neural Architectures`, etc.) ensure instant comprehension across all feed sizes.
* **Aesthetic Brand Harmony**: Accurately mirrors the portfolio's core visual language—deep slate surfaces, frosted translucent glass, hairline border luminescence, and cyan/purple ambient highlights.
* **Retina Precision & Performance**: Generated at 2x resolution (`2400x1260`) and downscaled with Lanczos filtering to standard 1200x630, yielding razor-sharp text and an optimized 82KB file size (saving ~130KB over the previous asset).

### Consequences
* **Benefits**: Superior social engagement, high-end professional impression, fast load times on social card scrapers.
* **Trade-offs**: None.

---

## ADR-012: Explicit Vercel Framework Preset (`"framework": null`) for Static Hybrid Hosting

### Status
**Accepted**

### Context
Vercel CLI v59+ introduced aggressive backend framework auto-detection. Because the repository contains Python dependencies and a serverless endpoint inside `api/chat.py`, Vercel projects configured with or auto-detected as the "FastAPI" preset attempted to execute the full FastAPI build pipeline, demanding a root or module ASGI entrypoint (`No FastAPI entrypoint found in default locations... Add this to your pyproject.toml: [tool.vercel] entrypoint = "api.chat:app"`). 

Because the portfolio is an ultra-fast zero-build static site with a decoupled serverless API function, running a full FastAPI web server would break static asset resolution (`index.html`, `css/`, `images/`) and cause production deployment builds to fail.

### Options Considered
1. **Convert Project to Full FastAPI Web App (`pyproject.toml` entrypoint)**:
   - Make `api/chat.py` mount `StaticFiles(directory=".")` and serve the entire portfolio through FastAPI/Starlette.
   - *Drawback*: Violates ADR-001 (Zero-Build Vanilla Stack), incurs Python cold starts for static HTML/CSS/JS delivery, and removes GitHub Pages compatibility.
2. **Dashboard-Only Setting Change**:
   - Manually toggle "Framework Preset" to "Other" in the Vercel project dashboard.
   - *Drawback*: Fragile; does not persist across new project creations, forks, or preview environments.
3. **Explicit `"framework": null` in `vercel.json`**:
   - Codify `"framework": null` directly in `vercel.json`.
   - *Advantage*: Disables framework auto-detection across all linked projects, ensuring Vercel serves the root static assets directly while auto-compiling `api/*.py` as isolated Serverless Functions via `@vercel/python`.

### Decision and Rationale
We chose **`"framework": null` in `vercel.json`**:
* **Preserves Static Purity**: Serves static HTML/CSS/assets with 0ms build overhead and edge CDN caching directly from root.
* **Isolated Serverless Python Function**: Allows `api/chat.py` to compile as an on-demand serverless function with `api/requirements.txt`, keeping secrets and backend logic cleanly decoupled.
* **Hermetic & Git-Tracked**: Guarantees all current and future Vercel deployments (including preview branches) build cleanly without relying on manual dashboard overrides.

### Consequences
* **Benefits**: Fixes the production build failure permanently across all projects, ensures zero static serving latency, and aligns with ADR-001.
* **Trade-offs**: None.

