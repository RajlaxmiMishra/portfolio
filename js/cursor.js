const INTERACTIVE_SELECTOR = 'a, button, [data-cursor]';

export function initCursor() {
  if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursor = document.createElement('span');
  cursor.className = 'pointer-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let hasPosition = false;
  let isInteractive = false;
  let frameId = null;

  function render() {
    currentX += (targetX - currentX) * 0.2;
    currentY += (targetY - currentY) * 0.2;

    const distance = Math.hypot(targetX - currentX, targetY - currentY);
    if (distance < 0.5) {
      currentX = targetX;
      currentY = targetY;
    }

    const scale = isInteractive ? 4 : 1;
    cursor.style.transform =
      `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale})`;

    if (currentX !== targetX || currentY !== targetY) {
      frameId = window.requestAnimationFrame(render);
    } else {
      frameId = null;
    }
  }

  function requestRender() {
    if (frameId === null && hasPosition) {
      frameId = window.requestAnimationFrame(render);
    }
  }

  window.addEventListener('pointermove', event => {
    targetX = event.clientX;
    targetY = event.clientY;

    if (!hasPosition) {
      currentX = targetX;
      currentY = targetY;
      hasPosition = true;
      cursor.classList.add('pointer-cursor--visible');
      cursor.style.transform =
        `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${isInteractive ? 4 : 1})`;
      return;
    }

    requestRender();
  });

  window.addEventListener('pointerover', event => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest(INTERACTIVE_SELECTOR)) return;

    isInteractive = true;
    cursor.dataset.interactive = 'true';
    requestRender();
  });

  window.addEventListener('pointerout', event => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest(INTERACTIVE_SELECTOR)) return;
    if (event.relatedTarget instanceof Element &&
        event.relatedTarget.closest(INTERACTIVE_SELECTOR)) return;

    isInteractive = false;
    delete cursor.dataset.interactive;
    requestRender();
  });
}
