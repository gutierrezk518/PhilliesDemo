import { allPlayers, positionPlayers, pitchers, getHeadshotUrl } from './data.js';

let slots = [null, null, null, null];
let activeSlotIndex = null;

export function initRushmore() {
  // Load from URL hash or localStorage
  loadState();
  renderSlots();
  buildPicker();

  document.getElementById('rushmore-share').addEventListener('click', shareRushmore);
  document.getElementById('rushmore-reset').addEventListener('click', () => {
    slots = [null, null, null, null];
    saveState();
    renderSlots();
  });
  document.getElementById('rushmore-download').addEventListener('click', downloadRushmoreImage);

  // Close picker on background click
  document.getElementById('rushmore-picker').addEventListener('click', (e) => {
    if (e.target.id === 'rushmore-picker') closePicker();
  });
}

function getAllCombined() {
  return [
    ...positionPlayers.map(p => ({ ...p, type: 'position' })),
    ...pitchers.map(p => ({ ...p, type: 'pitcher' }))
  ].sort((a, b) => b.war - a.war);
}

function renderSlots() {
  const container = document.getElementById('rushmore-slots');
  container.innerHTML = slots.map((player, i) => {
    if (player) {
      return `
        <div class="rushmore-slot filled" data-slot="${i}">
          <div class="slot-number">${i + 1}</div>
          <button class="remove-btn" data-remove="${i}">&times;</button>
          <img src="${getHeadshotUrl(player.mlbId)}" alt="${player.player}" onerror="this.src='data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect fill='%23002D72' width='80' height='80' rx='40'/><text x='40' y='50' text-anchor='middle' fill='white' font-size='24'>${player.player.split(' ').map(n=>n[0]).join('')}</text></svg>`)}'">
          <div class="slot-name">${player.player}</div>
          <div class="slot-war">${player.war} WAR</div>
        </div>
      `;
    }
    return `
      <div class="rushmore-slot" data-slot="${i}">
        <div class="slot-number">${i + 1}</div>
        <div class="slot-placeholder">Click to add</div>
      </div>
    `;
  }).join('');

  // Click to add
  container.querySelectorAll('.rushmore-slot:not(.filled)').forEach(slot => {
    slot.addEventListener('click', () => {
      activeSlotIndex = parseInt(slot.dataset.slot);
      openPicker();
    });
  });

  // Click to also open picker on filled slots (replace)
  container.querySelectorAll('.rushmore-slot.filled').forEach(slot => {
    slot.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-btn')) return;
      activeSlotIndex = parseInt(slot.dataset.slot);
      openPicker();
    });
  });

  // Remove buttons
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.remove);
      slots[idx] = null;
      saveState();
      renderSlots();
    });
  });
}

function buildPicker() {
  const list = document.getElementById('rushmore-picker-list');
  const search = document.getElementById('rushmore-picker-search');

  const renderList = (query = '') => {
    const combined = getAllCombined();
    const filtered = query ?
      combined.filter(p => p.player.toLowerCase().includes(query.toLowerCase())) :
      combined;

    const selectedNames = slots.filter(Boolean).map(p => p.player);

    list.innerHTML = filtered.map(p => `
      <div class="rushmore-picker-item ${selectedNames.includes(p.player) ? 'selected' : ''}" data-player="${p.player}">
        <img src="${getHeadshotUrl(p.mlbId)}" alt="" width="40" height="40" style="border-radius:50%;object-fit:cover" onerror="this.style.display='none'">
        <div>
          <div class="pick-name">${p.player}</div>
          <div class="pick-info">${p.position || 'Pitcher'} &bull; ${p.years} &bull; ${p.war} WAR</div>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.rushmore-picker-item:not(.selected)').forEach(item => {
      item.addEventListener('click', () => {
        const name = item.dataset.player;
        const player = getAllCombined().find(p => p.player === name);
        if (player && activeSlotIndex !== null) {
          slots[activeSlotIndex] = player;
          saveState();
          renderSlots();
          closePicker();
        }
      });
    });
  };

  search.addEventListener('input', () => renderList(search.value));

  // Store render function for re-use
  window._rushmoreRenderList = renderList;
}

