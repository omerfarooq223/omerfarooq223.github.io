# DECISIONS.md — Architecture & Technical Decision Records (ADR)

This document records the foundational architectural, design, and technical decisions made for the **Muhammad Umar Farooq Portfolio Site**. It provides the concrete context, rationale, alternatives considered, and trade-offs for each decision so any engineer can understand and defend the system.

## ADR-009: Private-Repo Pill + Click-to-Reveal Popover for Papers Under Review

### Status
**Accepted**

### Context
Two repositories — **Gemma Claim Verification** and **SHAP-Explained Agentic IDS** — have their GitHub repos kept private while research papers derived from the work undergo peer review. Previously, the project cards linked directly to GitHub, causing visitors to land on a 404 "Repository Not Found" page with no explanation. This erodes trust and leaves the audience confused.

### Options Considered
1. **Remove the GitHub link silently**: Clean but gives no signal — visitors assume there's no code.
2. **Replace with a disabled/grayed-out GitHub icon**: Communicates unavailability but with no context.
3. **Small amber "🔒 Private Repo" pill + click-to-reveal glassmorphic popover**: Communicates status clearly, keeps the card clean, and educates visitors on _why_ on demand.
4. **Full modal dialog**: Overkill for a two-sentence explanation; disrupts the browsing flow.

