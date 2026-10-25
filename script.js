// Menu mobile
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? '×' : '☰';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰';
  });
});

// Entrada suave dos elementos conforme a rolagem
const revealItems = document.querySelectorAll(
  '.intro-grid, .feature, .section-heading, .character-card, .quote-content, .tea-illustration, .tea-copy, .closing'
);
revealItems.forEach(item => item.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Pequena pausa guiada: não é necessário seguir um ritmo exato.
const breathButton = document.querySelector('#breathButton');
const breathCircle = document.querySelector('.breath-circle');
const breathText = document.querySelector('#breathText');
const breathTitle = document.querySelector('#breathTitle');
const breathHint = document.querySelector('#breathHint');
let breathing = false;
let breathTimer = null;
let phase = 0;
const phases = [
  { word: 'Inspire', title: 'Puxe o ar suavemente', hint: 'Inspire pelo tempo que for confortável.', scale: true },
  { word: 'Expire', title: 'Solte o ar devagar', hint: 'Expire sem forçar. Encontre seu próprio ritmo.', scale: false }
];

function showBreathPhase() {
  const current = phases[phase];
  breathText.textContent = current.word;
  breathTitle.textContent = current.title;
  breathHint.textContent = current.hint;
  breathCircle.classList.toggle('active', current.scale);
  phase = (phase + 1) % phases.length;
}

breathButton.addEventListener('click', () => {
  if (breathing) {
    breathing = false;
    clearInterval(breathTimer);
    breathCircle.classList.remove('active');
    breathText.textContent = 'Pronto?';
    breathTitle.textContent = 'Respiração tranquila';
    breathHint.textContent = 'Inspire e expire sem pressa.';
    breathButton.innerHTML = 'Começar pausa <span>→</span>';
    return;
  }
  breathing = true;
  phase = 0;
  showBreathPhase();
  breathButton.textContent = 'Encerrar pausa';
  breathTimer = setInterval(showBreathPhase, 4000);
});

// Um detalhe visual discreto: pétalas acompanham um pouco o movimento do cursor.
const hero = document.querySelector('.hero');
hero.addEventListener('pointermove', event => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bounds = hero.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  document.querySelectorAll('.petal').forEach((petal, index) => {
    const strength = (index + 1) * 3;
    petal.style.marginLeft = `${x * strength}px`;
    petal.style.marginTop = `${y * strength}px`;
  });
});
