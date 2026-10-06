---
trigger: always_on
---

Portfolio for Rajlaxmi Mishra (B.Tech CSE '28, seeking internships).
Stack: plain HTML, Bootstrap 5.3 (pinned, from jsDelivr), vanilla JS modules.
No frameworks, TypeScript, Tailwind, or build step.

Style: bold, playful, editorial. Light only. No gradients, blur, glow,
glassmorphism, or soft shadows.
Colors as CSS variables: paper #F3EEE3, paper-2 #E9E2D3, ink #121212,
tomato #FF4A1C, butter #FFD23F.
2px ink borders, hard offset shadows (6px 6px 0 ink), radius 0 or pill,
max 3 slightly rotated stickers visible at once.
Fonts: Bricolage Grotesque (display), Instrument Sans (body),
JetBrains Mono (12px uppercase labels). Big clamp() type, tight leading.

Bootstrap: grid and utilities only, plus Offcanvas. Never .btn, .card,
.navbar styles or its default colors. Our CSS loads after it.

Never: emoji icons, buzzword copy ("passionate", "crafting experiences"),
invented stats or testimonials, identical 3-card grids, Inter/Roboto,
animating everything. Unknown content goes in <!-- TODO --> comments.
Never include a phone number or date of birth.

Motion: CSS + IntersectionObserver + rAF only. Animate transform, opacity,
clip-path only. Honor prefers-reduced-motion. Cursor effects only on
fine pointers. Mobile first (375px).

Code: files are index.html, css/ (tokens, base, layout, components,
sections), js/ (main.js entry plus one module per feature). Semantic HTML,
one h1, visible focus states, no inline styles or handlers, BEM class names.