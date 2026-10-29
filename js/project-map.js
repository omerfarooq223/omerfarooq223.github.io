/* Project Map: 4-Pillar Linear Circuit Architecture with interactive project inspection. */
(() => {
  'use strict';

  const canvas = document.getElementById('pmCanvas');
  const toggle = document.getElementById('pmToggle');
  const pane = document.getElementById('pmPane');
  if (!canvas || !toggle || !pane) return;

  const layoutEl = toggle.closest('.skills-cyber-layout');
  const label = document.getElementById('pmToggleLabel');
  const svg = canvas.querySelector('.pm-links');
  const resetBtn = document.getElementById('pmReset');
  const nodes = Array.from(canvas.querySelectorAll('.pm-node'));
  const byId = new Map(nodes.map((n) => [n.dataset.id, n]));
  const canDrag = window.matchMedia('(min-width: 761px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Existing skill categories in their displayed order.
  const PAGES = [['p1', 'p2', 'p3', 'p4'], ['p5', 'p6', 'p7', 'p8']];
  let pageIndex = 0;
  let PILLARS = PAGES[pageIndex];
  const prevBtn = document.getElementById('pmPrev');
  const nextBtn = document.getElementById('pmNext');
  const pageStatus = document.getElementById('pmPageStatus');

  const SEGMENTS = [
    { from: 'p1', to: 'p2' },
    { from: 'p2', to: 'p3' },
    { from: 'p3', to: 'p4' }
  ];

  const pos = new Map();
  let zTop = 10;
  let moved = false;
  let frame = 0;
  let activeId = '';

  // Connect the existing skill categories without inventing project dependencies.
  const segmentEls = SEGMENTS.map((seg) => {
    const basePath = document.createElementNS(SVG_NS, 'path');
    basePath.setAttribute('class', 'pm-link-base');

    const activePath = document.createElementNS(SVG_NS, 'path');
    activePath.setAttribute('class', 'pm-link-active');
    activePath.style.opacity = '0';

    const dotFrom = document.createElementNS(SVG_NS, 'circle');
    dotFrom.setAttribute('class', 'pm-via-dot');
    dotFrom.setAttribute('r', '5');

    const dotTo = document.createElementNS(SVG_NS, 'circle');
    dotTo.setAttribute('class', 'pm-via-dot');
    dotTo.setAttribute('r', '5');

    svg.append(basePath, activePath, dotFrom, dotTo);

    return { ...seg, basePath, activePath, dotFrom, dotTo };
  });

  function applyPos(id) {
    const p = pos.get(id);
    if (!p) return;
    byId.get(id).style.transform = `translate3d(${Math.round(p.x)}px, ${Math.round(p.y)}px, 0)`;
  }

  function layout() {
    const width = canvas.clientWidth;
    if (!width) return;
    const columns = width >= 1080 ? 4 : width >= 640 ? 2 : 1;
    // Phone cards use the board width, with paging controls above the first row.
    const compact = window.matchMedia('(max-width: 640px)').matches;
    const padding = compact ? 16 : columns === 4 ? 48 : 44;
    const minimumGap = columns === 4 ? 48 : 40;
    const availableWidth = (width - padding * 2 - minimumGap * (columns - 1)) / columns;
    const cardWidth = columns === 1 ? availableWidth : Math.min(248, availableWidth);
    const gap = columns === 1 ? 0 : (width - padding * 2 - cardWidth * columns) / (columns - 1);
    canvas.style.setProperty('--pm-card-width', `${cardWidth}px`);

    const topSpace = compact ? 64 : columns === 4 ? 56 : 32;
    const rowGap = compact ? 28 : 64;
    let rowTop = topSpace;
    for (let row = 0; row < Math.ceil(PILLARS.length / columns); row++) {
      let rowBottom = rowTop;
      PILLARS.slice(row * columns, (row + 1) * columns).forEach((id, column) => {
        const y = rowTop + (columns === 4 && column % 2 ? 120 : 0);
        pos.set(id, { x: padding + column * (cardWidth + gap), y });
        applyPos(id);
        rowBottom = Math.max(rowBottom, y + byId.get(id).offsetHeight);
      });
      rowTop = rowBottom + rowGap;
    }
    const contentHeight = rowTop - rowGap + topSpace;
    canvas.style.height = `${columns === 4 ? Math.max(480, contentHeight) : contentHeight}px`;

    draw();
  }

  function rectOf(el, base) {
    const r = el.getBoundingClientRect();
    return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
  }

  // Join side edges in a row, and bottom/top edges when wrapping to the next row.
  function computeSpline(a, b) {
    if (b.y >= a.y + a.h) {
      const p1 = { x: a.x + a.w / 2, y: a.y + a.h };
      const p2 = { x: b.x + b.w / 2, y: b.y };
      const midY = (p1.y + p2.y) / 2;
      return { p1, p2, d: `M ${p1.x} ${p1.y} C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}` };
    }
    const forward = a.x + a.w <= b.x;
    const p1 = {
      x: forward ? a.x + a.w : a.x,
      y: a.y + Math.min(60, a.h / 2)
    };
    const p2 = {
      x: forward ? b.x : b.x + b.w,
      y: b.y + Math.min(60, b.h / 2)
    };

    const dx = Math.max(50, Math.abs(p2.x - p1.x) * 0.45);
    const cp1x = forward ? p1.x + dx : p1.x - dx;
    const cp2x = forward ? p2.x - dx : p2.x + dx;

    const d = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} C ${cp1x.toFixed(1)} ${p1.y.toFixed(1)}, ${cp2x.toFixed(1)} ${p2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;

    return { p1, p2, d };
  }

  function draw() {
    frame = 0;
    if (pane.hidden) return;
    const base = canvas.getBoundingClientRect();
    const rects = new Map(PILLARS.map((id) => [id, rectOf(byId.get(id), base)]));

    segmentEls.forEach((seg) => {
      const rA = rects.get(seg.from);
      const rB = rects.get(seg.to);
      if (!rA || !rB) return;

      const curve = computeSpline(rA, rB);

      seg.basePath.setAttribute('d', curve.d);
      seg.activePath.setAttribute('d', curve.d);

      seg.dotFrom.setAttribute('cx', curve.p1.x);
      seg.dotFrom.setAttribute('cy', curve.p1.y);

      seg.dotTo.setAttribute('cx', curve.p2.x);
      seg.dotTo.setAttribute('cy', curve.p2.y);

    });
  }

  function scheduleDraw() {
    if (!frame) frame = requestAnimationFrame(draw);
  }

  function setFocus(id) {
    if (id === activeId) return;
    activeId = id;
    canvas.classList.toggle('is-focusing', !!id);

    nodes.forEach((n) => {
      n.classList.toggle('is-active', n.dataset.id === id);
    });

    segmentEls.forEach((seg) => {
      const isConnected = !!id && (seg.from === id || seg.to === id);
      seg.activePath.style.opacity = isConnected ? '1' : '0';
      seg.dotFrom.classList.toggle('is-on', isConnected);
      seg.dotTo.classList.toggle('is-on', isConnected);
    });
  }

  function moveTo(id, x, y) {
    const el = byId.get(id);
    pos.set(id, {
      x: Math.max(0, Math.min(canvas.clientWidth - el.offsetWidth, x)),
      y: Math.max(0, Math.min(canvas.clientHeight - el.offsetHeight, y))
    });
    applyPos(id);
    moved = true;
    scheduleDraw();
  }

  // Pointer drag event delegation
  let drag = null;
  canvas.addEventListener('pointerdown', (e) => {
    // Prevent dragging when clicking interactive buttons inside cards
    if (e.target.closest('button, a')) return;
    if (!canDrag.matches || e.button > 0) return;

    const el = e.target.closest('.pm-node');
    if (!el) return;
    const id = el.dataset.id;
    const p = pos.get(id);
    drag = { id, el, dx: e.clientX - p.x, dy: e.clientY - p.y };
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging');
    el.style.zIndex = ++zTop;
    canvas.classList.remove('is-resetting');
    setFocus(id);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (drag) moveTo(drag.id, e.clientX - drag.dx, e.clientY - drag.dy);
  });

  const endDrag = () => {
    if (!drag) return;
    drag.el.classList.remove('is-dragging');
    drag = null;
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  canvas.addEventListener('pointerover', (e) => {
    const el = e.target.closest('.pm-node');
    if (el && !drag) setFocus(el.dataset.id);
  });
  canvas.addEventListener('pointerout', (e) => {
    if (drag) return;
    const el = e.target.closest('.pm-node');
    if (el && !el.contains(e.relatedTarget)) setFocus('');
  });
  canvas.addEventListener('focusin', (e) => {
    const el = e.target.closest('.pm-node');
    if (el) setFocus(el.dataset.id);
  });
  canvas.addEventListener('focusout', () => setFocus(''));

  // Keyboard navigation
  canvas.addEventListener('keydown', (e) => {
    const el = e.target.closest('.pm-node');
    if (!el) return;
    const step = e.shiftKey ? 40 : 12;
    const dir = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!dir || e.target.closest('button, a')) return;
    e.preventDefault();
    const p = pos.get(el.dataset.id);
    moveTo(el.dataset.id, p.x + dir[0], p.y + dir[1]);
  });

  // Animated reset
  function reset() {
    moved = false;
    if (!reduceMotion.matches) {
      canvas.classList.add('is-resetting');
      const t0 = performance.now();
      const tick = (t) => {
        draw();
        if (t - t0 < 700) requestAnimationFrame(tick);
        else canvas.classList.remove('is-resetting');
      };
      requestAnimationFrame(tick);
    }
    layout();
  }

  if (resetBtn) resetBtn.addEventListener('click', reset);

  let changingPage = false;
  async function changePage(nextIndex) {
    if (changingPage || nextIndex < 0 || nextIndex >= PAGES.length || nextIndex === pageIndex) return;
    changingPage = true;
    const direction = nextIndex > pageIndex ? 1 : -1;
    const scroll = document.getElementById('pmScroll');
    let animation;
    async function slide(from, to, duration) {
      if (reduceMotion.matches || !canvas.animate || pane.hidden) return;
      animation = canvas.animate(
        [{ transform: `translateX(${from}%)` }, { transform: `translateX(${to}%)` }],
        { duration, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }
      );
      await animation.finished;
      animation.cancel();
      animation = null;
    }
    try {
      endDrag();
      setFocus('');
      canvas.classList.remove('is-resetting');
      canvas.inert = true;
      prevBtn.setAttribute('aria-disabled', 'true');
      nextBtn.setAttribute('aria-disabled', 'true');
      // Preserve the stage height between sets so the arrows stay in place.
      scroll.style.minHeight = `${scroll.clientHeight}px`;
      await slide(0, -100 * direction, 140);
      pageIndex = nextIndex;
      PILLARS = PAGES[pageIndex];
      nodes.forEach((node) => { node.hidden = !PILLARS.includes(node.dataset.id); });
      segmentEls.forEach((segment, index) => {
        segment.from = PILLARS[index];
        segment.to = PILLARS[index + 1];
      });
      pageStatus.textContent = pageIndex === 0 ? '01–04 / 08' : '05–08 / 08';
      moved = false;
      layout();
      await slide(100 * direction, 0, 220);
    } catch (error) {
      // A cancelled transition still leaves the selected set usable.
      if (animation) animation.cancel();
    } finally {
      canvas.inert = false;
      changingPage = false;
      prevBtn.setAttribute('aria-disabled', String(pageIndex === 0));
      nextBtn.setAttribute('aria-disabled', String(pageIndex === PAGES.length - 1));
      scheduleDraw();
    }
  }
  if (prevBtn && nextBtn && pageStatus) {
    prevBtn.disabled = false;
    prevBtn.setAttribute('aria-disabled', 'true');
    nextBtn.setAttribute('aria-disabled', 'false');
    prevBtn.addEventListener('click', () => changePage(pageIndex - 1));
    nextBtn.addEventListener('click', () => changePage(pageIndex + 1));
  }


  // Toggle Map / List view
  function setMapOpen(open) {
    layoutEl.classList.toggle('is-map', open);
    pane.hidden = !open;
    toggle.setAttribute('aria-pressed', String(open));
    label.textContent = open ? 'List view' : 'Map view';
    if (open) {
      if (!moved) layout(); else draw();
    } else {
      setFocus('');
    }
  }

  toggle.addEventListener('click', () => setMapOpen(pane.hidden));

  // Refit the complete board on resize; dragged positions only persist at the same width.
  let boardWidth = 0;
  const observer = new ResizeObserver(() => {
    const width = canvas.clientWidth;
    if (pane.hidden || !width || width === boardWidth) return;
    boardWidth = width;
    document.getElementById('pmScroll').style.minHeight = '';
    endDrag();
    moved = false;
    canvas.classList.remove('is-resetting');
    layout();
  });
  observer.observe(canvas);

  // Fonts ready callback
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { if (!pane.hidden) { moved = false; layout(); } });
  }
})();
