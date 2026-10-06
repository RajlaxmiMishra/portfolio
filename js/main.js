/* ============================================================
   MAIN.JS — lightweight progressive enhancements
   ============================================================ */

import { initHeroLetters } from './hero.js';
import { initNav } from './nav.js';
import { initCursor } from './cursor.js';
import { initContact } from './contact.js';
import { initReveal, initScrollProgress } from './reveal.js';

// ── Hero variable-font letter effect ─────────────────────────
initNav();
initCursor();
initHeroLetters();
initContact();

// ── Scroll-reveal + progress bar ─────────────────────────────
initReveal();
initScrollProgress();
