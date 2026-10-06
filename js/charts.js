/* js/charts.js — chart setup and rendering */

let tChart = null;
let rChart = null;

function getLabels(period) {
  if (period === 'today') return ['13.00','14.00','15.00','16.00','17.00','18.00','19.00','20.00','21.00'];
  if (period === '7d')    return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  if (period === '30d')   return ['W1','W2','W3','W4'];
  if (period === '3m')    return ['Apr','May','Jun'];

  // custom date range — generate day labels
  const s = new Date(document.getElementById('startDate').value);
  const e = new Date(document.getElementById('endDate').value);
  const days = [];
  let d = new Date(s);
  while (d <= e && days.length < 9) {
    days.push(d.getDate() + '/' + (d.getMonth() + 1));
    d.setDate(d.getDate() + 1);
  }
  return days.length ? days : ['D1','D2','D3'];
}

function seedRand(s) {
  let x = s;
  return () => { x = Math.sin(x) * 10000; return x - Math.floor(x); };
}

function genSeries(n, base, variance, seedVal) {
  const rand = seedRand(seedVal);
  return Array.from({ length: n }, () =>
    Math.round(base * (0.55 + rand() * variance))
  );
}

function makeDataset(label, data, color) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: (ctx) => {
      const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
      g.addColorStop(0, color + '18');
      g.addColorStop(1, color + '00');
      return g;
    },
    fill: true,
    pointBackgroundColor: color,
    pointBorderColor: '#fff',
    pointBorderWidth: 1.5,
  };
}

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: ctx => ' ' + ctx.dataset.label + ': ' + ctx.parsed.y.toLocaleString(),
      },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(0,0,0,0.04)', borderDash: [3, 3] },
      ticks: { font: { size: 10, family: 'Poppins' }, color: '#737373' },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.04)', borderDash: [3, 3] },
      ticks: {
        font: { size: 10, family: 'Poppins' },
        color: '#737373',
        callback: v =>
          v >= 1000000 ? (v / 1000000).toFixed(0) + 'M' :
          v >= 1000    ? (v / 1000).toFixed(0) + 'K' : v,
      },
      beginAtZero: true,
    },
  },
  elements: {
    point:  { radius: 3, hoverRadius: 5 },
    line:   { tension: 0.45, borderWidth: 2, fill: true },
  },
};

function renderCharts() {
  const d = state.monitorAs === 'admin'
    ? ADMIN_STATS
    : (DB[state.model]?.[state.period] || DB.all.today);
  const labels = getLabels(state.period);
  const n = labels.length;
  const sv = state.model.length + state.period.length;

  const total   = genSeries(n, d.tokens / n,    1.2, sv + 1);
  const prompt  = genSeries(n, d.inp / n,        1.1, sv + 2);
  const complt  = genSeries(n, d.out / n,        1.1, sv + 3);
  const success = genSeries(n, d.req * 0.95 / n, 0.8, sv + 4);
  const failed  = genSeries(n, d.req * 0.05 / n, 1.5, sv + 5);

  if (tChart) tChart.destroy();
  if (rChart) rChart.destroy();

  tChart = new Chart(document.getElementById('tokenChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        makeDataset('Total Tokens',      total,   '#8B5CF6'),
        makeDataset('Prompt Tokens',     prompt,  '#60A5FA'),
        makeDataset('Completion Tokens', complt,  '#84CC16'),
      ],
    },
    options: { ...CHART_OPTIONS },
  });

  rChart = new Chart(document.getElementById('reqChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        makeDataset('Successful', success, '#10B981'),
        makeDataset('Failed',     failed,  '#F97316'),
      ],
    },
    options: { ...CHART_OPTIONS },
  });
}