### Decision and Rationale
Option 3 was chosen. A compact amber pill (consistent with the site's warning/amber color token) sits where the GitHub icon button used to be. Clicking it toggles a small glassmorphic popover anchored above the pill, explaining that:
- The repo is **private** while the paper is **under peer review**
- It will be made **public upon acceptance**

The popover uses `position: absolute` inside a `pill-private-wrap` container, appears with a fade + lift transition (`opacity`, `transform`), and closes on any outside click. ARIA attributes (`aria-expanded`, `aria-haspopup`, `role="tooltip"`) are included for accessibility. The same pattern is applied to both `index.html` (featured and companion cards) and `all-projects.html` (rendered via JS template literal with the `isPrivate` flag).

### Consequences
- GitHub link is removed from both affected cards; no dead links remain.
- Visitors immediately understand the private status and its reason.
- When repos go public, removing `isPrivate: true` (and the pill markup) restores the standard GitHub icon button.

---

## ADR-004: WebP Certificate Previews with Original PDF Links

### Status
**Accepted**

### Context
The certificates section needs lightweight, high-fidelity visuals for the card grid and interactive lightbox.

### Decision and Rationale
All certificate cards and lightbox views use optimized WebP images (`< 150KB`) directly in `docs/certificates/`. This ensures ultra-fast loading, zero PDF download overhead, and optimal Google Lighthouse performance.

In October 2026, three additional verified DataCamp credentials were added, expanding the verified credentials showcase from 18 to 21:
1. **AI Engineer for Data Scientists Associate** (`datacamp-ai-engineer-data-scientists.webp`)
2. **Working with Hugging Face** (`certificate-working-with-hugging-face.webp`)
3. **Unsupervised Learning in Python** (`certificate-unsupervised-learning-in-python.webp`)

### Consequences
Certificate metadata remains synchronized across `index.html`, `js/main.js` (`certData`), and `api/chat.py` with zero dead links or unused PDF files. Card layout dimensions are cleanly aligned to certificate aspect ratios.
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

## ADR: Targeted Scroll Optimization Without Redesign (2026-10-02)

**Context:** Scrolling visibly stalled the existing circuit lights. Profiling under 4× CPU throttling showed the canvas movement calculations were small (roughly 0.04 ms per update); repeated style and paint work from infinite CSS effects in distant sections was a significant avoidable cost. An isolated comparison that paused distant effects reduced paint work by about 35%. The final implemented Web Animations pause/resume version reduced traced paint time from 415 ms to 240 ms (about 42%) and style recalculation from 479 ms to 245 ms (about 49%) in a comparable scripted scroll run, with all assets loaded. These are local workload measurements, not an FPS guarantee.

**Options considered:** Replacing the light animation (rejected by the user), slowing or pausing the visible lights (does not preserve the intended experience), or suspending only invisible infinite CSS effects.

**Decision:** Preserve the original circuit script, geometry, colors, pulse directions, speed, click effects, glow, and page layout. Use an IntersectionObserver to pause only running infinite CSS animations on distant sections, the hero, and footer. Resume only animations paused by that observer when their container approaches within 200 px of the viewport. Finite reveal animations and authored paused/hover states remain under their existing controls. Do not add a scroll-frame geometry scan or redesign any visual component.

The gateway now begins at 0% in both markup and fill styling; the same entrance progresses monotonically to 100% using scaleX rather than width, without waiting for external fonts. The hero name retains its font, size, gradient, outer glow, and beacon animation. Its dark text-shadow is removed because shadows paint over transparent gradient-clipped glyphs and muddy the fill.

**Consequences:** Less unnecessary rendering competes with visible content. Offscreen CSS effects resume their saved phase before becoming visible. The user explicitly requires measured, incremental optimization without changing the design or light animation.

## ADR: Restrained Material Gateway (2026-10-02)

**Context:** The user found the entrance's glowing, widely spaced uppercase text and animated HUD graphics artificial. They explicitly authorized a more realistic treatment of this opening screen, while the portfolio's circuit background remains protected from redesign.

**Options considered:** Add richer neon effects; replace the entrance with a flat splash; or keep the mechanical split-door concept and ground it in physical materials.

**Decision:** Keep the two aligned door leaves and progress lifecycle. Replace the gateway-only styling with subtle brushed-metal gradients, recessed panel joints, a narrow mechanical seam, and an inset nameplate with corner fasteners. Use Plus Jakarta Sans, sentence-case labels, restrained weights and spacing, and muted lighting. Remove orbital SVGs, telemetry dots, scanning beam, completion flash, and procedural audio. Keep only progress and the physical door translation (1.15 seconds). Rename the skip control to “Enter portfolio” and replace fictional clearance copy with a plain portfolio label. No bitmap asset, framework, or dependency is added.

**Consequences:** The gateway reads as a physical surface with a clear identity rather than a game HUD. Continuous decorative entrance animation is eliminated. Keyboard/click skipping, same-session dismissal, reduced-motion skipping, and the 0–100 sequence remain. All changes are scoped to `css/gateway.css` and the gateway markup/lifecycle in `index.html`; background circuits and main-page layout remain unchanged.

## ADR: Crystal Hover Compositing and Mobile Menu Defaults (2026-10-02)

**Context:** Desktop hover transforms revealed a rectangular backing edge around the LinkedIn and GitHub crystal icons. The mobile dark-mode navigation toggle appeared as a white block because its button retained native browser background, border, and appearance.

**Diagnosis:** Isolated rendering comparisons showed the crystal artifact disappears when either backdrop-filter or the face's drop-shadow filter is removed. The combination on a transformed clipped layer exposes its rectangular backing texture.

**Decision:** Keep the crystal geometry, facet SVGs, glass blur, placement, and hover motion. Apply the same compositing correction to LinkedIn, GitHub, LeetCode, and Hugging Face (the latter two exhibited top/left rectangular edges in subsequent user screenshots). Move each crystal's existing outer drop-shadow to its enclosing social link and remove only the filter on its clipped face. Explicitly reset mobile toggle appearance, background, and border; use currentColor bars from the existing theme text token, a 44-pixel target, and a visible keyboard focus outline.

**Consequences:** Crystal glows follow the rendered silhouette, and the navigation icon remains legible in dark and light modes. Link destinations and menu event handling are unchanged.

## ADR: Card Visibility Ownership and Steel-Blue Accents (2026-10-02)

**Context:** The user reported harsher scrolling from Projects onward and requested a restrained replacement for abundant purple. Section-level visibility leaves early project-card title and border loops running while later cards remain on screen. The original background light animation and page layout must remain intact.

**Options considered:** Remove visible card animations, replace the background, or narrow the existing visibility optimization to each project and skill card. For color, retain purple-heavy gradients or shift their accent stops to cyan, steel blue, and teal while retaining warm highlights.

**Decision:** Each project/skill card owns its infinite CSS effects. Parent sections exclude these descendants, preventing the section from resuming an offscreen card. The existing 200 px visibility margin, finite reveals, and authored hover states remain. Expanding/collapsing additional projects requests a fresh visibility entry; previously owned pauses are retained until the element returns. No per-scroll card geometry loop is introduced. Replace pervasive purple tokens and literal colors across shared UI styles, inline decoration, and the chatbot with steel-blue/teal equivalents. Use darker replacements for light-mode text and preserve the original circuit script, including its sparse purple light accents.

**Validation:** A fonts-loaded, 1440×900 Chrome comparison under 4× CPU throttling scrolled 900 px through later Projects. The two featured cards changed from three running effects each to zero while offscreen. A final run with reliable asset delivery reduced main-thread task duration from 574 ms to 461 ms (about 20%), style recalculation from 122 ms to 90 ms, and paint from 120 ms to 94 ms. An earlier run measured about 23% less main-thread work. These describe that local synthetic workload, not a guaranteed frame rate on every device.

**Consequences:** Early cards no longer compete with later content. Their effects resume before entering view. Colors become more cohesive without changing card geometry, typography, layout, or visible animation timing. Legacy class names containing “purple” remain selectors for compatibility; their rendered accent is now steel blue.


## ADR: Subtle Color on the Material Gateway (2026-10-02)

**Context:** The user approves the realistic opening screen and requests a little color. Its restrained materials and typography should remain.

**Decision:** Add a faint teal reflection and small warm reflection to the metal panels, a cool teal tint to the inset nameplate, and teal accents on the status dot, role, percentage, progress fill, and entry button. Use a muted brass tone for the opening label. Keep the name solid off-white and preserve all geometry, textures, timings, and controls. No decorative animation or extra rendering loop is added.

**Consequences:** Color helps establish identity while the entrance still reads as a physical metal surface. This palette adjustment is confined to the gateway.


## ADR: Distinct Violet Accents Without Purple-Blue Headings (2026-10-02)

**Context:** Replacing every purple use with steel blue erased meaningful contrast in About. The user clarified that restrained purple is welcome, and that replacements should be distinct from existing accents. Heading gradients also retained blue/pink combinations that could appear violet.

**Decision:** Restore muted violet for About's contrasting story/text/stat accents and the Languages & Frameworks skill card. At the user's follow-up request, the FSc Pre-Medical and UMT Tutoring & Online Instruction cards also share this theme-aware violet token, including their border/glow accents. The hero's “70% Scholarship” pill also uses this token for its text and border. Use a light violet in dark mode and a darker violet in light mode. Keep large surfaces and primary controls in the existing restrained palette. Remove the royal-blue stops from the About and Education headings, with darker teal gradients for light-mode contrast, and remove the pink/magenta stops from shared heading gradients, using steel/neutral stops instead. Replace the Contact heading's blue-to-magenta blend with teal-to-warm metal. Keep typography, layout, animation timing, and original circuit lights unchanged.

**Consequences:** Accent categories are visibly distinct again without reintroducing abundant purple or violet-blue heading washes.


## ADR: Colored Metal Trim and Gateway Identity (2026-10-02)

**Context:** The user requests more color and design on the opening screen after approving its material treatment.

**Decision:** Strengthen teal and warm copper reflections, tint the metal handles, add narrow inset nameplate trim, a stamped MUF badge, small opening-label rules, and a discreet ventilation detail in the desktop footer. Keep the name off-white and the existing plate dimensions, typography, 0–100 loading flow, and door reveal. All added details use static CSS backgrounds/pseudo-elements, with no new animation loops or assets. Mobile hides the ventilation detail to leave room for the footer copy.

**Consequences:** The opening has a clearer identity and richer material color while retaining its restrained mechanical design and existing runtime performance.


## ADR: Gateway Footer Placement (2026-10-02)

**Context:** The opening's bottom text sat near the lower frame. Generic portfolio footer rules supplied 24 px vertical padding and mobile column stacking to the gateway's fixed-height strip.

**Decision:** Explicitly scope/reset the gateway footer's vertical padding, height, margins, layout, and backdrop blur. Center its contents vertically within the existing 48 px desktop/40 px mobile row. Separate the plain discipline label from a small brass Portfolio tag, add a teal inset diamond marker, and keep the existing desktop ventilation detail. Preserve gateway geometry and lifecycle.

**Consequences:** Footer contents fit and align predictably without depending on unrelated footer rules, with a clearer visual hierarchy and no extra animation or blur cost.
