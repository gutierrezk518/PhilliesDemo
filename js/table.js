import { positionPlayers, pitchers, getHeadshotUrl } from './data.js';

let currentFilter = 'position';
let sortKey = 'war';
let sortDir = 'desc';
let searchQuery = '';

const positionCols = [
  { key: 'rank', label: '#', format: v => v },
  { key: 'player', label: 'Player' },
  { key: 'position', label: 'Pos' },
  { key: 'years', label: 'Years' },
  { key: 'war', label: 'WAR', format: v => v.toFixed(1) },
  { key: 'g', label: 'G' },
  { key: 'avg', label: 'AVG', format: v => v.toFixed(3).replace(/^0/,'') },
  { key: 'obp', label: 'OBP', format: v => v.toFixed(3).replace(/^0/,'') },
  { key: 'slg', label: 'SLG', format: v => v.toFixed(3).replace(/^0/,'') },
  { key: 'opsPlus', label: 'OPS+' },
  { key: 'hr', label: 'HR' },
  { key: 'rbi', label: 'RBI' },
  { key: 'sb', label: 'SB' },
  { key: 'allStar', label: 'AS' },
];

const pitcherCols = [
  { key: 'rank', label: '#', format: v => v },
  { key: 'player', label: 'Player' },
  { key: 'years', label: 'Years' },
  { key: 'war', label: 'WAR', format: v => v.toFixed(1) },
  { key: 'w', label: 'W' },
  { key: 'l', label: 'L' },
  { key: 'era', label: 'ERA', format: v => v.toFixed(2) },
  { key: 'eraPlus', label: 'ERA+' },
  { key: 'g', label: 'G' },
  { key: 'gs', label: 'GS' },
  { key: 'ip', label: 'IP' },
  { key: 'so', label: 'SO' },
  { key: 'whip', label: 'WHIP', format: v => v.toFixed(2) },
  { key: 'allStar', label: 'AS' },
];

export function initTable() {
  render();

  document.getElementById('stats-filters').addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    document.querySelectorAll('#stats-filters .filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    sortKey = 'war';
    sortDir = 'desc';
    render();
  });

  document.getElementById('stats-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    render();
  });
}

function render() {
  const table = document.getElementById('stats-table');
  const cols = currentFilter === 'pitcher' ? pitcherCols : positionCols;
  let data = currentFilter === 'pitcher' ? [...pitchers] : [...positionPlayers];

  // Search
  if (searchQuery) {
    data = data.filter(p => p.player.toLowerCase().includes(searchQuery));
  }

  // Sort
  data.sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'string') {
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  const topWar = [...data].sort((a,b) => b.war - a.war).slice(0, 5).map(p => p.player);

  table.innerHTML = `
    <thead>
      <tr>
        ${cols.map(c => `
          <th data-key="${c.key}" class="${sortKey === c.key ? 'sorted' : ''}">
            ${c.label}
            <span class="sort-arrow">${sortKey === c.key ? (sortDir === 'desc' ? '▼' : '▲') : '▽'}</span>
          </th>
        `).join('')}
      </tr>
    </thead>
    <tbody>
      ${data.map(p => `
        <tr class="${topWar.includes(p.player) ? 'top5' : ''}">
          ${cols.map(c => {
            if (c.key === 'player') {
              return `<td><div class="player-cell">
                <img src="${getHeadshotUrl(p.mlbId)}" alt="" onerror="this.style.display='none'">
                ${p.player}
              </div></td>`;
            }
            const val = p[c.key];
            const formatted = c.format ? c.format(val) : val;
            return `<td>${formatted}</td>`;
          }).join('')}
        </tr>
      `).join('')}
    </tbody>
  `;

  // Sort click handlers
  table.querySelectorAll('th').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (sortKey === key) {
        sortDir = sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        sortKey = key;
        sortDir = 'desc';
      }
      render();
    });
  });
}
