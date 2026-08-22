(function () {
  'use strict';

  const canvas = document.getElementById('geoBgCanvas') || document.createElement('canvas');
  canvas.id = 'geoBgCanvas';
  if (!canvas.parentNode) document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const stone = new Image();
  stone.src = 'assets/stone-surface.png';
  stone.onload = function () {
    invalidateStaticLayers();
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = 1;

  // Mouse tracking for intelligent synaptic reactivity
  let mouse = { x: -1000, y: -1000, active: false };

  // ─── High-Fidelity Cyberpunk Laser Palette ───────────────────────────────────
  const PALETTE = [
    { hue: 195, hex: '#00d4ff', lightHex: '#0088cc' },
    { hue: 145, hex: '#00ff77', lightHex: '#00aa44' },
    { hue: 285, hex: '#c83aff', lightHex: '#9920cc' },
    { hue: 350, hex: '#ff2d55', lightHex: '#d41138' },
    { hue: 42, hex: '#ffb300', lightHex: '#d97706' },
    { hue: 220, hex: '#3b82f6', lightHex: '#1d4ed8' }
  ];

  // ─── Intelligent Network Graph ───────────────────────────────────────────────
  let traces = [];
  let activePulses = [];
  let turnPhase = 0;
  let turnElapsedMs = 0;
  let turnStarted = false;
  let lastFrameTime = 0;

  // ─── Interactive Energy Wave & Power Surge System ─────────────────────────────
  let ripples = [];
  let surgeIntensity = 0;

  // Offscreen Caching Layers for Zero-Lag 60/120FPS Performance
  let bgOffscreen = document.createElement('canvas');
  let bgCtx = bgOffscreen.getContext('2d');
  let tracesOffscreen = document.createElement('canvas');
  let tracesCtx = tracesOffscreen.getContext('2d');
  let cachedTheme = null;
  let staticLayersValid = false;

  function invalidateStaticLayers() {
    staticLayersValid = false;
  }

  // Build high-contrast, crystal-clear PCB circuit network with left-right links
  function buildCircuitNetwork() {
    traces = [];
    activePulses = [];

    // Both halves use the same responsive lane coordinates, keeping the open
    // center precise and symmetrical without crowding smaller screens.
    const numLanes = Math.max(24, Math.min(28, Math.floor(height / 38) + 6));
    const usableHeight = height * 0.94;
    const laneSpacing = usableHeight / Math.max(numLanes - 1, 1);
    const firstLaneY = (height - usableHeight) * 0.5;
    const centerGap = Math.max(28, Math.min(72, width * 0.045));
    // Keep the characteristic bends, but make them smaller than the lane
    // spacing so adjacent patterned traces do not visually merge.
    const jog = Math.min(laneSpacing * 0.55, 28);
    const centerEnd = width * 0.5 - centerGap * 0.5;
    // Deliberately stagger the reach of each lane: some traces stay short,
    // some move through the mid-field, and a few approach the center gap.
    const reachProfile = [
      0.30, 0.38, 0.44, 0.33, 0.41, 0.46,
      0.35, 0.43, 0.31, 0.40, 0.45, 0.36
    ];

    // Preserve the original five routing motifs, but give each lane its own
    // inward-facing boundary. Mirroring the completed path keeps the geometry
    // balanced without turning any pair into a connected trace.
    function makePatternedLane(baseY, pattern, endX) {
      const x1 = width * 0.06 + (pattern % 3) * 18;
      const x2 = x1 + jog + width * 0.08;
      const points = [{ x: -40, y: baseY }];

      if (pattern === 0) {
        points.push({ x: x1, y: baseY });
        points.push({ x: x1 + jog, y: baseY + jog });
        points.push({ x: endX, y: baseY + jog });
      } else if (pattern === 1) {
        points.push({ x: x1, y: baseY });
        points.push({ x: x1 + jog, y: baseY + jog });
        points.push({ x: x2, y: baseY + jog });
        points.push({ x: x2 + jog, y: baseY });
        points.push({ x: endX, y: baseY });
      } else if (pattern === 2) {
        points.push({ x: x1 + width * 0.04, y: baseY });
        points.push({ x: x1 + width * 0.04 + jog, y: baseY - jog });
        points.push({ x: endX, y: baseY - jog });
      } else if (pattern === 3) {
        points.push({ x: endX, y: baseY });
      } else {
        points.push({ x: x1, y: baseY });
        points.push({ x: x1 + jog, y: baseY + jog });
        points.push({ x: x2, y: baseY + jog });
        points.push({ x: x2 + jog, y: baseY + jog * 2 });
        points.push({ x: endX, y: baseY + jog * 2 });
      }

      return points;
    }

    function mirrorLane(points) {
      // Keep the traversal order intact: the left path starts at the outer
      // edge and ends at center, so its mirror must do the same on the right.
      return points.map(point => ({ x: width - point.x, y: point.y }));
    }

    function compileTrace(rawPoints, originSide, laneNumber) {
      const points = [];
      for (let i = 0; i < rawPoints.length; i++) {
        const pt = rawPoints[i];
        if (i === 0 || pt.x !== rawPoints[i - 1].x || pt.y !== rawPoints[i - 1].y) {
          points.push({ x: pt.x, y: pt.y });
        }
      }

      let segLengths = [];
      let totalLength = 0;
      for (let i = 0; i < points.length - 1; i++) {
        const d = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
        segLengths.push(d);
        totalLength += d;
      }

      const traceObj = {
        points,
        segLengths,
        totalLength,
        originSide,
        laneNumber,
        terminalGlow: 0,
        terminalColor: PALETTE[0]
      };

      traces.push(traceObj);
    }

    // 1. LEFT INFLOW TRACES — varied PCB-style routing, ending before center.
    for (let i = 1; i <= numLanes; i++) {
      const baseY = firstLaneY + (i - 1) * laneSpacing;
      const reach = reachProfile[(i - 1) % reachProfile.length];
      const endX = Math.min(centerEnd, width * reach);
      compileTrace(makePatternedLane(baseY, i % 5, endX), 'left', i);
    }

    // 2. RIGHT INFLOW TRACES — exact geometric mirror of the left motifs.
    for (let i = 1; i <= numLanes; i++) {
      const baseY = firstLaneY + (i - 1) * laneSpacing;
      const reach = reachProfile[(i - 1) % reachProfile.length];
      const endX = Math.min(centerEnd, width * reach);
      compileTrace(mirrorLane(makePatternedLane(baseY, i % 5, endX)), 'right', i);
    }

    invalidateStaticLayers();
  }

  // Exact Coordinate Calculation Along Trace
  function getPointAlongTrace(trace, d) {
    if (d <= 0) {
      return { x: trace.points[0].x, y: trace.points[0].y, valid: d >= -100 };
    }
    if (d >= trace.totalLength) {
      const last = trace.points[trace.points.length - 1];
      return { x: last.x, y: last.y, valid: d <= trace.totalLength + 100 };
    }

    let remain = d;
    for (let i = 0; i < trace.segLengths.length; i++) {
      const len = trace.segLengths[i];
      if (remain <= len) {
        const t = len > 0 ? remain / len : 0;
        const p0 = trace.points[i];
        const p1 = trace.points[i + 1];
        return {
          x: p0.x + (p1.x - p0.x) * t,
          y: p0.y + (p1.y - p0.y) * t,
          valid: true
        };
      }
      remain -= len;
    }
    const last = trace.points[trace.points.length - 1];
    return { x: last.x, y: last.y, valid: true };
  }

  // Spawn a directional pulse. Every trace is stored from its outer edge to
  // its center endpoint, so +1 travels inward and -1 travels outward.
  function spawnTurnPulse(trace, order, direction) {
    const color = PALETTE[(trace.laneNumber + (trace.originSide === 'right' ? 2 : 0)) % PALETTE.length];
    const trailLength = 70 + (trace.laneNumber % 3) * 12;
    const staggerDistance = order * 12;

    activePulses.push({
      trace,
      color,
      direction,
      dist: direction > 0
        ? -trailLength - staggerDistance
        : trace.totalLength + trailLength + staggerDistance,
      speed: 2.4 + (trace.laneNumber % 3) * 0.25,
      trailLength,
      endpointTriggered: direction < 0
    });

    // Outward pulses originate at the center terminal, so establish their
    // handoff glow immediately while their head enters the visible path.
    if (direction < 0) {
      trace.terminalGlow = Math.max(trace.terminalGlow, 0.72);
      trace.terminalColor = color;
    }
  }

  // Quantum Energy Shockwave (Triggered on background click)
  function spawnQuantumWave(x, y) {
    if (reducedMotion) return;
    const maxR = Math.max(width, height) * 0.42;
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

    ripples.push({
      x,
      y,
      radius: 4,
      maxRadius: maxR,
      speed: 6.8,
      alpha: 0.92,
      color,
      excitedTraces: new Set()
    });
  }

  // System Power Surge (Triggered on button/link click)
  function triggerPowerSurge() {
    if (reducedMotion) return;
    surgeIntensity = 1.0;

    // Flare terminals across the network
    traces.forEach((t) => {
      if (Math.random() < 0.65) {
        t.terminalGlow = Math.max(t.terminalGlow, 0.95);
        t.terminalColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      }
    });

    // Spawn an immediate burst of extra laser pulses
    const sampleTraces = traces.filter(() => Math.random() < 0.40);
    sampleTraces.forEach((trace, idx) => {
      const dir = (idx % 2 === 0) ? 1 : -1;
      spawnTurnPulse(trace, 0, dir);
    });
  }

  function updateRipples(deltaMs, frameScale) {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += r.speed * frameScale;
      r.alpha -= 0.018 * frameScale;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }

      // Check intersection with PCB circuit traces to ignite excited pulses
      traces.forEach((trace) => {
        if (r.excitedTraces.has(trace)) return;

        for (let p = 0; p < trace.points.length; p++) {
          const pt = trace.points[p];
          const dist = Math.hypot(pt.x - r.x, pt.y - r.y);
          if (Math.abs(dist - r.radius) < 24) {
            r.excitedTraces.add(trace);
            const dir = pt.x < width * 0.5 ? 1 : -1;
            activePulses.push({
              trace,
              color: r.color,
              direction: dir,
              dist: dir > 0 ? 0 : trace.totalLength,
              speed: 4.8,
              trailLength: 95,
              endpointTriggered: false
            });
            trace.terminalGlow = 1.0;
            trace.terminalColor = r.color;
            break;
          }
        }
      });
    }
  }

  function drawRipples(lm) {
    if (reducedMotion || ripples.length === 0) return;

    ctx.save();
    ripples.forEach((r) => {
      const hex = lm ? r.color.lightHex : r.color.hex;

      // Primary Shockwave Ring
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = hex;
      ctx.globalAlpha = Math.max(0, r.alpha);
      ctx.lineWidth = lm ? 2.2 : 2.8;
      ctx.shadowColor = hex;
      ctx.shadowBlur = 14;
      ctx.stroke();

      // Secondary Inner Core Ring
      if (r.radius > 16) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0, r.radius - 8), 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = Math.max(0, r.alpha * 0.5);
        ctx.lineWidth = 1.0;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  function startNextTurn() {
    turnPhase = (turnPhase + 1) % 3;
    let leftOrder = 0;
    let rightOrder = 0;

    traces.forEach((trace) => {
      // Three shifting groups create the counterflow: one moves inward, one
      // outward, and one rests. Corresponding left/right lanes use the same
      // slot, preserving symmetry while avoiding rigid synchronized motion.
      const flowSlot = (trace.laneNumber - 1 + turnPhase) % 3;
      if (flowSlot === 2) return;
      const direction = flowSlot === 0 ? 1 : -1;

      // Each bank has its own counter, so paired sides start together.
      const sideOrder = trace.originSide === 'left' ? leftOrder++ : rightOrder++;
      spawnTurnPulse(trace, sideOrder, direction);
    });
  }

  function updatePulseStep(deltaMs) {
    const frameScale = deltaMs / (1000 / 60);
    // Wide layouts have longer inward traces. Let the slowest pulse finish
    // before switching parity, otherwise its glow would be reset mid-route.
    const longestTrace = traces.reduce((longest, trace) => Math.max(longest, trace.totalLength), 0);
    const turnLength = Math.max(460, Math.ceil((longestTrace + 360) / 2.4));
    const overlapFrames = Math.min(120, Math.floor(turnLength * 0.22));
    const turnCycleMs = (turnLength - overlapFrames) * (1000 / 60);

    if (!turnStarted) {
      turnStarted = true;
      startNextTurn();
    }

    turnElapsedMs += deltaMs;
    while (turnElapsedMs >= turnCycleMs) {
      turnElapsedMs -= turnCycleMs;
      startNextTurn();
    }

    if (surgeIntensity > 0) {
      surgeIntensity = Math.max(0, surgeIntensity - (deltaMs / 550));
    }

    for (let i = activePulses.length - 1; i >= 0; i--) {
      const pulse = activePulses[i];

      let currentSpeed = pulse.speed * (1 + surgeIntensity * 1.5);
      const headPt = getPointAlongTrace(pulse.trace, pulse.dist);
      if (mouse.active && headPt.valid) {
        const mouseDist = Math.hypot(mouse.x - headPt.x, mouse.y - headPt.y);
        if (mouseDist < 120) {
          currentSpeed *= 1.35;
        }
      }

      const previousDist = pulse.dist;
      pulse.dist += pulse.direction * currentSpeed * frameScale;

      if (
        pulse.direction > 0 &&
        !pulse.endpointTriggered &&
        previousDist < pulse.trace.totalLength &&
        pulse.dist >= pulse.trace.totalLength
      ) {
        pulse.endpointTriggered = true;
        pulse.trace.terminalGlow = 1;
        pulse.trace.terminalColor = pulse.color;
      }

      const inwardFinished = pulse.direction > 0 &&
        pulse.dist > pulse.trace.totalLength + pulse.trailLength + 60;
      const outwardFinished = pulse.direction < 0 &&
        pulse.dist < -pulse.trailLength - 60;

      if (inwardFinished || outwardFinished) {
        activePulses.splice(i, 1);
      }
    }
  }

  // Time-based stepping prevents dropped frames during scrolling from freezing
  // the animation clock. Small subdivisions keep turn overlap deterministic.
  function updatePulses(deltaMs) {
    let remaining = Math.min(Math.max(deltaMs, 0), 2000);
    while (remaining > 0) {
      const step = Math.min(remaining, 50);
      updatePulseStep(step);
      remaining -= step;
    }
  }

  function drawTerminalGlows(lm, frameScale) {
    if (reducedMotion) return;

    ctx.save();
    traces.forEach((trace) => {
      if (trace.terminalGlow <= 0.02) return;
      const endpoint = trace.points[trace.points.length - 1];
      const hex = lm ? trace.terminalColor.lightHex : trace.terminalColor.hex;
      const halo = ctx.createRadialGradient(endpoint.x, endpoint.y, 0, endpoint.x, endpoint.y, 14);
      halo.addColorStop(0, `rgba(255,255,255,${0.82 * trace.terminalGlow})`);
      halo.addColorStop(0.24, `hsla(${trace.terminalColor.hue},100%,${lm ? 55 : 66}%,${0.62 * trace.terminalGlow})`);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.shadowColor = hex;
      ctx.shadowBlur = 7;
      ctx.fillRect(endpoint.x - 14, endpoint.y - 14, 28, 28);
      trace.terminalGlow *= Math.pow(0.93, frameScale);
    });
    ctx.restore();
  }

  // Resize Handler
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    bgOffscreen.width = Math.round(width * dpr);
    bgOffscreen.height = Math.round(height * dpr);
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    tracesOffscreen.width = Math.round(width * dpr);
    tracesOffscreen.height = Math.round(height * dpr);
    tracesCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildCircuitNetwork();

    // The first alternating turn is started by updatePulses on the next frame.
    turnElapsedMs = 0;
    turnStarted = false;
    turnPhase = 0;
    lastFrameTime = performance.now();
  }

  // Pre-render Background Texture (Stone + Matte Void + Vignette)
  function renderCachedBackground(lm) {
    bgCtx.clearRect(0, 0, width, height);

    if (stone.complete && stone.naturalWidth) {
      const scale = Math.max(width / stone.naturalWidth, height / stone.naturalHeight);
      const tw = stone.naturalWidth * scale;
      const th = stone.naturalHeight * scale;
      bgCtx.save();
      bgCtx.globalAlpha = lm ? 0.12 : 0.40;
      bgCtx.drawImage(stone, (width - tw) / 2, (height - th) / 2, tw, th);
      bgCtx.restore();
    }

    bgCtx.save();
    bgCtx.fillStyle = lm ? 'rgba(235,239,243,0.85)' : 'rgba(4,6,10,0.78)';
    bgCtx.fillRect(0, 0, width, height);

    const vignette = bgCtx.createRadialGradient(
      width * 0.5, height * 0.45, height * 0.10,
      width * 0.5, height * 0.5, Math.max(width, height) * 0.82
    );
    vignette.addColorStop(0, lm ? 'rgba(255,255,255,0)' : 'rgba(6,9,14,0)');
    vignette.addColorStop(0.70, lm ? 'rgba(70,85,95,0.06)' : 'rgba(0,0,0,0.52)');
    vignette.addColorStop(1, lm ? 'rgba(50,65,75,0.18)' : 'rgba(0,0,0,0.88)');
    bgCtx.fillStyle = vignette;
    bgCtx.fillRect(0, 0, width, height);
    bgCtx.restore();
  }

  // Pre-render Static PCB Circuit Traces
  function renderCachedTraces(lm) {
    tracesCtx.clearRect(0, 0, width, height);
    tracesCtx.save();
    tracesCtx.lineJoin = 'miter';
    tracesCtx.lineCap = 'round';

    // Layer A: Deep Shadow Groove
    tracesCtx.beginPath();
    traces.forEach((t) => {
      tracesCtx.moveTo(t.points[0].x, t.points[0].y);
      for (let i = 1; i < t.points.length; i++) {
        tracesCtx.lineTo(t.points[i].x, t.points[i].y);
      }
    });
    tracesCtx.strokeStyle = lm ? 'rgba(45,55,65,0.24)' : 'rgba(0,0,0,0.92)';
    tracesCtx.lineWidth = lm ? 3.6 : 4.2;
    tracesCtx.shadowColor = lm ? 'rgba(30,40,50,0.22)' : 'rgba(0,0,0,0.95)';
    tracesCtx.shadowBlur = 2.2;
    tracesCtx.shadowOffsetX = 1.2;
    tracesCtx.shadowOffsetY = 1.6;
    tracesCtx.stroke();

    traces.forEach((t) => {
      const first = t.points[0];
      const last = t.points[t.points.length - 1];
      const trackGradient = tracesCtx.createLinearGradient(first.x, first.y, last.x, last.y);
      if (lm) {
        trackGradient.addColorStop(0, 'rgba(70,85,98,0.34)');
        trackGradient.addColorStop(0.78, 'rgba(90,112,124,0.40)');
        trackGradient.addColorStop(0.94, 'rgba(170,195,205,0.62)');
        trackGradient.addColorStop(1, 'rgba(235,248,252,0.88)');
      } else {
        trackGradient.addColorStop(0, 'rgba(12,22,30,0.96)');
        trackGradient.addColorStop(0.78, 'rgba(18,37,48,0.94)');
        trackGradient.addColorStop(0.94, 'rgba(42,92,108,0.96)');
        trackGradient.addColorStop(1, 'rgba(105,190,214,1)');
      }

      tracesCtx.beginPath();
      tracesCtx.moveTo(first.x, first.y);
      for (let i = 1; i < t.points.length; i++) tracesCtx.lineTo(t.points[i].x, t.points[i].y);
      tracesCtx.strokeStyle = trackGradient;
      tracesCtx.lineWidth = lm ? 1.6 : 1.8;
      tracesCtx.shadowColor = 'transparent';
      tracesCtx.stroke();

      // Finish every trace with a dedicated terminal gradient. This prevents
      // the directional highlight from appearing to fade out before the
      // actual endpoint, especially after a diagonal or jogged segment.
      const beforeLast = t.points[Math.max(0, t.points.length - 2)];
      const terminalGradient = tracesCtx.createLinearGradient(
        beforeLast.x, beforeLast.y, last.x, last.y
      );
      terminalGradient.addColorStop(0, lm ? 'rgba(160,185,195,0.24)' : 'rgba(60,125,145,0.18)');
      terminalGradient.addColorStop(0.58, lm ? 'rgba(220,238,244,0.68)' : 'rgba(95,190,212,0.72)');
      terminalGradient.addColorStop(1, lm ? 'rgba(255,255,255,0.98)' : 'rgba(165,235,250,1)');
      tracesCtx.beginPath();
      tracesCtx.moveTo(beforeLast.x, beforeLast.y);
      tracesCtx.lineTo(last.x, last.y);
      tracesCtx.strokeStyle = terminalGradient;
      tracesCtx.lineWidth = lm ? 1.9 : 2.1;
      tracesCtx.shadowColor = lm ? 'rgba(255,255,255,0.50)' : 'rgba(86,210,236,0.42)';
      tracesCtx.shadowBlur = 3.5;
      tracesCtx.stroke();

      // A quiet endpoint halo keeps the gradient visibly present between
      // animated pulses and gives the alternating pulse a smooth handoff.
      const endpointHalo = tracesCtx.createRadialGradient(last.x, last.y, 0, last.x, last.y, 9);
      endpointHalo.addColorStop(0, lm ? 'rgba(225,245,250,0.32)' : 'rgba(86,190,216,0.20)');
      endpointHalo.addColorStop(1, 'rgba(0,0,0,0)');
      tracesCtx.fillStyle = endpointHalo;
      tracesCtx.fillRect(last.x - 9, last.y - 9, 18, 18);
    });

    tracesCtx.restore();
  }

  // Ultra-Fast Optimized Batched Laser Pulse Renderer
  function drawPulses(lm) {
    if (reducedMotion) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'miter';

    activePulses.forEach((pulse) => {
      const trace = pulse.trace;
      const headDist = pulse.dist;
      const trailLength = pulse.trailLength;
      const hex = lm ? pulse.color.lightHex : pulse.color.hex;

      const steps = 18;
      const trailPoints = [];

      for (let s = 0; s <= steps; s++) {
        const ratio = s / steps;
        // Keep the illuminated trail behind the head for both flow directions.
        const d = pulse.direction > 0
          ? headDist - (ratio * trailLength)
          : headDist + (ratio * trailLength);
        const pt = getPointAlongTrace(trace, d);
        if (pt.valid) {
          trailPoints.push({ pt, ratio });
        }
      }

      if (trailPoints.length < 2) return;

      // Pass 1: Outer Neon Glow Stroke (Batched Path)
      const surgeWidthBoost = surgeIntensity * 1.5;
      const surgeBlurBoost = surgeIntensity * 10;

      ctx.beginPath();
      ctx.moveTo(trailPoints[0].pt.x, trailPoints[0].pt.y);
      for (let i = 1; i < trailPoints.length; i++) {
        ctx.lineTo(trailPoints[i].pt.x, trailPoints[i].pt.y);
      }
      ctx.strokeStyle = hex;
      ctx.lineWidth = 2.4 + surgeWidthBoost;
      ctx.shadowColor = hex;
      ctx.shadowBlur = 8 + surgeBlurBoost;
      ctx.stroke();

      // Pass 2: Intense Pure White Core (Head Half)
      const halfLen = Math.floor(trailPoints.length * 0.55);
      if (halfLen >= 2) {
        ctx.beginPath();
        ctx.moveTo(trailPoints[0].pt.x, trailPoints[0].pt.y);
        for (let i = 1; i < halfLen; i++) {
          ctx.lineTo(trailPoints[i].pt.x, trailPoints[i].pt.y);
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }

      // Head Photon Glow Flare
      const head = trailPoints[0].pt;

      const halo = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 10);
      halo.addColorStop(0, `rgba(255, 255, 255, ${lm ? 0.95 : 1.0})`);
      halo.addColorStop(0.35, `hsla(${pulse.color.hue}, 100%, ${lm ? 48 : 65}%, ${lm ? 0.50 : 0.70})`);
      halo.addColorStop(0.70, `hsla(${pulse.color.hue}, 100%, 55%, ${lm ? 0.08 : 0.12})`);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.shadowBlur = 0;
      ctx.fillRect(head.x - 10, head.y - 10, 20, 20);
    });

    ctx.restore();
  }

  function renderFrame(timestamp) {
    const now = typeof timestamp === 'number' && timestamp > 0 ? timestamp : performance.now();
    const rawDelta = lastFrameTime ? (now - lastFrameTime) : (1000 / 60);

    if (document.visibilityState !== 'visible' || rawDelta < 33) return;

    const deltaMs = Math.min(Math.max(rawDelta, 0), 33.33);
    const frameScale = deltaMs / (1000 / 60);
    lastFrameTime = now;

    ctx.clearRect(0, 0, width, height);
    const currentTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

    if (!staticLayersValid || cachedTheme !== currentTheme) {
      cachedTheme = currentTheme;
      const lm = currentTheme === 'light';
      renderCachedBackground(lm);
      renderCachedTraces(lm);
      staticLayersValid = true;
    }

    const lm = currentTheme === 'light';

    ctx.drawImage(bgOffscreen, 0, 0, width, height);
    ctx.drawImage(tracesOffscreen, 0, 0, width, height);

    updatePulses(deltaMs);
    updateRipples(deltaMs, frameScale);
    drawTerminalGlows(lm, frameScale);
    drawPulses(lm);
    drawRipples(lm);
  }

  function frame(timestamp) {
    renderFrame(timestamp);
    requestAnimationFrame(frame);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('click', (e) => {
    if (document.visibilityState !== 'visible') return;
    const target = e.target;
    const isInteractive = target.closest(
      'a, button, input, select, textarea, [role="button"], .btn, .btn-a, .card, .bdg, .nav-logo, .ham, .skill-card, .cert-card, .proj-card, .exp-card, #themeToggle'
    );
    if (isInteractive) {
      triggerPowerSurge();
    } else {
      spawnQuantumWave(e.clientX, e.clientY);
    }
  });

  resize();
  requestAnimationFrame(frame);
})();
