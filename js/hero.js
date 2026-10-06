/* ============================================================
   HERO.JS — variable-font magnetic letter effect
   ============================================================
   Each letter's wght and wdth respond to pointer proximity.
   Closest letters get heavier (800 → 900) and wider (100 → 125),
   falling off to base values beyond MAX_DIST px.
   
   Guards:
   - prefers-reduced-motion: exits immediately, no effect applied
   - touch device (pointer: coarse): exits immediately
   - rAF loop only runs while something is still animating
   ============================================================ */

'use strict';

export function initHeroLetters() {

  // ── Guards ──────────────────────────────────────────────────
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const letters = Array.from(
    document.querySelectorAll('.hero__letter')
  );
  if (!letters.length) return;

  // ── Constants ────────────────────────────────────────────────
  const WGHT_BASE  = 800;   // base font weight
  const WGHT_MAX   = 900;   // weight at pointer = 0 px away
  const WDTH_BASE  = 100;   // base font width (%)
  const WDTH_MAX   = 125;   // width at pointer = 0 px away
  const OPSZ       = 144;   // optical size, stays fixed
  const MAX_DIST   = 220;   // px — falloff radius
  const EASE_BACK  = 0.09;  // lerp factor when pointer is away

  // ── State ────────────────────────────────────────────────────
  /** @type {{ cx: number, cy: number }[]} */
  let rects = [];

  /** Current interpolated values per letter */
  let current = letters.map(() => ({ wght: WGHT_BASE, wdth: WDTH_BASE }));

  /** Target values set each pointermove */
  let target  = letters.map(() => ({ wght: WGHT_BASE, wdth: WDTH_BASE }));

  let pointerX = -9999;
  let pointerY = -9999;
  let pointerInside = false;
  let rafId = null;
  let needsRender = false;

  // ── Cache letter centre positions ───────────────────────────
  function cacheRects() {
    rects = letters.map(el => {
      const r = el.getBoundingClientRect();
      return {
        cx: r.left + r.width  / 2,
        cy: r.top  + r.height / 2,
      };
    });
  }

  // Call once after fonts/layout settle
  // (requestAnimationFrame defers past first paint + animation frame)
  requestAnimationFrame(() => requestAnimationFrame(cacheRects));

  // ── Resize: debounced rect refresh ──────────────────────────
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(cacheRects, 120);
  }, { passive: true });

  // ── Compute targets from pointer position ───────────────────
  function computeTargets() {
    for (let i = 0; i < letters.length; i++) {
      if (!rects[i]) { continue; }
      const dx   = pointerX - rects[i].cx;
      const dy   = pointerY - rects[i].cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Linear falloff clamped 0–1, then ease
      const t    = Math.max(0, 1 - dist / MAX_DIST);
      const ease = t * t * (3 - 2 * t); // smoothstep
      target[i].wght = WGHT_BASE + (WGHT_MAX - WGHT_BASE) * ease;
      target[i].wdth = WDTH_BASE + (WDTH_MAX - WDTH_BASE) * ease;
    }
  }

  // ── rAF loop ─────────────────────────────────────────────────
  function tick() {
    rafId = null;
    let stillMoving = false;

    for (let i = 0; i < letters.length; i++) {
      const tWght = pointerInside ? target[i].wght : WGHT_BASE;
      const tWdth = pointerInside ? target[i].wdth : WDTH_BASE;

      // Lerp toward target
      const prevWght = current[i].wght;
      const prevWdth = current[i].wdth;

      // On pointermove: snap (target already interpolated via smoothstep)
      // On leave: ease back with lerp
      const factor = pointerInside ? 1 : EASE_BACK;
      current[i].wght = prevWght + (tWght - prevWght) * (pointerInside ? 1 : EASE_BACK);
      current[i].wdth = prevWdth + (tWdth - prevWdth) * (pointerInside ? 1 : EASE_BACK);

      // Apply
      letters[i].style.fontVariationSettings =
        `"opsz" ${OPSZ}, "wdth" ${current[i].wdth.toFixed(2)}, "wght" ${current[i].wght.toFixed(2)}`;

      // Check if we still need more frames (values not yet settled)
      if (
        Math.abs(current[i].wght - tWght) > 0.1 ||
        Math.abs(current[i].wdth - tWdth) > 0.1
      ) {
        stillMoving = true;
      }
    }

    if (stillMoving) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function scheduleRaf() {
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  }

  // ── Pointer events ───────────────────────────────────────────
  const heroEl = document.querySelector('.hero');
  if (!heroEl) return;

  heroEl.addEventListener('pointermove', e => {
    // Only fine pointer (mouse / stylus)
    if (e.pointerType === 'touch') return;

    pointerX      = e.clientX;
    pointerY      = e.clientY;
    pointerInside = true;

    computeTargets();
    scheduleRaf();
  }, { passive: true });

  heroEl.addEventListener('pointerleave', e => {
    if (e.pointerType === 'touch') return;
    pointerInside = false;
    scheduleRaf(); // will lerp back to base
  }, { passive: true });
}
