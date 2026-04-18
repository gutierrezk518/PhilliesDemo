import { allPlayers, positionPlayers, pitchers } from './data.js';

let chart = null;

export function initLeaderboard() {
  renderChart('all');

  document.getElementById('leaderboard-filters').addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    document.querySelectorAll('#leaderboard-filters .filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderChart(e.target.dataset.filter);
  });
}

function renderChart(filter) {
  let data;
  if (filter === 'position') {
    data = [...positionPlayers].sort((a, b) => b.war - a.war);
  } else if (filter === 'pitcher') {
    data = [...pitchers].sort((a, b) => b.war - a.war);
  } else {
    data = [...allPlayers];
  }

  const labels = data.map(p => p.player);
  const values = data.map(p => p.war);
  const maxWar = Math.max(...values);

  // Color gradient from Phillies red (high) to Phillies blue (low)
  const colors = values.map(v => {
    const ratio = v / maxWar;
    const r = Math.round(232 * ratio + 0 * (1 - ratio));
    const g = Math.round(24 * ratio + 45 * (1 - ratio));
    const b = Math.round(40 * ratio + 114 * (1 - ratio));
    return `rgba(${r}, ${g}, ${b}, 0.85)`;
  });

  const hoverColors = colors.map(c => c.replace('0.85', '1'));

  const canvas = document.getElementById('leaderboard-canvas');

  if (chart) chart.destroy();

  // Resize canvas height based on data
  canvas.parentElement.style.height = Math.max(600, data.length * 28) + 'px';

  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: hoverColors,
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        delay: (ctx) => ctx.dataIndex * 30,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,20,40,0.95)',
          titleFont: { family: 'Oswald', size: 14, weight: '700' },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            title: (items) => {
              const player = data[items[0].dataIndex];
              return player.player;
            },
            label: (item) => {
              const player = data[item.dataIndex];
              const lines = [`WAR: ${player.war}`];
              if (player.type === 'position' || player.position) {
                lines.push(`Position: ${player.position || 'P'}`);
              }
              lines.push(`Years: ${player.years}`);
              if (player.hr !== undefined) lines.push(`HR: ${player.hr} | RBI: ${player.rbi}`);
              if (player.era !== undefined) lines.push(`ERA: ${player.era} | SO: ${player.so}`);
              lines.push(`All-Star: ${player.allStar}x`);
              return lines;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } },
          title: {
            display: true,
            text: 'Wins Above Replacement (WAR)',
            color: 'rgba(255,255,255,0.4)',
            font: { size: 12 }
          }
        },
        y: {
          grid: { display: false },
          ticks: {
            color: 'rgba(255,255,255,0.8)',
            font: { size: 11, weight: '500' },
          }
        }
      }
    }
  });
}