function openPicker() {
  const picker = document.getElementById('rushmore-picker');
  const search = document.getElementById('rushmore-picker-search');
  picker.classList.add('open');
  search.value = '';
  search.focus();
  if (window._rushmoreRenderList) window._rushmoreRenderList('');
}

function closePicker() {
  document.getElementById('rushmore-picker').classList.remove('open');
  activeSlotIndex = null;
}

function saveState() {
  const ids = slots.map(p => p ? p.player : '');
  localStorage.setItem('philliesRushmore', JSON.stringify(ids));
  const hash = ids.filter(Boolean).join(',');
  if (hash) {
    history.replaceState(null, '', '#rushmore=' + encodeURIComponent(hash));
  }
}

function loadState() {
  // Try URL hash first
  const hash = location.hash;
  if (hash.startsWith('#rushmore=')) {
    const names = decodeURIComponent(hash.slice(10)).split(',');
    const combined = getAllCombined();
    names.forEach((name, i) => {
      if (i < 4) {
        const player = combined.find(p => p.player === name);
        if (player) slots[i] = player;
      }
    });
    return;
  }

  // Try localStorage
  try {
    const saved = JSON.parse(localStorage.getItem('philliesRushmore'));
    if (saved && Array.isArray(saved)) {
      const combined = getAllCombined();
      saved.forEach((name, i) => {
        if (i < 4 && name) {
          const player = combined.find(p => p.player === name);
          if (player) slots[i] = player;
        }
      });
    }
  } catch {}
}

function shareRushmore() {
  const filled = slots.filter(Boolean);
  if (filled.length === 0) {
    alert('Pick at least one player for your Mount Rushmore!');
    return;
  }

  const text = `My Phillies Mount Rushmore:\n${filled.map((p, i) => `${i + 1}. ${p.player} (${p.war} WAR)`).join('\n')}\n\nBuild yours at: ${location.href}`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('rushmore-share');
      btn.textContent = 'Copied to Clipboard!';
      setTimeout(() => { btn.textContent = 'Share Your Picks'; }, 2000);
    });
  } else {
    prompt('Copy your Mount Rushmore:', text);
  }
}

// Face positions on the 1024x713 Mount Rushmore background, offset +140 for title band
const FACE_POSITIONS = [
  { cx: 378, cy: 375, rx: 65, ry: 88, rot: -0.05 }, // Washington (leftmost)
  { cx: 520, cy: 390, rx: 55, ry: 78, rot:  0.00 }, // Jefferson
  { cx: 635, cy: 440, rx: 48, ry: 65, rot:  0.02 }, // Roosevelt (smaller/recessed)
  { cx: 752, cy: 438, rx: 55, ry: 72, rot: -0.03 }, // Lincoln
];

const CANVAS_W = 1024;
const BG_H = 713;
const TITLE_H = 140;
const NAMES_H = 120;
const CANVAS_H = BG_H + TITLE_H + NAMES_H;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load ' + src));
    img.src = src;
  });
}

