import { allPlayers, positionPlayers, pitchers, getHeadshotUrl } from './data.js';
import { createPlayerImg, normalizeStats, formatStat } from './utils.js';

const positionStatKeys = ['avg', 'obp', 'slg', 'hr', 'sb'];
const positionStatLabels = ['AVG', 'OBP', 'SLG', 'HR', 'Speed'];
const pitcherStatKeys = ['era', 'so', 'ip', 'whip', 'w'];
const pitcherStatLabels = ['ERA', 'K', 'IP', 'WHIP', 'Wins'];

const normPosition = normalizeStats(positionPlayers, positionStatKeys);
const normPitcher = normalizeStats(pitchers, pitcherStatKeys, ['era', 'whip']);

let activeFilter = 'all';
let searchQuery = '';

const TIERS = [
  { label: 'The Immortals',         subtitle: 'Franchise cornerstones whose names echo forever at Citizens Bank Park' },
  { label: 'The Legends',           subtitle: 'Elite careers that shaped generations of Phillies baseball' },
  { label: 'The Greats',            subtitle: 'Stars whose play earned a permanent place in team history' },
  { label: 'The All-Stars',         subtitle: 'Players who consistently rose to the moment in red pinstripes' },
  { label: 'The Stalwarts',         subtitle: 'Dependable talents who built the backbone of the franchise' },
  { label: 'Honorable Mentions',    subtitle: 'Notable contributors to the Phillies legacy' },
];

