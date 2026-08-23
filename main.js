// API URL Config
window.PORTFOLIO_CHAT_API_URL = window.PORTFOLIO_CHAT_API_URL || '/api/chat';

// Main Portfolio Logic
let modalMediaSources = [];
    let modalMediaIndex = 0;
    let modalMediaAutoplay = null;

    function updateModalMedia() {
      const stage = document.getElementById('m-media-stage');
      const dots = document.getElementById('m-media-dots');
      const slides = stage ? Array.from(stage.querySelectorAll('.m-media-slide')) : [];
      const mediaBox = stage ? stage.closest('.m-vid-box-premium') : null;

      if (!modalMediaSources.length) {
        if (mediaBox) mediaBox.style.display = 'none';
        slides.forEach(slide => {
          slide.removeAttribute('src');
          slide.classList.remove('is-active');
          slide.style.display = 'none';
        });
        if (dots) dots.innerHTML = '';
        return;
      }

      if (mediaBox) mediaBox.style.display = '';

      if (!slides.length) return;

      const hasMultipleSlides = modalMediaSources.length > 1;
      const fallbackSource = modalMediaSources[0] || 'images/autograder.webp';

      slides.forEach((slide, index) => {
        const source = modalMediaSources[index] || fallbackSource;
        slide.src = source;
        slide.classList.toggle('is-active', index === modalMediaIndex || (!hasMultipleSlides && index === 0));
        slide.style.display = index < modalMediaSources.length ? 'block' : 'none';
      });



      if (dots) {
        dots.innerHTML = modalMediaSources
          .map((_, index) => `<button type="button" class="m-media-dot${index === modalMediaIndex ? ' active' : ''}" aria-label="Show image ${index + 1}" data-index="${index}"></button>`)
          .join('');
        dots.querySelectorAll('.m-media-dot').forEach(dot => {
          dot.addEventListener('click', () => {
            modalMediaIndex = parseInt(dot.dataset.index, 10) || 0;
            updateModalMedia();
          });
        });
      }
    }

    function stepModalMedia(direction) {
      if (modalMediaSources.length < 2) return;
      modalMediaIndex = (modalMediaIndex + direction + modalMediaSources.length) % modalMediaSources.length;
      updateModalMedia();
    }

    const projectModalData = {
      autograder: {
        title: 'AutoGrader Agent',
        subtitle: 'AI / Multimodal Vision / Python · 2026',
        media: 'images/autograder.webp',
        alt: 'AutoGrader Agent preview',
        tags: ['Multimodal Vision', 'LLM Engineering', 'Plagiarism Detection', 'Academic Tech', 'Automation', 'Groq'],
        overview: [
          'Autonomous academic evaluation agent designed to revolutionize the grading workflow. <strong>AutoGrader Agent</strong> utilizes <strong>multimodal vision</strong> to analyze diagrams and screenshots, ensuring no detail is missed in student submissions.',
          'It features a dual-similarity engine (TF-IDF + N-Grams) to detect academic dishonesty and provides a seamless transition from raw data to professional analytical reports.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Integrated Vision:</strong> Uses Gemini Vision to extract and describe diagrams and charts from PDF/DOCX submissions.',
          '<strong>Plagiarism Engine:</strong> Detects academic dishonesty using a hybrid TF-IDF and character n-gram similarity analysis.',
          '<strong>Dynamic Rubrics:</strong> AI-powered rubric generation from brief snapshots or raw text-to-JSON formatting.',
          '<strong>Concurrent Execution:</strong> Processes bulk submissions in parallel for rapid turnaround.',
          '<strong>Resilient Workflow:</strong> Features a crash-recovery grading cache and redundant LLM routing (Groq/Gemini).',
          '<strong>Analytical Reports:</strong> Outputs styled Excel files with criterion-level breakdowns and class-wide statistics.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Groq LLaMA 3.3 / Gemini:</strong> High-speed reasoning and vision-based analysis.',
          '<strong>Scikit-learn:</strong> Powers the plagiarism detection similarity logic.',
          '<strong>PyMuPDF & python-docx:</strong> Advanced document parsing and image extraction.',
          '<strong>Streamlit:</strong> Interactive workspace for rubric management and real-time grading monitoring.'
        ],
        github: 'https://github.com/omerfarooq223/AutoGrader-Agent'
      },
      careerpilot: {
        title: 'CareerPilot: AI CTO',
        subtitle: 'Autonomous Agent / Career Systems / Python · 2026',
        media: 'images/careerpilot.webp',
        alt: 'CareerPilot Agent preview',
        tags: ['Autonomous Loop', 'Career Systems', 'Automation', 'FastAPI', 'SQLite', 'MCP'],
        overview: [
          'A personal AI CTO that acts as a continuous coach, auditing your GitHub ecosystem and identifying critical skill gaps via a modular <strong>Observe-Analyze-Plan</strong> loop.',
          'It provides a proactive feedback mechanism: assessing current projects, planning growth steps, and nudging progress through automated weekly reporting.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Autonomous Reasoning:</strong> Executes a continuous five-stage loop (Observe → Analyze → Remember → Plan → Act).',
          '<strong>Deep Code Audits:</strong> Leverages MCP (Model Context Protocol) for structural analysis of local and remote repositories.',
          '<strong>Conversational Q&A:</strong> Features a persistent chat interface with session memory for profile-specific queries.',
          '<strong>Proactive Coaching:</strong> Generates weekly email nudges with progress markers and LinkedIn content suggestions.',
          '<strong>Skill Registry:</strong> Extensible modular system for project suggestion, README rewriting, and interview prep.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Groq LLaMA 3.3 70B:</strong> Powers the core reasoning and planning logic.',
          '<strong>FastAPI & SQLite:</strong> High-performance backend with week-over-week state persistence.',
          '<strong>Gmail API:</strong> Automated Friday evening progress reports.',
          '<strong>Vanilla JS & Glassmorphism:</strong> Premium, responsive web dashboard and chat UI.'
        ],
        github: 'https://github.com/omerfarooq223/CareerPilot-Agent'
      },
      aiemployee: {
        title: 'Personal AI Employee',
        subtitle: 'Human-in-the-Loop Agent / Gmail + LinkedIn Automation · 2026',
        media: 'images/aiemployee-dashboard.webp',
        alt: 'Personal AI Employee dashboard preview',
        tags: ['HITL Approval', 'Gmail Automation', 'LinkedIn Auto-Poster', 'Flask Dashboard', 'Claude Code', 'MCP'],
        overview: [
          'A fully autonomous personal AI employee that monitors your Gmail, reasons about incoming tasks, waits for your approval, and then takes real-world actions — all while you stay in control.',
          'It runs a continuous loop that converts raw emails into structured plans, provides one-click approve/reject in a web dashboard, and can execute actions like sending contextual replies and publishing LinkedIn posts.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Gmail Watcher:</strong> Polls your inbox and generates actionable items with metadata and priority.',
          '<strong>Reasoning Loop:</strong> Produces structured <code>Plan.md</code> files and drafts responses/posts with tool-style integration.',
          '<strong>HITL Approval:</strong> No sensitive action without approval — approve/reject via dashboard or file move workflow.',
          '<strong>LinkedIn Auto-Poster:</strong> Generates business-aligned posts and publishes via Playwright automation.',
          '<strong>Live Command Center:</strong> Flask dashboard showing KPIs, pipeline status, recent activity, and action breakdowns.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Claude Code:</strong> Core reasoning and orchestration for plans and execution.',
          '<strong>Python + Flask:</strong> Agent scripts plus a web dashboard with REST endpoints.',
          '<strong>Gmail API:</strong> Reads inbox, sends contextual replies, and marks messages.',
          '<strong>Playwright:</strong> Reliable LinkedIn posting automation.',
          '<strong>Groq LLaMA 3.3 70B:</strong> Optional high-speed generation for replies and posts.'
        ],
        github: 'https://github.com/omerfarooq223/personal-ai-employee'
      },
      inboxverity: {
        title: 'InboxVerity AI',
        subtitle: 'Chrome Extension / FastAPI / Groq LLM · 2026',
        media: [
          'images/inboxverity-dashboard-overview.png',
          'images/inboxverity-dashboard-analytics.png',
          'images/inboxverity-dashboard-threat-signals.png'
        ],
        alt: 'InboxVerity AI preview',
        tags: ['Cybersecurity', 'FastAPI', 'Groq', 'Hugging Face'],
        overview: [
          'A Chrome extension and FastAPI backend that detects phishing emails with heuristic feature extraction, Hugging Face inference support, and Groq LLM risk analysis.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Heuristic Analysis:</strong> Extracts key risk features from email headers and body.',
          '<strong>AI Verification:</strong> Uses Hugging Face models and Groq LLM to verify sender authenticity and content safety.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>FastAPI:</strong> High-performance backend API.',
          '<strong>Groq LLM & Hugging Face:</strong> Powers the risk analysis and natural language understanding.',
          '<strong>Chrome Extension API:</strong> Seamlessly integrates with the user browser.'
        ],
        github: 'https://github.com/omerfarooq223/InboxVerity-AI'
      },
      parking: {
        title: 'Parking Detection System',
        subtitle: 'Computer Vision / YOLOv8 / Spatial Clustering · 2026',
        media: ['images/parkingdetection2.webp', 'images/parkingdetection1.webp'],
        alt: 'Parking Detection System preview',
        tags: ['Computer Vision', 'YOLOv8', 'DBSCAN', 'Real Time', 'Spatial Analytics', 'Chatbot'],
        overview: [
          'Real-time parking analysis system that moves beyond simple detection by ranking available spots using <strong>spatial clustering</strong> and heuristic scoring.',
          'It identifies the "best" spots based on entrance proximity, local density, and accessibility, presenting a high-level zone analysis for operators.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Spatial Clustering:</strong> Uses DBSCAN to identify spot clusters and provide density-based bonuses to the ranking algorithm.',
          '<strong>Heuristic Scoring:</strong> Ranks spots out of 100 based on detection confidence, entrance distance, and edge penalties.',
          '<strong>Vision Pipeline:</strong> Trained YOLOv8 models for robust occupancy detection in varied lighting and angles.',
          '<strong>Intelligent Assistant:</strong> Integrated chatbot for querying live occupancy data and model statistics.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Ultralytics YOLOv8:</strong> Core computer vision engine for object detection.',
          '<strong>Scikit-learn:</strong> Implements DBSCAN for intelligent spatial clustering.',
          '<strong>Gradio:</strong> Modern web interface for image and video processing control.',
          '<strong>Hugging Face API:</strong> Powers the conversational assistant layer.'
        ],
        github: 'https://github.com/omerfarooq223/parking-detection-system'
      },
      autoresearch: {
        title: 'AutoResearch Agent',
        subtitle: 'Agentic AI / Rapid Synthesis / Python · 2026',
        media: 'images/autoresearchagent.webp',
        alt: 'AutoResearch Agent preview',
        tags: ['Agentic AI', 'Multi-Source Synthesis', 'PDF Reports', 'Groq', 'Tavily', 'LLM Engineering'],
        overview: [
          'Autonomous research agent that performs <strong>multi-source web synthesis</strong> to generate professional PDF reports in under 60 seconds.',
          'It leverages high-speed reasoning via LLaMA 3.3 70B and real-time search via Tavily to deliver structured, source-backed insights with zero manual coordination.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Rapid Synthesis:</strong> Aggregates and summarizes multiple web sources into a cohesive research narrative.',
          '<strong>Source-Backed Reports:</strong> Generates polished, citation-ready PDF output for immediate review.',
          '<strong>Low-Latency Reasoning:</strong> Utilizes Groq/LLaMA 3.3 70B for near-instant research synthesis loops.',
          '<strong>Automated Search:</strong> Employs the Tavily Search API for high-relevance, current information retrieval.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Groq LLaMA 3.3 70B:</strong> Powers the core research reasoning engine.',
          '<strong>Tavily Search API:</strong> Institutional-grade search for current event retrieval.',
          '<strong>ReportLab/FPDF:</strong> Dynamic professional PDF document generation.',
          '<strong>Python Orchestration:</strong> Efficient asynchronous search and synthesis pipeline.'
        ],
        github: 'https://github.com/omerfarooq223/autoresearch-agent'
      },
      urduplanner: {
        title: 'UrduPlanner: Intelligent NLP Agent',
        subtitle: 'Specialized NLP / Document AI / Python · 2026',
        media: ['images/urduplanner.webp', 'images/urduplanner2.webp'],
        alt: 'UrduPlanner Agent preview',
        tags: ['Intelligent OCR', 'NLP', 'RTL Handling', 'Document AI', 'Groq', 'Automation'],
        overview: [
          'A high-performance NLP pipeline designed to solve the complexities of Urdu text extraction and document formatting.',
          'It combines <strong>intelligent OCR repair</strong> for mangled text reconstruction with custom <strong>RTL punctuation handling</strong> to produce classroom-ready lesson plans.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Intelligent OCR Repair:</strong> Uses LLMs to reconstruct and correct garbled Urdu text from scanned documents.',
          '<strong>RTL Punctuation Fixer:</strong> A custom regex-based engine to solve right-to-left alignment issues in AI output.',
          '<strong>Parallel Orchestration:</strong> Processes multiple lessons concurrently for significant speedups in document generation.',
          '<strong>Template Automation:</strong> Fills structured Word documents while preserving professional academic formatting.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Groq LLaMA 3.3 70B:</strong> High-precision Urdu text generation and correction.',
          '<strong>Tesseract & PyMuPDF:</strong> Multi-layer PDF extraction with OCR fallback.',
          '<strong>python-docx:</strong> Automated Word template injection and styling.',
          '<strong>Flask & Rich:</strong> Dual web and CLI interfaces for varied user workflows.'
        ],
        github: 'https://github.com/omerfarooq223/UrduPlanner-Agent'
      },
      ospilot: {
        title: 'OS Pilot',
        subtitle: 'Kaggle AI Agents Capstone / Local-First Workspace Recovery · 2026',
        media: ['images/os-pilot-dashboard.webp', 'images/os-pilot-plan.webp', 'images/os-pilot-report.webp'],
        alt: 'OS Pilot dashboard preview',
        tags: ['Kaggle Capstone', 'Multi-Agent System', 'React + Tauri', 'FastAPI', 'SQLite', 'Human Approval'],
        overview: [
          'A local-first AI developer workspace recovery agent built for the Kaggle AI Agents Capstone. <strong>OS Pilot</strong> helps developers understand laptop slowdowns, identify workspace pressure, and safely reclaim storage from rebuildable project artifacts.',
          'The system profiles a selected folder, detects project evidence, ranks cleanup opportunities, compares Conservative, Balanced, and Deep Review plans, then moves only approved items into quarantine with restore history.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Multi-Agent Pipeline:</strong> Monitor, Diagnosis, Maintenance Planner, Risk & Safety, and Report agents collaborate on each cleanup plan.',
          '<strong>Project-Aware Scanning:</strong> Detects Node, Python, Jupyter, Rust, Go, Java, Ruby, PHP, Flutter, and ML-style workspaces from manifest evidence.',
          '<strong>Safety-First Automation:</strong> Blocks risky paths, revalidates symlinks and file identity, and avoids permanent deletion by using quarantine and restore workflows.',
          '<strong>Human Approval:</strong> Presents cleanup scenarios before action, keeping the user in control of every meaningful change.',
          '<strong>Workspace Memory:</strong> Stores scan snapshots locally to explain workspace growth or shrinkage across runs.',
          '<strong>Desktop-Ready UI:</strong> React + Tauri interface for local scanning, approval, reports, quarantine, and recovery recipes.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>React, Vite & Tailwind:</strong> Responsive desktop dashboard and approval workflow.',
          '<strong>Tauri:</strong> Native desktop shell and local folder selection experience.',
          '<strong>FastAPI:</strong> Backend scan sessions, report generation, and agent orchestration endpoints.',
          '<strong>Groq AI:</strong> Structured diagnosis with deterministic fallback behavior.',
          '<strong>SQLite:</strong> Audit logs, quarantine metadata, restore history, feedback, and scan snapshots.',
          '<strong>Restricted MCP-Style Tools:</strong> Narrow allowlist for scanning, validation, quarantine, restore, and reporting.'
        ],
        github: 'https://github.com/omerfarooq223/ospilot-agent'
      },
      firewatch: {
        title: 'FireWatch AI: Autonomous Safety System',
        subtitle: 'Computer Vision / YOLOv8 / Agentic RAG · 2026',
        media: ['images/firewatch1.webp', 'images/firewatch2.webp'],
        alt: 'FireWatch AI preview',
        tags: ['Autonomous Loop', 'Computer Vision', 'YOLOv8', 'Agentic RAG', 'FastAPI', 'Cyber HUD'],
        overview: [
          'Production-grade, high-fidelity monitoring ecosystem designed for autonomous fire and smoke detection using YOLOv8.',
          'Integrates an agentic incident response loop that automatically dispatches alerts and activates suppression systems when risk thresholds are breached.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Autonomous Incident Response:</strong> Zero-latency decision engine that dispatches alerts and triggers suppression systems.',
          '<strong>Cyber HUD Overlay:</strong> Sophisticated canvas-based particle engine for real-time tactical visualization and heat-mapping.',
          '<strong>Agentic RAG Assistant:</strong> Integrated safety knowledge base built on FAISS and LangChain for context-aware safety protocols.',
          '<strong>Precision Detection:</strong> YOLOv8-seg model trained on 95,000+ images, achieving 92% segmentation accuracy.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Ultralytics YOLOv8:</strong> Real-time high-fidelity fire and smoke segmentation.',
          '<strong>FastAPI & SQLite:</strong> Robust backend orchestration for incident logging and telemetry.',
          '<strong>React & Particle Engine:</strong> Premium Cyber HUD dashboard with interactive particle physics.',
          '<strong>SentenceTransformers & FAISS:</strong> Powers the safety-critical RAG knowledge base.'
        ],
        github: 'https://github.com/omerfarooq223/Agentic-Fire-Detection'
      },
      shapids: {
        title: 'SHAP-Explained Agentic IDS',
        subtitle: 'Explainable AI / LangGraph / Flask · 2026',
        media: ['images/shap-ids.webp', 'images/shap-ids1.webp', 'images/shap-ids2.webp'],
        alt: 'SHAP-Explained Agentic IDS preview',
        tags: ['Explainable AI', 'Agentic Security', 'SHAP', 'LangGraph', 'React', 'Flask'],
        overview: [
          'A hybrid intrusion detection system for modern SOC workflows that combines <strong>Random Forest classification</strong>, <strong>SHAP explanations</strong>, and <strong>LangGraph-based reasoning</strong> to make every alert understandable.',
          'Instead of only flagging malicious flows, the system explains the contributing network features, verifies the result against threat intelligence, and adds an autonomous red-teaming loop to harden the defender.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Explainable Detection:</strong> SHAP highlights the network features that pushed a flow toward malicious or benign classification.',
          '<strong>Agentic Verification:</strong> LangGraph orchestrates observe, verify, hypothesize, and conclude steps using external threat intelligence.',
          '<strong>Autonomous Red Teaming:</strong> Attacker and Critic agents stress-test the defender to surface bypass paths and improve resilience.',
          '<strong>SOC Dashboard:</strong> React and Flask provide a live operational interface for alerts, explanations, and analyst review.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Random Forest + SMOTE:</strong> Core detection model for high-speed intrusion classification.',
          '<strong>SHAP:</strong> Feature attribution and human-readable alert explanations.',
          '<strong>LangGraph:</strong> Structured multi-step agent reasoning and tool orchestration.',
          '<strong>React, Flask, SQLite, Scapy:</strong> Dashboard, backend API, persistence, and live packet capture.'
        ],
        github: 'https://github.com/omerfarooq223/shap-agentic-ids'
      },
      clarityhire: {
        title: 'ClarityHire — AI Resume Screening & Bias Detection',
        subtitle: 'Responsible AI / FastAPI / React · 2026',
        media: ['images/clarityhire-dashboard.webp', 'images/clarityhire-ranking.webp'],
        alt: 'ClarityHire screening dashboard preview',
        tags: ['Responsible AI', 'Blind Screening', 'Fairlearn', 'Human-in-the-Loop', 'FastAPI', 'React'],
        overview: [
          '<strong>ClarityHire</strong> is a production-grade, human-in-the-loop recruitment platform that makes resume screening more transparent, explainable, and fair.',
          'It anonymizes candidate information, parses resumes and job descriptions, ranks candidates with a hybrid semantic and feature-based rubric, streams live agent execution, and audits synthetic demographic outcomes without using protected attributes for scoring.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Blind Screening:</strong> Minimizes PII before cloud processing to reduce demographic signal leakage.',
          '<strong>Hybrid Ranking:</strong> Combines semantic similarity with skill and experience evidence for transparent candidate scoring.',
          '<strong>Fairness Audit:</strong> Uses Fairlearn metrics and the 80% rule to surface demographic parity and disparate-impact signals.',
          '<strong>Human Review Controls:</strong> Keeps recruiters as the final decision owners with explanations, evidence, and review prompts.',
          '<strong>Live Agent Trace:</strong> Streams ingestion, embedding, parsing, and fairness-audit stages in real time.',
          '<strong>Exportable Reports:</strong> Generates PDF, HTML, and CSV outputs for sharing and auditability.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>FastAPI + SQLAlchemy:</strong> Async API and persistence layer with SQLite/PostgreSQL support.',
          '<strong>Celery + Redis:</strong> Durable screening pipeline and live event streaming.',
          '<strong>React + TypeScript + Vite:</strong> Glassmorphic recruiter workspace with ranking, trace, and fairness views.',
          '<strong>Sentence Transformers + Fairlearn:</strong> Semantic matching and responsible-AI evaluation metrics.'
        ],
        github: 'https://github.com/omerfarooq223/AI-Resume-Screening-Bias-Detection'
      },
      nexus: {
        title: 'NexusML: MLOps Pipeline',
        subtitle: 'MLOps / Inference Systems / Scaling Strategy · 2026',
        media: [],
        alt: 'NexusML project details',
        tags: ['MLOps', 'DistilBERT', 'Docker', 'Spark', 'Inference', 'Scaling'],
        overview: [
          'Production-minded machine learning pipeline focused on reliable inference, benchmark visibility, and a practical scaling path for large workloads.',
          'The project combines model experimentation with deployment planning, making it useful as both an engineering exercise and a blueprint for production ML operations.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Inference Pipeline:</strong> Structures preprocessing, model execution, and output handling for repeatable prediction workflows.',
          '<strong>Benchmarking:</strong> Compares DistilBERT performance characteristics to guide practical model choices.',
          '<strong>Scaling Plan:</strong> Documents a 1TB data strategy with distributed processing considerations.',
          '<strong>Deployment Readiness:</strong> Uses container-first thinking for reproducible environments.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>DistilBERT:</strong> Lightweight transformer model for efficient NLP inference.',
          '<strong>Docker:</strong> Containerized runtime for reproducibility.',
          '<strong>Apache Spark:</strong> Planned distributed processing layer for larger-scale data.',
          '<strong>Python:</strong> Core pipeline orchestration and model workflow.'
        ],
        github: 'https://github.com/omerfarooq223/nexus-ai-pipeline'
      },
      language: {
        title: 'Language Recognition',
        subtitle: 'Machine Learning / NLP Classification · 2026',
        media: [],
        alt: 'Language Recognition project details',
        tags: ['NLP', 'Logistic Regression', 'Feature Engineering', 'Scikit-learn'],
        overview: [
          'Language classifier built around clean preprocessing, custom feature extraction, and classical machine learning.',
          'The project focuses on explainable fundamentals: turning text into useful features, training a reliable classifier, and evaluating the result clearly.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Text Preprocessing:</strong> Normalizes input text before vectorization and classification.',
          '<strong>Feature Engineering:</strong> Extracts language-specific signals for model training.',
          '<strong>Baseline ML:</strong> Uses logistic regression as a transparent and fast classifier.',
          '<strong>Evaluation Workflow:</strong> Measures performance using standard classification metrics.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Python:</strong> Core implementation language.',
          '<strong>Scikit-learn:</strong> Model training, evaluation, and preprocessing utilities.',
          '<strong>NLP:</strong> Text features, vectorization, and classification logic.'
        ],
        github: 'https://github.com/omerfarooq223/language-recognition-logistic-regression'
      },
      solana: {
        title: 'Solana Trading Agent',
        subtitle: 'Agentic AI / Web3 / Risk-Aware Automation · 2026',
        media: [],
        alt: 'Solana Trading Agent project details',
        tags: ['Claude Code', 'Solana', 'Web3', 'Trading Agent', 'Risk Controls'],
        overview: [
          'Skills-based trading agent for Solana workflows with a focus on structured reasoning, risk math, and auditable automation.',
          'The project explores how agent skills can be composed into practical financial tooling while keeping trade logic observable and constrained.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Skill-Based Agent Design:</strong> Breaks trading workflows into reusable capabilities.',
          '<strong>Risk Math:</strong> Adds sizing and guardrail calculations before action.',
          '<strong>Monitoring:</strong> Tracks agent behavior and market-related signals.',
          '<strong>Secure Logging:</strong> Keeps trade reasoning and actions inspectable.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Claude Code:</strong> Agent skill development and orchestration.',
          '<strong>Solana:</strong> Target blockchain ecosystem.',
          '<strong>Web3 Tooling:</strong> Wallet, transaction, and chain interaction patterns.'
        ],
        github: 'https://github.com/omerfarooq223/solana-trading-agent-skills'
      },
      jira: {
        title: 'Jira-Slack Integration',
        subtitle: 'Workflow Automation / n8n / REST APIs · 2026',
        media: [],
        alt: 'Jira-Slack Integration project details',
        tags: ['n8n', 'Jira', 'Slack', 'Automation', 'REST APIs'],
        overview: [
          'Automation workflow connecting Jira issue activity with Slack notifications and team-facing updates.',
          'The project focuses on reducing manual status checking by routing the right project signals into the collaboration surface where teams already work.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Issue Event Routing:</strong> Sends useful Jira updates into Slack channels.',
          '<strong>Workflow Orchestration:</strong> Uses n8n to connect triggers, conditions, and API actions.',
          '<strong>REST API Integration:</strong> Coordinates data between tools through authenticated endpoints.',
          '<strong>Team Visibility:</strong> Helps keep project movement visible without manual reporting.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>n8n:</strong> Visual workflow automation and orchestration.',
          '<strong>Jira:</strong> Issue tracking source system.',
          '<strong>Slack:</strong> Notification and collaboration surface.',
          '<strong>REST APIs:</strong> Integration layer between services.'
        ],
        github: 'https://github.com/omerfarooq223/n8n-jira-slack'
      },
      autoreach: {
        title: 'AutoReach Hub',
        subtitle: 'Smart Multi-Channel Outreach & Automation / Python & Gemini AI · 2026',
        media: ['images/autoreach-dashboard.webp', 'images/autoreach-campaign.webp'],
        alt: 'AutoReach Hub multi-channel outreach dashboard preview',
        tags: ['Flask', 'Google Gemini AI', 'Microsoft 365', 'WhatsApp', 'Automation', 'Python'],
        overview: [
          'An enterprise-grade, privacy-first automation platform that streamlines multi-category contact management, generates high-converting AI copy with Google Gemini, and dispatches personalized emails and WhatsApp messages at scale.',
          'Features a glassmorphic dashboard, live placeholder replacement previews, Microsoft 365 OAuth2 Device Code SSO, SMTP multi-provider support, and zero-ban-risk UTF-8 WhatsApp deep linking.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Google Gemini AI Copywriter:</strong> Generates contextual subject lines, email bodies, and WhatsApp messages across 5 selectable tone presets.',
          '<strong>Category Management System:</strong> Tag and group contacts dynamically into custom categories with selective batch targeting.',
          '<strong>Microsoft 365 Graph API:</strong> Native SSO & MFA authentication with Device Code Flow — emails appear directly in your official Sent Items.',
          '<strong>Dynamic Variable Engine:</strong> Real-time placeholder replacement ({Name}, {CourseName}, {DueAmount}) with instant live preview.',
          '<strong>UTF-8 WhatsApp Dispatcher:</strong> Generates click-to-chat deep links preserving emojis and international phone formatting via Google libphonenumber.',
          '<strong>Multi-Channel Activity Terminal:</strong> Live terminal logging, deliverability health checks, and responsive mobile-ready controls.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Python 3.9+ & Flask 3.0+:</strong> High-performance backend routing and campaign orchestration.',
          '<strong>Google Gemini API:</strong> Context-aware multi-tone marketing and communication copy generation.',
          '<strong>Microsoft Graph API & MSAL:</strong> OAuth2 SSO and secure cloud mailbox integration.',
          '<strong>libphonenumber & Jinja2:</strong> International number normalization and dynamic template rendering.'
        ],
        github: 'https://github.com/omerfarooq223/AutoReach-Hub'
      },
      spatialfx: {
        title: 'Spatial-FX',
        subtitle: 'Computer Vision / MediaPipe / Interactive Web · 2026',
        media: ['images/spatialfx-preview.webp'],
        alt: 'Spatial-FX project details',
        tags: ['MediaPipe', 'Computer Vision', 'Hand Tracking', 'Canvas 2D', 'Web Audio', 'JavaScript'],
        overview: [
          'A real-time hand-tracking playground that turns browser camera input into cinematic, gesture-driven experiences without a heavy application framework.',
          'Spatial-FX combines hand, face, audio, and body segmentation signals across five modes: fog writing, gesture recognition, superhero effects, air painting, and an invisibility cloak.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Five Interactive Modes:</strong> Foggy Glass Writer, Gesture Detector, Hero Magic, Air Paint, and full-body Invisibility Cloak.',
          '<strong>Rich Gesture Vocabulary:</strong> Recognizes 14 gestures and supports dual-hand interactions, charged effects, and gesture shortcuts.',
          '<strong>Cinematic Rendering:</strong> Canvas-based portals, lightning, fire, particles, refraction, and animated overlays run in real time.',
          '<strong>Capture Tools:</strong> Exports screenshots and WebM recordings with the visual layers composited into the result.',
          '<strong>Responsive Performance:</strong> Automatically adjusts tracking load for lower-powered devices and mobile cameras.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>MediaPipe Tasks Vision:</strong> Hand, face, and body segmentation landmarks.',
          '<strong>HTML Canvas 2D:</strong> Real-time particle systems and cinematic visual effects.',
          '<strong>Web Audio API:</strong> Breath detection for the fog-writing interaction.',
          '<strong>Vanilla JavaScript:</strong> Lightweight application logic and responsive controls.'
        ],
        github: 'https://github.com/omerfarooq223/foggy-glass-handwriter'
      },
      personadiff: {
        title: 'PersonaDiff',
        subtitle: 'Browser Systems / Differential Auditing / Playwright · 2026',
        media: ['images/personadiff-analysis.webp', 'images/personadiff-dashboard.webp'],
        alt: 'PersonaDiff cross-persona divergence analysis and run dashboard preview',
        tags: ['Browser Systems', 'Playwright', 'Fastify', 'TypeScript', 'React 18', 'Differential Auditing'],
        overview: [
          'An evidence-first differential web auditing platform designed to execute identical bounded web journeys across isolated browser personas, capture cryptographic evidence, and compute explainable comparison metrics without claiming unsupported causation.',
          'PersonaDiff isolates cookies, local storage, and caches with dedicated Playwright contexts, records tamper-evident DOM, screenshot, and network evidence with SHA-256 hash chaining, and enables zero-network targetless replay.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Cross-Persona Divergence Analysis:</strong> Cryptographic side-by-side comparison across isolated browser sandboxes, automated finding detection & tamper-evident evidence export.',
          '<strong>Zero-Leakage Isolation:</strong> Dedicated Playwright contexts per persona with strict lifecycle teardown ensuring cookies, storage, and cache never cross boundaries.',
          '<strong>Deterministic Metrics Engine:</strong> Evaluates element presence, tokenized text cosine similarity, rank shift, numeric deltas, and redirect routes with confidence scoring.',
          '<strong>Pre-Storage PII Redaction & Defense-in-Depth:</strong> Automatically strips auth tokens, passwords, session cookies, and blocks loopback/RFC-1918/metadata SSRF endpoints.',
          '<strong>Targetless Replay Mode:</strong> Reconstructs captured journeys offline directly from stored DOM snapshots and screenshots without outbound requests.',
          '<strong>Tamper-Evident Export Bundles:</strong> Generates verifiable export packages with cryptographic SHA-256 checksums and immutable audit manifests.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>TypeScript & Playwright:</strong> Isolated browser execution and evidence capture.',
          '<strong>Fastify & React:</strong> High-performance REST API and operator interface.',
          '<strong>PostgreSQL & Redis:</strong> Run metadata, audit state, and background queues.',
          '<strong>MinIO/S3 & OpenTelemetry:</strong> Immutable artifact storage and operational visibility.'
        ],
        github: 'https://github.com/omerfarooq223/ParallelWeb'
      },
      pokemon: {
        title: 'Pokémon TCG AI Battle Agent',
        subtitle: 'Game AI / State-Aware Planning / Kaggle Competition · 2026',
        media: [],
        alt: 'Pokémon TCG AI Battle Agent project details',
        tags: ['Game AI', 'Planning', 'Heuristics', 'Simulation', 'Benchmarking', 'Kaggle'],
        overview: [
          'A rule-based, state-aware decision engine built for Kaggle\'s Pokémon TCG AI Battle Challenge and evolved through 18 documented agent generations.',
          'The final policy manages energy routing, bench composition, prize zones, damage immunity, healing loops, and tactical switching, achieving a 91.5% certified local win rate across 294 matches.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Multi-Turn Planning:</strong> Builds and protects viable attacker lines instead of choosing legal actions greedily.',
          '<strong>Dynamic Board Evaluation:</strong> Scores hand, bench, prize, energy, immunity, healing, and pivot opportunities every turn.',
          '<strong>18-Version Evolution:</strong> Preserves agent lineage from a random baseline through competitive stall and high-HP strategies.',
          '<strong>Local Match Simulator:</strong> Runs balanced seat-swapped evaluations and exhaustive regression benches.',
          '<strong>Submission Builder:</strong> Validates compilation, the 60-card deck constraint, and competition packaging requirements.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>Python:</strong> Competition-compatible agent policies and evaluation tooling.',
          '<strong>Heuristic Search:</strong> Bounded action ranking and state-aware planning.',
          '<strong>Simulation:</strong> Local matches, regression testing, and strategy benchmarks.',
          '<strong>Kaggle:</strong> Competition environment and submission format.'
        ],
        github: 'https://github.com/omerfarooq223/pokemon-tcg-ai-battle-agent'
      },
      dl: {
        title: 'DL Coursework',
        subtitle: 'Deep Learning / Neural Network Experiments · 2026',
        media: [],
        alt: 'Deep Learning Coursework project details',
        tags: ['Deep Learning', 'PyTorch', 'TensorFlow', 'CNNs', 'LSTMs'],
        overview: [
          'Collection of deep learning experiments covering neural network fundamentals, computer vision models, and sequence modeling.',
          'The work emphasizes implementation practice and model behavior over polished UI, making the repository a learning lab for core DL concepts.'
        ],
        featuresTitle: 'Detailed Features',
        features: [
          '<strong>Neural Networks From Scratch:</strong> Exercises that build intuition for forward passes, losses, and training loops.',
          '<strong>CNN Experiments:</strong> Image-focused models for computer vision coursework.',
          '<strong>Sequence Models:</strong> LSTM-style experiments for temporal or language-like data.',
          '<strong>Framework Practice:</strong> Applies modern DL libraries while reinforcing fundamentals.'
        ],
        stackTitle: 'Technology Stack',
        stack: [
          '<strong>PyTorch:</strong> Model building and experimentation.',
          '<strong>TensorFlow:</strong> Alternate deep learning framework exposure.',
          '<strong>NumPy:</strong> Numerical foundations for lower-level experiments.'
        ],
        github: 'https://github.com/omerfarooq223/dl-coursework'
      },
    };

    function renderProjectModalContent(projectId) {
      const data = projectModalData[projectId] || projectModalData.autograder;
      const title = document.getElementById('m-title-premium');
      const subtitle = document.getElementById('m-subtitle-premium');
      const tags = document.querySelector('.m-tag-cloud-premium');
      const overview = document.getElementById('m-overview-inner');
      const githubLink = document.getElementById('m-github-link');

      modalMediaSources = (Array.isArray(data.media) ? data.media : [data.media]).filter(Boolean);
      modalMediaIndex = 0;

      if (title) title.textContent = data.title;
      if (subtitle) subtitle.textContent = data.subtitle;
      if (tags) {
        tags.innerHTML = data.tags.map(tag => `<span class="m-tag-pill mt-c">${tag}</span>`).join('');
      }
      if (overview) {
        overview.innerHTML = `
          ${data.overview.map(paragraph => `<p>${paragraph}</p>`).join('')}
          <h4 class="m-desc-title" style="margin-top:40px;">${data.featuresTitle}</h4>
          <ul class="m-unified-list">
            ${data.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
          <h4 class="m-desc-title" style="margin-top:40px;">${data.stackTitle}</h4>
          <ul class="m-unified-list stack">
            ${data.stack.map(item => `<li>${item}</li>`).join('')}
          </ul>
        `;
      }
      if (githubLink) {
        githubLink.href = data.github;
      }

      updateModalMedia();
    }

    function openProjectModal(projectId = 'autograder', e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      }
      const modal = document.getElementById('proj-modal');
      renderProjectModalContent(projectId);
      if (modalMediaAutoplay) {
        clearInterval(modalMediaAutoplay);
        modalMediaAutoplay = null;
      }
      if (modalMediaSources.length > 1) {
        modalMediaAutoplay = setInterval(() => {
          stepModalMedia(1);
        }, 2500);
      }
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        const mBody = modal.querySelector('.m-body-premium');
        if (mBody) mBody.scrollTop = 0;
      }
    }

    function closeModal() {
      const modal = document.getElementById('proj-modal');
      if (modal) {
        modal.classList.remove('open');
      }
      if (modalMediaAutoplay) {
        clearInterval(modalMediaAutoplay);
        modalMediaAutoplay = null;
      }
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    window.openProjectModal = openProjectModal;
    window.closeModal = closeModal;
    window.stepModalMedia = stepModalMedia;


    document.querySelectorAll('.proj-card').forEach(card => {
      const vid = card.querySelector('video.proj-vid');
      if (vid) {
        card.addEventListener('mouseenter', () => {
          if (vid.src && vid.src !== window.location.href) {
            vid.play().catch(() => { });
          }
        });
        card.addEventListener('mouseleave', () => {
          if (vid.src && vid.src !== window.location.href) {
            vid.pause();
          }
        });
      }
    });


    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    if (themeToggle && themeLabel) {
      const applyTheme = (theme, persist = false) => {
        document.documentElement.dataset.theme = theme;
        themeLabel.textContent = theme === 'light' ? 'Light' : 'Dark';
        themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        if (persist) {
          try {
            localStorage.setItem('portfolio-theme', theme);
          } catch (e) { }
        }
      };

      const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
      applyTheme(current);

      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light', true);
      });
    }

    const hasFinePointer = window.matchMedia('(pointer:fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    if (hasFinePointer && !prefersReducedMotion) {
      document.querySelectorAll('.hero-cta .btn-a').forEach(btn => {
        let magTicking = false;
        btn.addEventListener('mousemove', e => {
          if (!magTicking) {
            requestAnimationFrame(() => {
              const rect = btn.getBoundingClientRect();
              const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
              const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
              btn.style.transform = `translate(${x}px, ${y}px)`;
              magTicking = false;
            });
            magTicking = true;
          }
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
        });
      });

      document.querySelectorAll('.edu-card, .sk-grp, .stat').forEach(c => {
        const spot = document.createElement('div');
        spot.className = 'spotlight-overlay';
        c.appendChild(spot);
        let spotTicking = false;
        c.addEventListener('mousemove', e => {
          if (!spotTicking) {
            requestAnimationFrame(() => {
              const rect = c.getBoundingClientRect();
              spot.style.background = `radial-gradient(340px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.08), transparent 42%)`;
              spotTicking = false;
            });
            spotTicking = true;
          }
        });
      });
    }

    const glowObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const glow = entry.target.querySelector('.border-glow');
        if (glow) {
          glow.classList.toggle('is-animating', entry.isIntersecting);
        }
      });
    }, { threshold: 0.05 });

    document.querySelectorAll('.proj-card').forEach(card => {
      if (card.querySelector('.border-glow')) return;
      card.classList.add('glow-border');

      const base = document.createElement('div');
      base.className = 'glow-border-base';
      card.insertBefore(base, card.firstChild);

      const glow = document.createElement('div');
      glow.className = 'border-glow';
      card.insertBefore(glow, card.firstChild);

      glowObs.observe(card);
    });


    // Caching for unified scroll handler
    const bar = document.getElementById('bar');
    const nav = document.getElementById('nav');
    const navLinks = Array.from(document.querySelectorAll('.nav-links a, .mob a'));
    const sectionChapters = [
      { id: 'about', color: 'var(--cyan)' },
      { id: 'education', color: 'var(--amber)' },
      { id: 'certificates', color: 'var(--purple)' },
      { id: 'experience', color: 'var(--pink)' },
      { id: 'projects', color: '#38bdf8' },
      { id: 'skills', color: 'var(--green)' },
      { id: 'contact', color: 'var(--amber)' }
    ];

    const sectionElements = sectionChapters.map(ch => ({
      ...ch,
      el: document.getElementById(ch.id)
    }));

    let ticking = false;
    let currentChapterId = null;
    let cachedMaxScroll = 1;
    let cachedAnchorOffset = 82;
    let cachedSectionBounds = [];

    function getSectionAnchorOffset() {
      return cachedAnchorOffset;
    }

    function refreshScrollMetrics() {
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
      cachedAnchorOffset = Number.isFinite(offset) ? offset : 82;
      cachedMaxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      cachedSectionBounds = sectionElements
        .filter(item => item.el)
        .map(item => {
          const rect = item.el.getBoundingClientRect();
          return {
            ...item,
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY
          };
        });
    }

    function updateScrollLogic() {
      const y = window.scrollY;
      const progress = Math.min(Math.max(y / cachedMaxScroll, 0), 1);

      // 1. Progress Bar
      if (bar) {
        bar.style.width = (progress * 100) + '%';
      }

      // 2. Navbar
      if (nav) {
        const isScrolled = y > 60;
        if (nav.classList.contains('scrolled') !== isScrolled) {
          nav.classList.toggle('scrolled', isScrolled);
        }
      }

      // 3. Active Section Focus Detection
      let activeIndex = -1;
      const focusY = y + getSectionAnchorOffset();

      for (let i = 0; i < cachedSectionBounds.length; i++) {
        const item = cachedSectionBounds[i];
        if (item.top <= focusY + 1) {
          activeIndex = i;
        } else {
          break;
        }
      }

      const chapter = activeIndex >= 0 ? cachedSectionBounds[activeIndex] : null;
      const newChapterId = chapter ? chapter.id : null;

      if (newChapterId !== currentChapterId) {
        currentChapterId = newChapterId;
        if (chapter) {
          document.body.style.setProperty('--chapter-accent', chapter.color);
        }
        navLinks.forEach(link => {
          const targetId = link.getAttribute('href')?.slice(1);
          link.classList.toggle('is-active', targetId === newChapterId);
        });
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollLogic);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      refreshScrollMetrics();
      updateScrollLogic();
    }, { passive: true });

    window.addEventListener('load', () => {
      refreshScrollMetrics();
      updateScrollLogic();
    }, { once: true });

    refreshScrollMetrics();
    updateScrollLogic();

    const secObs = new IntersectionObserver(ents => {
      ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('sec-visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('section.sec').forEach(s => secObs.observe(s));

    const ctW = document.querySelector('#contact .ct-wrap');
    if (ctW && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      const ctObs = new IntersectionObserver(ents => {
        ents.forEach(e => {
          if (e.isIntersecting) {
            ctW.classList.add('ct-play');
            ctObs.disconnect();
          }
        });
      }, { threshold: 0.15 });
      ctObs.observe(document.getElementById('contact'));
    }

    const ham = document.getElementById('ham');
    const mob = document.getElementById('mob');
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mob.classList.toggle('open');
      document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('open'); mob.classList.remove('open'); document.body.style.overflow = '';
    }));

    const btt = document.getElementById('btt');
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;

        e.target.classList.remove('out-up');
        e.target.classList.add('in');

        if (e.target.classList.contains('stg') || e.target.classList.contains('sl-r')) {
          e.target.querySelectorAll('[data-target]').forEach(animCount);
        }
        if (e.target.hasAttribute('data-target')) animCount(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });


    document.querySelectorAll('.r3d,.sl-l,.sl-r,.stg,.wr').forEach(el => obs.observe(el));

    function animCount(el) {
      if (!el || el._counted) return;
      el._counted = true;
      const target = parseFloat(el.dataset.target);
      const dec = parseInt(el.dataset.dec || 0);
      const suf = el.dataset.suf || '';
      const dur = 1200;
      const t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * ease).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(dec) + suf;
      })(t0);
    }

    // Populate the about-section stats immediately as a reliable fallback
    // when the section starts outside the initial viewport.
    document.querySelectorAll('.stats [data-target]').forEach(animCount);

    // ── AMBIENT FLOW BACKGROUND ──
    const cvsNode = document.getElementById('nw');
    if (cvsNode) {
      const ctx = cvsNode.getContext('2d', { alpha: true });
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const pointer = { x: 0, y: 0 };
      const motes = [];
      let w = 0;
      let h = 0;
      let dpr = 1;
      let frame = 0;
      let lastDrawTime = 0;

      function palette() {
        const light = document.documentElement.dataset.theme === 'light';
        return light
          ? ['rgba(3,105,161,.42)', 'rgba(67,56,202,.34)', 'rgba(190,24,93,.30)', 'rgba(180,83,9,.26)']
          : ['rgba(0,229,255,.22)', 'rgba(168,85,247,.18)', 'rgba(244,114,182,.14)', 'rgba(251,191,36,.10)'];
      }

      function resetBackground() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        w = window.innerWidth;
        h = window.innerHeight;
        cvsNode.width = Math.floor(w * dpr);
        cvsNode.height = Math.floor(h * dpr);
        cvsNode.style.width = `${w}px`;
        cvsNode.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        motes.length = 0;
        const colors = palette();
        const light = document.documentElement.dataset.theme === 'light';
        const moteCount = w < 800 ? (light ? 38 : 24) : (light ? 82 : 52);
        for (let i = 0; i < moteCount; i++) {
          motes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: (light ? 0.9 : 0.7) + Math.random() * (light ? 2.1 : 1.7),
            vx: -0.08 + Math.random() * 0.16,
            vy: -0.05 - Math.random() * 0.11,
            color: colors[i % colors.length],
            pulse: Math.random() * Math.PI * 2,
            halo: Math.random() > 0.84
          });
        }
      }

      function drawMotes(time) {
        motes.forEach((mote, i) => {
          mote.x += mote.vx + Math.sin(time * 0.0007 + i) * 0.06;
          mote.y += mote.vy;
          if (mote.y < -20) {
            mote.y = h + 20;
            mote.x = Math.random() * w;
          }
          if (mote.x < -20) mote.x = w + 20;
          if (mote.x > w + 20) mote.x = -20;

          const light = document.documentElement.dataset.theme === 'light';
          const glow = (light ? 0.62 : 0.34) + Math.sin(time * 0.0014 + mote.pulse) * (light ? 0.22 : 0.16);
          ctx.beginPath();
          ctx.fillStyle = mote.color.replace(/[\d.]+\)$/g, `${Math.max(glow, 0.12)})`);
          ctx.arc(mote.x + pointer.x * 10, mote.y + pointer.y * 6, mote.r, 0, Math.PI * 2);
          ctx.fill();

          if (mote.halo) {
            const halo = ctx.createRadialGradient(mote.x, mote.y, 0, mote.x, mote.y, mote.r * 9);
            halo.addColorStop(0, mote.color.replace(/[\d.]+\)$/g, light ? '.24)' : '.12)'));
            halo.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(mote.x, mote.y, mote.r * 9, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      function drawAmbientGlows(time) {
        const colors = palette();
        const points = [
          { x: w * (0.18 + pointer.x * 0.018), y: h * 0.24, r: Math.max(w, h) * 0.36, color: colors[0] },
          { x: w * (0.78 + pointer.x * 0.014), y: h * 0.18, r: Math.max(w, h) * 0.30, color: colors[1] },
          { x: w * 0.62, y: h * (0.74 + pointer.y * 0.018), r: Math.max(w, h) * 0.34, color: colors[2] }
        ];

        points.forEach((point, index) => {
          const pulse = 1 + Math.sin(time * 0.0007 + index) * 0.08;
          const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.r * pulse);
          const alphaA = document.documentElement.dataset.theme === 'light' ? '.22)' : '.085)';
          const alphaB = document.documentElement.dataset.theme === 'light' ? '.09)' : '.032)';
          glow.addColorStop(0, point.color.replace(/[\d.]+\)$/g, alphaA));
          glow.addColorStop(0.48, point.color.replace(/[\d.]+\)$/g, alphaB));
          glow.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, w, h);
        });
      }

      function draw(time = 0) {
        frame = requestAnimationFrame(draw);
        if (document.visibilityState !== 'visible' || time - lastDrawTime < 33) return;
        lastDrawTime = time;
        ctx.clearRect(0, 0, w, h);

        const bg = ctx.createRadialGradient(w * 0.58, h * 0.2, 0, w * 0.58, h * 0.2, Math.max(w, h) * 0.82);
        const light = document.documentElement.dataset.theme === 'light';
        bg.addColorStop(0, light ? 'rgba(3,105,161,.20)' : 'rgba(0,229,255,.078)');
        bg.addColorStop(0.45, light ? 'rgba(67,56,202,.105)' : 'rgba(168,85,247,.048)');
        bg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = 'lighter';
        drawAmbientGlows(time);
        drawMotes(time);
        ctx.globalCompositeOperation = 'source-over';

        if (reducedMotion) {
          cancelAnimationFrame(frame);
        }
      }

      document.addEventListener('mousemove', (event) => {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });

      new MutationObserver(resetBackground).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      window.addEventListener('resize', resetBackground);
      resetBackground();
      draw();
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    /* ── Certification Lightbox ── */
    const certData = [
      { src: 'docs/Google Certificate.webp', caption: 'Intro to Generative AI' },
      { src: 'docs/certificate-fmssrk5frsx3.webp', caption: 'AI Fluency: AI Capabilities & Limitations' },
      { src: 'docs/cert-new-2.webp', caption: 'AI Fluency for Students - Anthropic' },
      { src: 'docs/cert-new-1.webp', caption: 'Claude 101 - Anthropic' },
      { src: 'docs/cert-new-3.webp', caption: 'Claude Code 101 - Anthropic' },
      { src: 'docs/cert-ai-foundations.webp', caption: 'AI Foundations - OpenAI Academy' },
      { src: 'docs/cert-s3jn6owcs6f6.webp', caption: 'AI Fluency: Framework & Foundations - Anthropic' },
      { src: 'docs/cert-rn2wppq639.webp', caption: 'Applied AI Foundations - OpenAI Academy' },
      { src: 'docs/cert-claude-platform-101.webp', caption: 'Claude Platform 101 - Anthropic' },
      { src: 'docs/Peer_Tutoring_Certificate.webp', caption: 'Peer Tutoring Certificate - UMT' },
      { src: 'docs/certificate-5s66gnoyjedq.webp', caption: 'Claude Code in Action - Anthropic' },
      { src: 'docs/5-Day AI Agents Intensive Vibe Coding Course.webp', caption: '5-Day AI Agents: Intensive Vibe Coding Course - Kaggle / Google' },
      { src: 'docs/intro-to-ai-ethics.webp', caption: 'Intro to AI Ethics - Kaggle' }
    ];
    function openCertLightbox(idx) {
      const lb = document.getElementById('certLightbox');
      const img = document.getElementById('certLightboxImg');
      const cap = document.getElementById('certLightboxCaption');
      const openBtn = document.getElementById('certLightboxOpen');
      if (!lb || !certData[idx]) return;
      img.src = certData[idx].src;
      cap.textContent = certData[idx].caption;
      if (openBtn) openBtn.href = certData[idx].src;
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeCertLightbox() {
      const lb = document.getElementById('certLightbox');
      if (!lb) return;
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    const certLightbox = document.getElementById('certLightbox');
    if (certLightbox && certLightbox.parentElement !== document.body) {
      document.body.appendChild(certLightbox);
    }

    certLightbox?.addEventListener('click', function (e) {
      if (e.target === this) closeCertLightbox();
    });
    document.querySelector('.cert-lightbox-close')?.addEventListener('click', closeCertLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCertLightbox();
    });

    /* ── Show More Certificates ── */
    function toggleMoreCerts() {
      const extraCerts = document.querySelectorAll('[data-extra-cert]');
      const btn = document.getElementById('showMoreCerts');
      const btnText = btn?.querySelector('.cert-button-label');
      if (!btn || !btnText || !extraCerts.length) return;

      const isExpanded = btn.classList.toggle('is-expanded');
      btn.setAttribute('aria-expanded', String(isExpanded));
      extraCerts.forEach(cert => cert.classList.toggle('hidden-cert', !isExpanded));
      btnText.textContent = isExpanded ? 'Show Less' : 'Show More Certificates';
    }

    document.getElementById('showMoreCerts')?.addEventListener('click', (event) => {
      event.preventDefault();
      toggleMoreCerts();
    });

    window.openCertLightbox = openCertLightbox;
    window.closeCertLightbox = closeCertLightbox;
    window.toggleMoreCerts = toggleMoreCerts;

    const ebTicker = document.getElementById('ebTicker');
    if (ebTicker) {
      ebTicker.textContent = 'Agentic AI/ML Engineer';
      ebTicker.classList.add('eb-role');
      ebTicker.classList.remove('eb-meta', 'is-out');
    }

    const showMoreProjectsBtn = document.getElementById('showMoreProjects');
    const showLessProjectsBtn = document.getElementById('showLessProjects');
    const allProjectsLink = document.getElementById('allProjectsLink');
    if (showMoreProjectsBtn) {
      showMoreProjectsBtn.addEventListener('click', () => {
        document.querySelectorAll('#projects .project-more-card').forEach(card => {
          card.classList.remove('hidden-project');
        });
        showMoreProjectsBtn.hidden = true;
        if (showLessProjectsBtn) showLessProjectsBtn.hidden = false;
        if (allProjectsLink) allProjectsLink.hidden = false;
        requestAnimationFrame(() => {
          refreshScrollMetrics();
          updateScrollLogic();
        });
      });
    }
    if (showLessProjectsBtn) {
      showLessProjectsBtn.addEventListener('click', () => {
        const projectsSection = document.getElementById('projects');
        const projectsTop = projectsSection
          ? projectsSection.getBoundingClientRect().top + window.scrollY
          : 0;
        document.querySelectorAll('#projects .project-more-card').forEach(card => {
          card.classList.add('hidden-project');
        });
        showLessProjectsBtn.hidden = true;
        if (showMoreProjectsBtn) showMoreProjectsBtn.hidden = false;
        requestAnimationFrame(() => {
          refreshScrollMetrics();
          window.scrollTo({
            top: Math.max(projectsTop - getSectionAnchorOffset(), 0),
            behavior: 'auto'
          });
          updateScrollLogic();
        });
      });
    }

    const showMoreExpBtn = document.getElementById('showMoreExp');
    if (showMoreExpBtn) {
      showMoreExpBtn.addEventListener('click', () => {
        const hiddenItems = document.querySelectorAll('#expW .hidden-exp');
        const isExpanded = showMoreExpBtn.getAttribute('aria-expanded') === 'true';
        hiddenItems.forEach(item => {
          item.classList.toggle('is-visible', !isExpanded);
        });
        showMoreExpBtn.setAttribute('aria-expanded', String(!isExpanded));
        const span = showMoreExpBtn.querySelector('span');
        if (span) span.textContent = isExpanded ? 'SEE MORE EXPERIENCE' : 'SHOW LESS EXPERIENCE';
        const svg = showMoreExpBtn.querySelector('svg');
        if (svg) svg.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    }

// Document Preview Logic
// Document Preview Logic
    (function () {
      const docModal = document.getElementById('docModal');
      const docBody = document.getElementById('docBody');
      const docTitle = document.getElementById('docTitle');
      const fullViewBtn = document.getElementById('fullViewBtn');
      const docClose = document.getElementById('docClose');

      if (!docModal || !docBody || !docClose) return;

      function openPreview(url, title, event) {
        if (event) event.preventDefault();

        docTitle.innerText = title || "Document Preview";
        fullViewBtn.href = url;
        docBody.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;">Loading...</div>';

        setTimeout(() => {
          docBody.innerHTML = '';
          if (url.toLowerCase().endsWith('.pdf')) {
            const iframe = document.createElement('iframe');
            iframe.src = url + "#toolbar=0&navpanes=0&scrollbar=0";
            docBody.appendChild(iframe);
          } else {
            const img = document.createElement('img');
            img.src = url;
            docBody.appendChild(img);
          }
        }, 300);

        docModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closePreview() {
        docModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { docBody.innerHTML = ''; }, 400);
      }

      docClose.addEventListener('click', closePreview);
      docModal.addEventListener('click', (e) => {
        if (e.target === docModal) closePreview();
      });

      // Delegate click event to document to handle all current and future links
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="docs/"], a[href$=".pdf"]');
        if (link && !link.hasAttribute('download') && !link.classList.contains('doc-modal-btn')) {
          e.preventDefault();
          const title = link.getAttribute('data-title') || link.innerText.trim() || "Document Preview";
          openPreview(link.getAttribute('href'), title, e);
        }
      });

      // Handle ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePreview();
      });
    })();