function initialsDataUrl(name) {
  const initials = name.split(' ').map(n => n[0]).join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect fill='%23002D72' width='200' height='200'/><text x='100' y='130' text-anchor='middle' fill='white' font-size='84' font-weight='800' font-family='Arial,sans-serif'>${initials}</text></svg>`;
  return 'data:image/svg+xml,' + svg;
}

async function downloadRushmoreImage() {
  const filled = slots.filter(Boolean);
  if (filled.length < 4) {
    alert('Pick all 4 players before downloading your Mount Rushmore!');
    return;
  }

  const btn = document.getElementById('rushmore-download');
  const originalText = btn.textContent;
  btn.textContent = 'Generating...';
  btn.disabled = true;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext('2d');

    // Background panels
    ctx.fillStyle = '#0A1C3A';
    ctx.fillRect(0, 0, CANVAS_W, TITLE_H);
    ctx.fillRect(0, TITLE_H + BG_H, CANVAS_W, NAMES_H);

    // Red accent stripe under title
    ctx.fillStyle = '#E81828';
    ctx.fillRect(CANVAS_W / 2 - 60, TITLE_H - 12, 120, 4);

    // Title text
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 44px Oswald, Arial, sans-serif';
    ctx.fillText('PHILLIES', CANVAS_W / 2 - 170, TITLE_H / 2 - 6);
    ctx.fillStyle = '#E81828';
    ctx.fillText('MOUNT RUSHMORE', CANVAS_W / 2 + 95, TITLE_H / 2 - 6);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '600 14px Inter, Arial, sans-serif';
    ctx.fillText('THE 4 GREATEST OF ALL TIME', CANVAS_W / 2, TITLE_H / 2 + 34);

    // Mount Rushmore background
    const bg = await loadImage('img/rushmore-bg.jpg');
    ctx.drawImage(bg, 0, TITLE_H, CANVAS_W, BG_H);

    // Load all 4 player headshots in parallel
    const headshots = await Promise.all(filled.map(p =>
      p.mlbId ? loadImage(`https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${p.mlbId}/headshot/67/current`)
              : loadImage(initialsDataUrl(p.player))
    ));

    // Draw each face into its oval slot with a stone-like grayscale blend
    filled.forEach((player, i) => {
      const pos = FACE_POSITIONS[i];
      const img = headshots[i];

      ctx.save();
      ctx.translate(pos.cx, pos.cy);
      ctx.rotate(pos.rot);

      // Oval clip
      ctx.beginPath();
      ctx.ellipse(0, 0, pos.rx, pos.ry, 0, 0, Math.PI * 2);
      ctx.clip();

      // Stone blend: grayscale + slight contrast
      ctx.filter = 'grayscale(85%) contrast(1.1) brightness(1.05)';
      const drawW = pos.rx * 2.4;
      const drawH = pos.ry * 2.4;
      ctx.drawImage(img, -drawW / 2, -drawH / 2 - 8, drawW, drawH);
      ctx.filter = 'none';

      // Subtle stone-colored overlay to blend
      ctx.fillStyle = 'rgba(210, 200, 180, 0.22)';
      ctx.fillRect(-pos.rx, -pos.ry, pos.rx * 2, pos.ry * 2);

      ctx.restore();
    });

    // Player name strip along the bottom
    const colW = CANVAS_W / 4;
    filled.forEach((player, i) => {
      const cx = colW * i + colW / 2;
      const cy = TITLE_H + BG_H + NAMES_H / 2;

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 20px Oswald, Arial, sans-serif';
      ctx.fillText(player.player.toUpperCase(), cx, cy - 18);

      ctx.fillStyle = '#E81828';
      ctx.font = '800 22px Oswald, Arial, sans-serif';
      ctx.fillText(`${player.war} WAR`, cx, cy + 14);

      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '500 12px Inter, Arial, sans-serif';
      ctx.fillText(player.position || 'Pitcher', cx, cy + 38);
    });

    // Export
    canvas.toBlob((blob) => {
      if (!blob) {
        alert('Could not generate image — your browser blocked the export due to a cross-origin image. Try a different browser.');
        btn.textContent = originalText;
        btn.disabled = false;
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'phillies-mount-rushmore.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      btn.textContent = 'Downloaded!';
      setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 1800);
    }, 'image/png');
  } catch (err) {
    console.error(err);
    alert('Could not generate your Mount Rushmore: ' + err.message);
    btn.textContent = originalText;
    btn.disabled = false;
  }
}