function cardHTML(p, i) {
  const isPitcher = p.type === 'pitcher' || p.era !== undefined;
  const overallRank = allPlayers.findIndex(ap => ap.player === p.player) + 1;
  const initialsSVG = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect fill='%23002D72' width='100' height='100' rx='50'/><text x='50' y='60' text-anchor='middle' fill='white' font-size='32' font-family='sans-serif'>${p.player.split(' ').map(n=>n[0]).join('')}</text></svg>`;
  const imgSrc = p.mlbId ? getHeadshotUrl(p.mlbId) : `data:image/svg+xml,${encodeURIComponent(initialsSVG)}`;
  return `
    <div class="card-wrapper fade-in-up">
      <div class="card" data-index="${i}" data-player="${p.player}">
        <div class="card-face card-front">
          <div class="rank-badge ${overallRank <= 5 ? 'top5' : ''}">${overallRank}</div>
          <div class="type-badge ${isPitcher ? 'pitcher' : 'position'}">${isPitcher ? 'P' : 'POS'}</div>
          <img class="player-img" src="${imgSrc}" alt="${p.player}" onerror="this.src='data:image/svg+xml,${encodeURIComponent(initialsSVG)}'">
          <h3>${p.player}</h3>
          <div class="position-text">${p.position || 'Pitcher'}</div>
          <div class="years-text">${p.years}</div>
          <div class="war-display">${p.war}</div>
          <div class="war-label">WAR</div>
        </div>
        <div class="card-face card-back">
          <h3>${p.player}</h3>
          <div class="radar-container">
            <canvas class="radar-canvas" width="160" height="110"></canvas>
          </div>
          <div class="stats-grid">
            ${isPitcher ? `
              <div class="stat-item"><div class="stat-val">${p.era}</div><div class="stat-key">ERA</div></div>
              <div class="stat-item"><div class="stat-val">${p.w}-${p.l}</div><div class="stat-key">W-L</div></div>
              <div class="stat-item"><div class="stat-val">${p.so}</div><div class="stat-key">K</div></div>
              <div class="stat-item"><div class="stat-val">${p.whip}</div><div class="stat-key">WHIP</div></div>
              <div class="stat-item"><div class="stat-val">${p.ip}</div><div class="stat-key">IP</div></div>
              <div class="stat-item"><div class="stat-val">${p.allStar}x</div><div class="stat-key">All-Star</div></div>
            ` : `
              <div class="stat-item"><div class="stat-val">${p.avg.toFixed(3).replace(/^0/,'')}</div><div class="stat-key">AVG</div></div>
              <div class="stat-item"><div class="stat-val">${p.hr}</div><div class="stat-key">HR</div></div>
              <div class="stat-item"><div class="stat-val">${p.rbi}</div><div class="stat-key">RBI</div></div>
              <div class="stat-item"><div class="stat-val">${p.obp.toFixed(3).replace(/^0/,'')}</div><div class="stat-key">OBP</div></div>
              <div class="stat-item"><div class="stat-val">${p.sb}</div><div class="stat-key">SB</div></div>
              <div class="stat-item"><div class="stat-val">${p.allStar}x</div><div class="stat-key">All-Star</div></div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initCards() {
  render();

  document.getElementById('cards-filters').addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    document.querySelectorAll('#cards-filters .filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    activeFilter = e.target.dataset.filter;
    render();
  });

  document.getElementById('cards-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    render();
  });
}

function getFilteredPlayers() {
  let players = allPlayers;
  if (activeFilter === 'pitcher') {
    players = pitchers.map(p => ({ ...p, type: 'pitcher' }));
  } else if (activeFilter === 'position') {
    players = positionPlayers.map(p => ({ ...p, type: 'position' }));
  }
  if (searchQuery) {
    players = players.filter(p => p.player.toLowerCase().includes(searchQuery));
  }
  return players.sort((a, b) => b.war - a.war);
}

function render() {
  const grid = document.getElementById('cards-grid');
  const players = getFilteredPlayers();
  const isSearching = searchQuery.length > 0;

  if (isSearching || players.length === 0) {
    // Flat grid while searching (tiers don't help) or when empty
    grid.innerHTML = players.length === 0
      ? `<div class="cards-empty">No players match "<strong>${searchQuery}</strong>"</div>`
      : `<div class="tier-grid">${players.map((p, i) => cardHTML(p, i)).join('')}</div>`;
  } else {
    const chunks = [];
    for (let i = 0; i < 50 && i < players.length; i += 10) {
      chunks.push(players.slice(i, i + 10));
    }
    if (players.length > 50) chunks.push(players.slice(50));
    grid.innerHTML = chunks.map((group, tierIdx) => {
      const start = tierIdx * 10 + 1;
      const end = start + group.length - 1;
      const isOverflow = tierIdx >= 5;
      const rankLabel = isOverflow
        ? `${start}–${end}`
        : `${String(start).padStart(2, '0')}–${String(end).padStart(2, '0')}`;
      const tier = TIERS[Math.min(tierIdx, TIERS.length - 1)];
      const topWar = group[0]?.war;
      const lowWar = group[group.length - 1]?.war;
      const warRange = topWar === lowWar ? `${topWar} WAR` : `${lowWar} – ${topWar} WAR`;
      return `
        <section class="tier" data-tier="${tierIdx}">
          <header class="tier-header">
            <div class="tier-rank">${rankLabel}</div>
            <div class="tier-heading">
              <h3 class="tier-title">${tier.label}</h3>
              <p class="tier-subtitle">${tier.subtitle}</p>
            </div>
            <div class="tier-meta">${warRange}</div>
          </header>
          <div class="tier-grid">
            ${group.map((p, i) => cardHTML(p, tierIdx * 10 + i)).join('')}
          </div>
        </section>
      `;
    }).join('');
  }

  // Stagger animation
  setTimeout(() => {
    grid.querySelectorAll('.fade-in-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 30);
    });
  }, 50);

  // Flip handler
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const wasFlipped = card.classList.contains('flipped');
      card.classList.toggle('flipped');

      // Lazy init radar chart
      if (!wasFlipped && !card.dataset.chartInit) {
        card.dataset.chartInit = 'true';
        const canvas = card.querySelector('.radar-canvas');
        const playerName = card.dataset.player;
        const player = allPlayers.find(p => p.player === playerName) ||
                       pitchers.find(p => p.player === playerName);
        if (player && canvas) {
          createRadarChart(canvas, player);
        }
      }
    });
  });
}

function createRadarChart(canvas, player) {
  const isPitcher = player.era !== undefined && player.type !== 'position';
  const labels = isPitcher ? pitcherStatLabels : positionStatLabels;
  const normalizer = isPitcher ? normPitcher : normPosition;
  const values = normalizer(player);

  new Chart(canvas, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: 'rgba(232,24,40,0.2)',
        borderColor: '#E81828',
        borderWidth: 2,
        pointBackgroundColor: '#E81828',
        pointRadius: 3,
      }]
    },
    options: {
      responsive: false,
      animation: { duration: 600 },
      layout: { padding: { top: 10, bottom: 6, left: 14, right: 14 } },
      plugins: { legend: { display: false } },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { display: false, stepSize: 25 },
          grid: { color: 'rgba(0,45,114,0.15)' },
          pointLabels: {
            font: { size: 9, weight: '600' },
            color: '#002D72',
            padding: 4
          }
        }
      }
    }
  });
}
