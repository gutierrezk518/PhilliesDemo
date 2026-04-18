import { bestByPosition, positionPlayers, pitchers, getHeadshotUrl } from './data.js';
import { createPlayerImg } from './utils.js';

const positions = {
  P:  { x: 400, y: 420, label: 'Pitcher' },
  C:  { x: 400, y: 560, label: 'Catcher' },
  '1B': { x: 570, y: 350, label: 'First Base' },
  '2B': { x: 510, y: 260, label: 'Second Base' },
  SS: { x: 290, y: 260, label: 'Shortstop' },
  '3B': { x: 230, y: 350, label: 'Third Base' },
  LF: { x: 160, y: 140, label: 'Left Field' },
  CF: { x: 400, y: 80,  label: 'Center Field' },
  RF: { x: 640, y: 140, label: 'Right Field' },
};

export function initDiamond() {
  const container = document.getElementById('diamond-field');

  // Build SVG
  const svg = `
    <svg viewBox="0 0 800 640" class="diamond-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Outfield grass -->
      <ellipse cx="400" cy="320" rx="380" ry="300" fill="#1a5c2a" opacity="0.3"/>

      <!-- Infield diamond -->
      <polygon points="400,200 560,360 400,520 240,360" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>

      <!-- Base paths -->
      <line x1="400" y1="520" x2="560" y2="360" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <line x1="560" y1="360" x2="400" y2="200" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <line x1="400" y1="200" x2="240" y2="360" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <line x1="240" y1="360" x2="400" y2="520" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>

      <!-- Pitcher's mound -->
      <circle cx="400" cy="420" r="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>

      <!-- Bases -->
      <rect x="393" y="193" width="14" height="14" fill="white" transform="rotate(45 400 200)" opacity="0.6"/>
      <rect x="553" y="353" width="14" height="14" fill="white" transform="rotate(45 560 360)" opacity="0.6"/>
      <rect x="233" y="353" width="14" height="14" fill="white" transform="rotate(45 240 360)" opacity="0.6"/>
      <rect x="393" y="513" width="14" height="14" fill="white" transform="rotate(45 400 520)" opacity="0.4"/>

      <!-- Position nodes -->
      ${Object.entries(positions).map(([pos, coord]) => {
        const player = bestByPosition[pos];
        if (!player) return '';
        return `
          <g class="diamond-node" data-position="${pos}" style="cursor:pointer">
            <circle cx="${coord.x}" cy="${coord.y}" r="36" fill="rgba(0,45,114,0.85)" stroke="#E81828" stroke-width="2.5">
              <animate attributeName="r" values="36;38;36" dur="3s" repeatCount="indefinite"/>
            </circle>
            ${player.mlbId ? `<image href="${getHeadshotUrl(player.mlbId)}" x="${coord.x - 28}" y="${coord.y - 28}" width="56" height="56" clip-path="circle(28px at 28px 28px)" style="clip-path: circle(28px at 28px 28px)"/>` : `<text x="${coord.x}" y="${coord.y + 6}" text-anchor="middle" fill="white" font-size="18" font-weight="800" font-family="Inter, sans-serif">${player.player.split(' ').map(n=>n[0]).join('')}</text>`}
            <text x="${coord.x}" y="${coord.y + 52}" text-anchor="middle" fill="white" font-size="11" font-weight="700" font-family="Inter, sans-serif">${player.player.split(' ').pop()}</text>
            <text x="${coord.x}" y="${coord.y + 66}" text-anchor="middle" fill="#E81828" font-size="10" font-weight="800" font-family="Inter, sans-serif">${player.war} WAR</text>
            <text x="${coord.x}" y="${coord.y - 44}" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="9" font-weight="600" font-family="Inter, sans-serif">${pos}</text>
          </g>
        `;
      }).join('')}
    </svg>
  `;

  container.innerHTML = svg;

  // Click handlers
  container.querySelectorAll('.diamond-node').forEach(node => {
    node.addEventListener('click', () => {
      const pos = node.dataset.position;
      showPositionPanel(pos);
    });
  });

  // Close panel
  document.getElementById('diamond-panel-close').addEventListener('click', () => {
    document.getElementById('diamond-panel').classList.remove('open');
  });
}

function showPositionPanel(pos) {
  const panel = document.getElementById('diamond-panel');
  const content = document.getElementById('diamond-panel-content');
  const label = positions[pos].label;

  // Find all players at this position
  let players;
  if (pos === 'P') {
    players = pitchers.slice(0, 5).map(p => ({ ...p, type: 'pitcher' }));
  } else {
    players = positionPlayers
      .filter(p => {
        const primary = p.position.split('/')[0];
        return primary === pos || p.position.includes(pos);
      })
      .sort((a, b) => b.war - a.war)
      .slice(0, 5)
      .map(p => ({ ...p, type: 'position' }));
  }

  content.innerHTML = `
    <h3>Best Phillies at ${label} (${pos})</h3>
    ${players.map((p, i) => `
      <div class="diamond-player-row">
        <img src="${p.mlbId ? getHeadshotUrl(p.mlbId) : `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><rect fill='%23002D72' width='50' height='50' rx='25'/><text x='25' y='32' text-anchor='middle' fill='white' font-size='16'>${p.player.split(' ').map(n=>n[0]).join('')}</text></svg>`)}`}" width="50" height="50" style="border-radius:50%;object-fit:cover;border:2px solid ${i === 0 ? '#E81828' : 'rgba(255,255,255,0.2)'};" onerror="this.src='data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><rect fill='%23002D72' width='50' height='50' rx='25'/><text x='25' y='32' text-anchor='middle' fill='white' font-size='16'>${p.player.split(' ').map(n=>n[0]).join('')}</text></svg>`)}'">
        <div class="diamond-player-info">
          <h4>${i === 0 ? '&#9733; ' : ''}${p.player}</h4>
          <p>${p.years} &bull; <strong>${p.war} WAR</strong>${p.era !== undefined ? ` &bull; ${p.era} ERA &bull; ${p.so} K` : ` &bull; ${p.avg} AVG &bull; ${p.hr} HR`}</p>
        </div>
      </div>
    `).join('')}
  `;

  panel.classList.add('open');
}
