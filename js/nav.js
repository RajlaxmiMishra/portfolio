export function initNav() {
  const desktopNav = document.querySelector('.site-nav__links');
  const desktopLinks = desktopNav?.querySelectorAll('a[href^="#"]');
  if (!desktopNav || !desktopLinks?.length) return;

  const highlight = desktopNav.querySelector('.site-nav__highlight');
  const allNavLinks = document.querySelectorAll(
    '.site-nav__links a[href^="#"], .offcanvas__link[href^="#"]'
  );
  const sectionLinks = Array.from(desktopLinks)
    .map(link => ({
      link,
      section: document.getElementById(link.getAttribute('href').slice(1))
    }))
    .filter(item => item.section);

  function setActiveSection(sectionId) {
    allNavLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${sectionId}`;
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    const activeLink = sectionLinks.find(
      item => item.section.id === sectionId
    )?.link;
    if (!highlight || !activeLink) return;

    highlight.style.width = `${activeLink.offsetWidth}px`;
    highlight.style.transform = `translate(${activeLink.offsetLeft}px, -50%)`;
  }

  if ('IntersectionObserver' in window && sectionLinks.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sectionLinks.forEach(({ section }) => observer.observe(section));
  }

  if (highlight) {
    const updateHighlight = () => {
      const activeLink = desktopNav.querySelector(
        'a[aria-current="location"]'
      );
      if (activeLink) {
        highlight.style.width = `${activeLink.offsetWidth}px`;
        highlight.style.transform = `translate(${activeLink.offsetLeft}px, -50%)`;
      }
    };

    window.addEventListener('load', updateHighlight);
    window.addEventListener('resize', updateHighlight);
  }

  const offcanvasEl = document.getElementById('mobileMenu');
  offcanvasEl?.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('.offcanvas__link[href^="#"]')) return;

    window.bootstrap?.Offcanvas?.getOrCreateInstance(offcanvasEl).hide();
  });
}
