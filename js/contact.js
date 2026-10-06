const EMAIL = 'mishra.rajlaxmi27@gmail.com';

export function initContact() {
  const emailLink = document.querySelector('.contact-cta[href^="mailto:"]');
  const toast = document.querySelector('.contact-toast[role="status"]');
  const clock = document.querySelector('[data-contact-clock]');
  let toastTimer;
  let hideTimer;

  emailLink?.addEventListener('click', async event => {
    event.preventDefault();

    let copied = false;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API is unavailable');
      await navigator.clipboard.writeText(EMAIL);
      copied = true;
    } catch {
      copied = false;
    }

    if (!copied) {
      window.location.href = emailLink.href;
      return;
    }
    if (!toast) return;

    window.clearTimeout(toastTimer);
    window.clearTimeout(hideTimer);
    toast.hidden = false;
    window.requestAnimationFrame(() => toast.classList.add('is-visible'));
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
      hideTimer = window.setTimeout(() => {
        toast.hidden = true;
      }, 200);
    }, 1800);
  });

  if (clock) {
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const updateClock = () => {
      clock.textContent = formatter.format(new Date());
    };

    updateClock();
    window.setInterval(updateClock, 1000);
  }
}
