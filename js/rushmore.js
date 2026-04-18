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
