# FLOW.md — System, User & Data Behavioral Flows

This document details the definitive runtime flows, event lifecycles, and user journeys across the **Muhammad Umar Farooq Portfolio Site**.

## 1.1 Certificate Preview and Source Document Flow

1. Certificate cards render optimized WebP previews from `docs/certificates/`.
2. Selecting a card opens the shared certificate lightbox and updates its caption.
3. The lightbox's "Open in New Tab" action uses the original PDF when one is available; existing image-only certificates continue to open their WebP source.

---

## 1. Initial Page Load & Visual Initialization Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Visitor Browser
    participant DOM as HTML Document
    participant CSS as Modular Stylesheets (css/)
    participant BG as Canvas Engine (js/geometric-background.js)
    participant Core as Main Engine (js/main.js)
    participant IO as IntersectionObserver

    User->>DOM: Navigate to omerfarooq223.github.io
    DOM->>CSS: Load base.css, hero.css, projects.css, etc.
    Note over DOM,CSS: Fast CSS parsing with zero JS framework overhead
    DOM->>BG: Initialize Canvas 2D Particle Grid
    BG->>DOM: Mount canvas in hero container & start 60fps render loop
    DOM->>Core: Execute main.js on DOMContentLoaded
    Core->>IO: Attach IntersectionObserver to all .reveal sections
    Core->>DOM: Trigger Gateway entrance animation (blast-door unlock)
    User->>DOM: Scrolls page
    IO->>DOM: Detect section entering viewport -> Add .active class (fade/slide in)
```

### Flow Notes:
1. **Gateway Animation**: When visitors first arrive, the ambient gateway transition animates out, unveiling the cyber-hero header.
2. **IntersectionObserver Performance**: Scroll events do not fire expensive layout calculations; elements observe viewport thresholds passively using the browser's native observer.
3. **Canvas Auto-Throttle**: If the user switches tabs or resizes the browser, the geometric background halts or recalculates canvas dimensions without memory leakage.
4. **Hardware-Accelerated Reading Progress**: The `#bar` element binds to the native GPU compositor via `@supports (animation-timeline: scroll())` where supported (Chromium 115+, Safari 18+). In browsers lacking support (Firefox, older iOS), `main.js` transparently falls back to GPU `transform: scaleX(progress)` with zero reflow.

---

## 2. Project Modal & Media Carousel Lifecycle Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Visitor
    participant Card as Project Card (DOM)
    participant Core as Modal Engine (main.js)
    participant Modal as Modal Container (#projectModal)
    participant Carousel as Slide Engine

    User->>Card: Click project card / "View Details" button
    Card->>Core: Trigger openProjectModal(projectId, event)
    Core->>Core: Lookup projectId in local projectsData[] array
    Core->>Modal: Populate title, badges, description, tech stack pills, GitHub link
    Core->>Carousel: Reset active slide index = 0 & render slide indicators
    Core->>Modal: Add .is-open class (backdrop-filter blur + scale fade-in)
    Core->>Core: Lock background body scroll (overflow: hidden)
    Core->>Core: Bind keyboard listeners (ArrowLeft, ArrowRight, Escape)

    alt User clicks Next / Previous Slide or Swipe
        User->>Carousel: Click Arrow / Swipe
        Carousel->>Modal: Update active slide transform & update dot indicators
    else User presses Escape or clicks Backdrop
        User->>Modal: Click backdrop / Press Escape
        Modal->>Modal: Remove .is-open class (fade-out animation)
        Core->>Core: Restore background body scroll (overflow: auto)
        Core->>Core: Remove keyboard listeners
    end
```

---

## 3. AI Chatbot Interaction & Real-Time Streaming Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Visitor
    participant Widget as Chat Widget (js/chatbot-widget.js)
    participant API as FastAPI Backend (api/chat.py on Vercel)
    participant Groq as Groq AI Engine (LLaMA 3.3-70b)

    User->>Widget: Click Floating AI Chat Icon
    Widget->>Widget: Expand chat panel & display greeting message
    User->>Widget: Type question: "Tell me about his hackathon project"
    Widget->>Widget: Append user bubble & display typing skeleton indicator
    Widget->>API: POST /api/chat { message: "...", history: [...] }
    API->>API: Validate input & construct system prompt with candidate CV knowledge
    API->>Groq: Request streaming chat completion (stream=True)
    Groq-->>API: Stream token chunks (HTTP chunked / SSE)
    API-->>Widget: Stream tokens to client
    loop For each token chunk received
        Widget->>Widget: Append token chunk to assistant message DOM in real-time
        Widget->>Widget: Auto-scroll chat container to bottom
    end
    Widget->>Widget: Remove typing skeleton & render markdown response
    Widget->>Widget: Auto-scroll chat container to bottom

    opt Network Failure / Rate Limit
        API-->>Widget: HTTP 429 / 500 or network timeout
        Widget->>Widget: Render fallback notice with link to LinkedIn or email
    end
```

### Flow Notes:
1. **Shimmering Skeleton Loader**: During the async `generateAgentResponse(message)` roundtrip, the widget mounts a 3-line staggered skeleton (`.portfolio-chatbot-skeleton-wrap`) with a hardware-accelerated 4-line CSS shimmer gradient (`background-size: 200% 100%`).
2. **Instant Fluid Transition**: When the server returns the payload, the skeleton container is replaced directly by `renderMarkdown(response)` without layout jumps or flickering.
3. **Reduced Motion Adaptation**: Systems with `prefers-reduced-motion: reduce` freeze the gradient translation while maintaining clear visual placeholder cues.
4. **Resilient Dual-Tier Endpoint Resolution**: The widget attempts local `/api/chat` first. If running on a static host (GitHub Pages returning 405 or local static dev returning 404/501), it automatically falls back to `https://omerfarooq223-github-io.vercel.app/api/chat`, ensuring zero interruption across environments.

---

## 4. Project Filtering & Cross-Page Routing Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Visitor
    participant FilterBar as Filter Bar (index.html / all-projects.html)
    participant Engine as Filter Controller (main.js)
    participant Catalog as Project Bento Grid (DOM)

    User->>FilterBar: Click Category Filter (e.g. "Agentic AI" or "Cybersecurity")
    FilterBar->>Engine: Trigger applyProjectFilter(category)
    Engine->>FilterBar: Update .is-active class on selected filter button
    Engine->>Engine: Update URL query param (?filter=agentic) without reloading (pushState)
    loop For each project card in Catalog
        Engine->>Catalog: Check card data-category against selected filter
        alt Matches filter or filter == "all"
            Catalog->>Catalog: Remove .is-hidden (smooth scale & opacity in)
        else Does not match
            Catalog->>Catalog: Add .is-hidden (fade out & collapse)
        end
    end
```
