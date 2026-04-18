import { allPlayers, positionPlayers, pitchers } from './data.js';
import { parseYears, getYearSpan } from './utils.js';

const START_YEAR = 1883;
const END_YEAR = 2025;
const TOTAL_YEARS = END_YEAR - START_YEAR + 1;

const milestones = [
  { year: 1915, label: "1915 NL Pennant" },
  { year: 1950, label: "1950 Whiz Kids" },
  { year: 1980, label: "1980 World Series Champions" },
  { year: 1993, label: "1993 NL Pennant" },
  { year: 2008, label: "2008 World Series Champions" },
  { year: 2022, label: "2022 NL Pennant" },
];

let activeFilter = 'all';

export function initTimeline() {
  render();

  document.getElementById('timeline-filters').addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    document.querySelectorAll('#timeline-filters .filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    activeFilter = e.target.dataset.filter;
    render();
  });
}

function decadeRangeForFilter(filter) {
  if (filter === 'pre1950') return [START_YEAR, 1949];
  // "60s" -> 1960, "20s" -> 2020 (< 30 rolls to 2000s), "50s" -> 1950
  const n = parseInt(filter);
  if (isNaN(n)) return null;
  const decadeStart = n + 1900 + (n < 30 ? 100 : 0);
  return [decadeStart, decadeStart + 9];
}

function render() {
  const container = document.getElementById('timeline-container');
  const tooltip = document.getElementById('timeline-tooltip');

  // Get all players (combined)
  const allCombined = [
    ...positionPlayers.map(p => ({ ...p, type: 'position' })),
    ...pitchers.map(p => ({ ...p, type: 'pitcher' }))
  ].sort((a, b) => {
    const [aStart] = getYearSpan(a.years);
    const [bStart] = getYearSpan(b.years);
    return aStart - bStart || b.war - a.war;
  });

  // Filter by era
  let filtered = allCombined;
  if (activeFilter !== 'all') {
    const range = decadeRangeForFilter(activeFilter);
    if (range) {
      const [decadeStart, decadeEnd] = range;
      filtered = allCombined.filter(p => {
        const ranges = parseYears(p.years);
        return ranges.some(([s, e]) => s <= decadeEnd && e >= decadeStart);
      });
    }
  }

  const yearWidth = 100 / TOTAL_YEARS;
  const barHeight = 28;
  const barGap = 3;
  const topOffset = 50;

  // Build year axis
  let axisHTML = '';
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    const isDecade = y % 10 === 0;
    const left = ((y - START_YEAR) / TOTAL_YEARS) * 100;
    axisHTML += `<div class="timeline-year-mark ${isDecade ? 'decade' : ''}" style="position:absolute;left:${left}%;width:${yearWidth}%">${isDecade ? y : (y % 5 === 0 ? "'" + String(y).slice(-2) : '')}</div>`;
  }

  // Build milestone lines
  let milestonesHTML = milestones.map(m => {
    const left = ((m.year - START_YEAR) / TOTAL_YEARS) * 100;
    const height = topOffset + filtered.length * (barHeight + barGap) + 20;
    return `
      <div class="timeline-milestone" style="left:${left}%;top:${topOffset}px;height:${height - topOffset}px">
        <div class="timeline-milestone-label">${m.label}</div>
      </div>
    `;
  }).join('');

  // Build player bars
  let barsHTML = filtered.map((p, i) => {
    const ranges = parseYears(p.years);
    const typeClass = p.type === 'pitcher' ? 'pitcher-type' : 'position-type';

    return ranges.map(([start, end]) => {
      const left = ((start - START_YEAR) / TOTAL_YEARS) * 100;
      const width = ((end - start + 1) / TOTAL_YEARS) * 100;
      const top = topOffset + i * (barHeight + barGap);

      return `<div class="timeline-player-bar ${typeClass}"
        style="left:${left}%;width:${width}%;top:${top}px"
        data-player='${JSON.stringify({ name: p.player, years: p.years, war: p.war, type: p.type, pos: p.position || 'P' })}'
      >${p.player} (${p.war})</div>`;
    }).join('');
  }).join('');

  const totalHeight = topOffset + filtered.length * (barHeight + barGap) + 40;

  container.innerHTML = `
    <div style="position:relative;height:${topOffset}px">${axisHTML}</div>
    <div style="position:relative;height:${totalHeight - topOffset}px;border-top:2px solid rgba(255,255,255,0.2)">
      ${milestonesHTML}
      ${barsHTML}
    </div>
  `;

  container.style.height = totalHeight + 'px';

  // Tooltip
  container.querySelectorAll('.timeline-player-bar').forEach(bar => {
    bar.addEventListener('mouseenter', () => {
      const data = JSON.parse(bar.dataset.player);
      tooltip.innerHTML = `<strong>${data.name}</strong><br>${data.pos} &bull; ${data.years}<br><span style="color:#E81828;font-weight:700">${data.war} WAR</span>`;
      tooltip.classList.add('show');
    });

    bar.addEventListener('mousemove', (e) => {
      tooltip.style.left = (e.clientX + 12) + 'px';
      tooltip.style.top = (e.clientY - 40) + 'px';
    });

    bar.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });
  });
}
