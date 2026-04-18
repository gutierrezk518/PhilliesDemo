import { initHero } from './hero.js';
import { initLeaderboard } from './leaderboard.js';
import { initDiamond } from './diamond.js';
import { initCards } from './cards.js';
import { initComparison } from './comparison.js';
import { initTimeline } from './timeline.js';
import { initTable } from './table.js';
import { initRushmore } from './rushmore.js';
import { onScrollIntoView } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all sections
  initHero();
  initLeaderboard();
  initDiamond();
  initCards();
  initComparison();
  initTimeline();
  initTable();
  initRushmore();

  // Scroll animations for fade-in-up elements
  onScrollIntoView('.fade-in-up', (el) => {
    el.classList.add('visible');
  });

  // Immediately reveal any fade-in-up elements already in viewport (e.g. hash navigation)
  document.querySelectorAll('.fade-in-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });

  // Also reveal on hash change
  window.addEventListener('hashchange', () => {
    setTimeout(() => {
      document.querySelectorAll('.fade-in-up:not(.visible)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        }
      });
    }, 100);
  });

  // Active nav link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.id;
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Nav background on scroll
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 50 ?
      'rgba(0, 20, 40, 0.95)' : 'rgba(0, 20, 40, 0.85)';
  }, { passive: true });
});
