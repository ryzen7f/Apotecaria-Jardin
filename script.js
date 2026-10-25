// Menu responsivo: abre e fecha sem interferir na navegação por teclado.
const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuButton.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  });
});

// Se uma hospedagem externa retirar uma imagem, tenta uma imagem alternativa validada.
document.querySelectorAll('img[data-fallback]').forEach(img => {
  img.addEventListener('error', () => {
    const fallback = img.dataset.fallback;
    if (!fallback || img.dataset.fallbackTried) return;

    const failedSource = new URL(img.currentSrc || img.src, document.baseURI).href;
    const fallbackSource = new URL(fallback, document.baseURI).href;
    const lightboxTrigger = img.closest('.lightbox-trigger');

    // Se a imagem também abre em tela cheia, faça a ampliação usar o fallback.
    if (lightboxTrigger && lightboxTrigger.dataset.full) {
      const fullSource = new URL(lightboxTrigger.dataset.full, document.baseURI).href;
      if (fullSource === failedSource) lightboxTrigger.dataset.full = fallbackSource;
    }

    if (failedSource !== fallbackSource) {
      img.dataset.fallbackTried = 'true';
      img.src = fallbackSource;
    } else {
      img.dataset.fallbackTried = 'true';
    }
  });
});

// Revelação discreta dos blocos durante a rolagem.
const revealTargets = document.querySelectorAll(
  '.intro-layout, .story-image, .mini-note, .theme-list, .section-heading, .character-card, .gallery-item, .gallery-heading, .pause-copy, .pause-image, .final-note'
);
revealTargets.forEach(element => element.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(element => revealObserver.observe(element));
} else {
  revealTargets.forEach(element => element.classList.add('is-visible'));
}

// Galeria com ampliação, legenda e fechamento por Escape ou clique fora.
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
let lastFocusedElement = null;

function openLightbox(trigger) {
  lastFocusedElement = trigger;
  lightboxImage.src = trigger.dataset.full;
  lightboxImage.alt = trigger.querySelector('img')?.alt || '';
  lightboxCaption.textContent = trigger.dataset.caption || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImage.src = '';
  lastFocusedElement?.focus();
}
document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => openLightbox(trigger));
});
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

// Pausa guiada opcional. Ritmo leve, sem exigir contagem ou prender a respiração.
const breathingButton = document.querySelector('#breathing-button');
const breathingOrb = document.querySelector('#breathing-orb');
const breathingWord = document.querySelector('#breathing-word');
const breathingTitle = document.querySelector('#breathing-title');
const breathingDescription = document.querySelector('#breathing-description');
let breathingActive = false;
let breathingInterval = null;
let currentBreathPhase = 0;
const breathingPhases = [
  { word: 'Inspire', title: 'Puxe o ar com suavidade', description: 'Inspire pelo tempo que parecer confortável.', active: true },
  { word: 'Expire', title: 'Solte o ar devagar', description: 'Expire sem forçar; encontre seu próprio ritmo.', active: false }
];
function showBreathingPhase() {
  const phase = breathingPhases[currentBreathPhase];
  breathingWord.textContent = phase.word;
  breathingTitle.textContent = phase.title;
  breathingDescription.textContent = phase.description;
  breathingOrb.classList.toggle('active', phase.active);
  currentBreathPhase = (currentBreathPhase + 1) % breathingPhases.length;
}
breathingButton.addEventListener('click', () => {
  if (breathingActive) {
    breathingActive = false;
    window.clearInterval(breathingInterval);
    breathingOrb.classList.remove('active');
    breathingWord.textContent = 'Pronto?';
    breathingTitle.textContent = 'Uma pausa tranquila';
    breathingDescription.textContent = 'Quando estiver pronto, comece uma pequena pausa guiada.';
    breathingButton.innerHTML = 'Começar pausa <span>→</span>';
    return;
  }
  breathingActive = true;
  currentBreathPhase = 0;
  showBreathingPhase();
  breathingButton.textContent = 'Encerrar pausa';
  breathingInterval = window.setInterval(showBreathingPhase, 4000);
});
