/* ============================================================
   REVEAL.JS — scroll-reveal (IntersectionObserver) +
               scroll-progress bar (rAF-throttled)
   ============================================================ */

'use strict';

// ── Scroll-reveal ─────────────────────────────────────────────
export function initReveal() {
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  if (reducedMotion) {
    // Immediately mark everything visible; CSS already handles it,
    // but add the class so any JS that checks .is-in still works.
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        // Fire once only
        observer.unobserve(entry.target);
      });
    },
    {
      // Trigger when 15% of the element is visible
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  targets.forEach(el => observer.observe(el));
}

// ── Scroll-progress bar ───────────────────────────────────────
export function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  // Under reduced-motion the bar is shown at full width via CSS;
  // no JS needed.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let rafId = null;
  let lastRatio = -1; // sentinel so we skip identical frames

  function update() {
    rafId = null;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    // Guard against zero-height pages
    const ratio = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

    // Only repaint when the value actually changed (avoids redundant style writes)
    if (Math.abs(ratio - lastRatio) > 0.0005) {
      bar.style.transform = `scaleX(${ratio})`;
      lastRatio = ratio;
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    },
    { passive: true }
  );

  // Paint initial state (page may already be scrolled on load)
  update();
}
