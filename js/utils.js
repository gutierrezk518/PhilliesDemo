import { getHeadshotUrl } from './data.js';

// Animate a number counting up
export function animateCounter(el, target, duration = 2000, isDecimal = false) {
  const start = performance.now();
  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = eased * target;
    el.textContent = isDecimal ? value.toFixed(1) : Math.round(value).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Intersection Observer for scroll animations
export function onScrollIntoView(selector, callback, options = {}) {
  const els = document.querySelectorAll(selector);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        if (!options.repeat) observer.unobserve(entry.target);
      }
    });
  }, { threshold: options.threshold || 0.1 });
  els.forEach(el => observer.observe(el));
  return observer;
}

// Create player image element with fallback
export function createPlayerImg(player, size = 80) {
  const img = document.createElement('img');
  img.src = getHeadshotUrl(player.mlbId);
  img.alt = player.player;
  img.width = size;
  img.height = size;
  img.style.borderRadius = '50%';
  img.style.objectFit = 'cover';
  img.loading = 'lazy';
  img.onerror = () => {
    img.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 80 80"><rect fill="%23002D72" width="80" height="80" rx="40"/><text x="40" y="52" text-anchor="middle" fill="white" font-size="28" font-family="sans-serif">${player.player.split(' ').map(n=>n[0]).join('')}</text></svg>`)}`;
  };
  return img;
}

// Parse "Years as Phillie" string into array of [start, end] ranges
export function parseYears(yearsStr) {
  const ranges = [];
  const parts = yearsStr.replace('present', '2025').split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    const match = trimmed.match(/(\d{4})-(\d{2,4})/);
    if (match) {
      const start = parseInt(match[1]);
      let end = parseInt(match[2]);
      if (end < 100) end += Math.floor(start / 100) * 100;
      ranges.push([start, end]);
    } else {
      const single = trimmed.match(/(\d{4})/);
      if (single) ranges.push([parseInt(single[1]), parseInt(single[1])]);
    }
  }
  return ranges;
}

// Get first and last year
export function getYearSpan(yearsStr) {
  const ranges = parseYears(yearsStr);
  if (!ranges.length) return [1883, 1883];
  return [ranges[0][0], ranges[ranges.length - 1][1]];
}

// Normalize stats for radar charts (0-100 scale)
export function normalizeStats(players, keys, invertKeys = []) {
  const mins = {}, maxes = {};
  keys.forEach(k => { mins[k] = Infinity; maxes[k] = -Infinity; });
  players.forEach(p => {
    keys.forEach(k => {
      if (p[k] !== undefined) {
        mins[k] = Math.min(mins[k], p[k]);
        maxes[k] = Math.max(maxes[k], p[k]);
      }
    });
  });
  return (player) => keys.map(k => {
    if (player[k] === undefined) return 50;
    const range = maxes[k] - mins[k] || 1;
    let val = ((player[k] - mins[k]) / range) * 100;
    if (invertKeys.includes(k)) val = 100 - val;
    return Math.round(val);
  });
}

// Format stat for display
export function formatStat(key, value) {
  if (['avg', 'obp', 'slg', 'era', 'whip'].includes(key)) return value.toFixed(3).replace(/^0/, '');
  if (key === 'ip') return String(value);
  return String(value);
}
