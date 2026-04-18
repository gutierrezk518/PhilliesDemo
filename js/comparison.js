import { allPlayers, positionPlayers, pitchers, getHeadshotUrl } from './data.js';
import { createPlayerImg, normalizeStats } from './utils.js';

let radarChart = null;

export function initComparison() {
  const selectA = document.getElementById('compare-a');
  const selectB = document.getElementById('compare-b');

  // Populate dropdowns
  const combined = [
    ...positionPlayers.map(p => ({ ...p, type: 'position' })),
    ...pitchers.map(p => ({ ...p, type: 'pitcher' }))
  ].sort((a, b) => b.war - a.war);

  const optionsHTML = combined.map(p =>
    `<option value="${p.player}">${p.player} (${p.war} WAR${p.type === 'pitcher' ? ' - P' : ` - ${p.position}`})</option>`
  ).join('');

  selectA.innerHTML = '<option value="">Select Player A</option>' + optionsHTML;
  selectB.innerHTML = '<option value="">Select Player B</option>' + optionsHTML;

  // Pre-select Schmidt vs Carlton
  selectA.value = 'Mike Schmidt';
  selectB.value = 'Steve Carlton';

  const update = () => {
    const a = findPlayer(selectA.value);
    const b = findPlayer(selectB.value);
    if (a && b) renderComparison(a, b);
  };

  selectA.addEventListener('change', update);
  selectB.addEventListener('change', update);

  update();
}

function findPlayer(name) {
  return positionPlayers.find(p => p.player === name) ||
         pitchers.find(p => p.player === name);
}

function renderComparison(a, b) {
  const result = document.getElementById('comparison-result');
  const aIsPitcher = a.era !== undefined && a.position === undefined;
  const bIsPitcher = b.era !== undefined && b.position === undefined;
  const bothPitchers = aIsPitcher && bIsPitcher;
  const bothPosition = !aIsPitcher && !bIsPitcher;

  let statPairs;
  if (bothPitchers) {
    statPairs = [
      { key: 'war', label: 'WAR', higher: true },
      { key: 'era', label: 'ERA', higher: false },
      { key: 'w', label: 'Wins', higher: true },
      { key: 'so', label: 'Strikeouts', higher: true },
      { key: 'ip', label: 'Innings', higher: true },
      { key: 'whip', label: 'WHIP', higher: false },
      { key: 'eraPlus', label: 'ERA+', higher: true },
    ];
  } else if (bothPosition) {
    statPairs = [
      { key: 'war', label: 'WAR', higher: true },
      { key: 'avg', label: 'AVG', higher: true },
      { key: 'obp', label: 'OBP', higher: true },
      { key: 'slg', label: 'SLG', higher: true },
      { key: 'hr', label: 'Home Runs', higher: true },
      { key: 'rbi', label: 'RBI', higher: true },
      { key: 'sb', label: 'Stolen Bases', higher: true },
    ];
  } else {
    statPairs = [
      { key: 'war', label: 'WAR', higher: true },
      { key: 'g', label: 'Games', higher: true },
      { key: 'allStar', label: 'All-Star', higher: true },
    ];
  }

  // Count who wins more categories
  let aWins = 0, bWins = 0;
  statPairs.forEach(sp => {
    const av = parseFloat(a[sp.key]) || 0;
    const bv = parseFloat(b[sp.key]) || 0;
    if (sp.higher ? av > bv : av < bv) aWins++;
    else if (sp.higher ? bv > av : bv < av) bWins++;
  });

  result.innerHTML = `
    <div class="comparison-display">
      <div class="comparison-player">
        <img src="${getHeadshotUrl(a.mlbId)}" alt="${a.player}" onerror="this.style.display='none'">
        <h3>${a.player}</h3>
        <p style="color:rgba(255,255,255,0.5)">${a.position || 'Pitcher'} &bull; ${a.years}</p>
        <div class="war-big">${a.war}</div>
        <div style="color:rgba(255,255,255,0.5);font-size:0.75rem;text-transform:uppercase;letter-spacing:2px">WAR</div>
      </div>
      <div class="comparison-vs">VS</div>
      <div class="comparison-player">
        <img src="${getHeadshotUrl(b.mlbId)}" alt="${b.player}" onerror="this.style.display='none'">
        <h3>${b.player}</h3>
        <p style="color:rgba(255,255,255,0.5)">${b.position || 'Pitcher'} &bull; ${b.years}</p>
        <div class="war-big">${b.war}</div>
        <div style="color:rgba(255,255,255,0.5);font-size:0.75rem;text-transform:uppercase;letter-spacing:2px">WAR</div>
      </div>
    </div>

    <div class="comparison-bars">
      ${statPairs.map(sp => {
        const av = parseFloat(a[sp.key]) || 0;
        const bv = parseFloat(b[sp.key]) || 0;
        const max = Math.max(av, bv) || 1;
        const aPct = (av / max) * 100;
        const bPct = (bv / max) * 100;
        const aWinner = sp.higher ? av >= bv : av <= bv;
        const bWinner = !aWinner;
        const format = ['avg','obp','slg','era','whip'].includes(sp.key) ?
          (v) => v.toFixed(3).replace(/^0/,'') : (v) => String(v);

        return `
          <div class="comparison-bar-row">
            <div class="comparison-bar-left ${aWinner ? 'winner' : ''}">
              <div class="bar-fill" style="width:${aPct}%;margin-left:auto">${format(av)}</div>
            </div>
            <div class="stat-label">${sp.label}</div>
            <div class="comparison-bar-right ${bWinner ? 'winner' : ''}">
              <div class="bar-fill" style="width:${bPct}%">${format(bv)}</div>
            </div>
          </div>
        `;
      }).join('')}

      <div style="text-align:center;margin-top:24px;padding:16px;background:rgba(255,255,255,0.05);border-radius:12px">
        <span style="font-size:1.2rem;font-weight:700;color:${aWins > bWins ? '#4da3ff' : aWins < bWins ? '#E81828' : 'rgba(255,255,255,0.7)'}">
          ${aWins > bWins ? `${a.player} wins ${aWins}-${bWins}` :
            bWins > aWins ? `${b.player} wins ${bWins}-${aWins}` :
            `It's a tie! ${aWins}-${bWins}`}
        </span>
      </div>
    </div>
  `;

  // Animate bars after render
  setTimeout(() => {
    result.querySelectorAll('.bar-fill').forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.width = width;
        });
      });
    });
  }, 50);
}
