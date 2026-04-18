import { animateCounter, onScrollIntoView } from './utils.js';

export function initHero() {
  // Animated counters
  const counters = document.querySelectorAll('.hero-counter .number');
  counters.forEach(el => {
    const target = parseFloat(el.dataset.target);
    const isDecimal = el.dataset.decimal === 'true';
    animateCounter(el, target, 2200, isDecimal);
  });

  // Fade in counters
  setTimeout(() => {
    document.querySelectorAll('.hero-counter.fade-in-up').forEach(el => {
      el.classList.add('visible');
    });
  }, 300);

  // Floating particles
  createParticles();

  // Parallax scroll fade
  window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    const scrolled = window.scrollY;
    const height = hero.offsetHeight;
    if (scrolled < height) {
      hero.querySelector('.hero-content').style.opacity = 1 - (scrolled / height) * 0.8;
      hero.querySelector('.hero-content').style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });
}

function createParticles() {
  const container = document.getElementById('hero-particles');
  const count = 40;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const isOrange = Math.random() > 0.6;

    Object.assign(particle.style, {
      position: 'absolute',
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: isOrange ? 'rgba(255,89,16,0.4)' : 'rgba(0,83,160,0.4)',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animation: `particleFloat ${8 + Math.random() * 12}s ${Math.random() * 5}s infinite ease-in-out`,
    });

    container.appendChild(particle);
  }

  // Add keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
      25% { transform: translate(${rand()}px, ${rand()}px) scale(1.2); opacity: 0.7; }
      50% { transform: translate(${rand()}px, ${rand()}px) scale(0.8); opacity: 0.3; }
      75% { transform: translate(${rand()}px, ${rand()}px) scale(1.1); opacity: 0.6; }
    }
  `;
  document.head.appendChild(style);
}

function rand() {
  return Math.round((Math.random() - 0.5) * 100);
}
