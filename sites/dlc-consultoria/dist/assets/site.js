export function setMenuOpen(open) {
  const toggle = document.querySelector('.js-menu-toggle');
  const menu = document.querySelector('.js-mobile-menu');
  if (!toggle || !menu) return;

  const nextState = Boolean(open);
  toggle.setAttribute('aria-expanded', String(nextState));
  menu.dataset.open = String(nextState);

  const label = toggle.querySelector('.sr-only');
  if (label) label.textContent = nextState ? 'Fechar menu' : 'Abrir menu';
}

function initMenu() {
  const toggle = document.querySelector('.js-menu-toggle');
  const menu = document.querySelector('.js-mobile-menu');
  if (!toggle || !menu) return;

  setMenuOpen(false);

  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (
      toggle.getAttribute('aria-expanded') === 'true'
      && !menu.contains(event.target)
      && !toggle.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('menu-ready');
}

export function getRevealDelay(index) {
  return (Math.max(0, index) % 4) * 55;
}

function initReveals() {
  const elements = [...document.querySelectorAll('.js-reveal')];
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  document.documentElement.classList.add('reveal-ready');
  elements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${getRevealDelay(index)}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  elements.forEach((element) => observer.observe(element));
}

function initYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('.js-year').forEach((element) => {
    element.textContent = year;
  });
}

export function initSite() {
  initMenu();
  initReveals();
  initYear();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite, { once: true });
  } else {
    initSite();
  }
}
