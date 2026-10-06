/* js/interactions.js — filter interactions and popover logic */

// ── SIDEBAR NAV GROUPS (Model / REST expand-collapse) ──────────
function toggleSbGroup(el) {
  el.closest('.sb-nav-group').classList.toggle('expanded');
}

// ── "UNDER DEVELOPMENT" TOAST (sidebar items with no page yet) ──
let toastTimer = null;
function showUnderDevelopmentToast() {
  const toast = document.getElementById('sbToast');
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ── POPOVER HELPERS ──────────────────────────────────────────
function closeAll() {
  document.querySelectorAll('.popover').forEach(p => p.classList.remove('show'));
  document.getElementById('overlay').classList.remove('on');
}

function togglePop(event, id) {
  event.stopPropagation();
  const pop     = document.getElementById(id);
  const wasOpen = pop.classList.contains('show');
  closeAll();
  if (!wasOpen) {
    pop.classList.add('show');
    document.getElementById('overlay').classList.add('on');
  }
}

// ── MODEL FILTER ─────────────────────────────────────────────
function setModelFilter(el) {
  document.querySelectorAll('#modelPop .mp-item').forEach(i => i.classList.remove('sel'));
  el.classList.add('sel');

  state.model = el.dataset.val;

  // strip the checkmark SVG text from the label
  const labelText = el.childNodes[0].textContent.trim();
  document.getElementById('modelLabel').textContent = labelText;
}

function pickModel(el) {
  setModelFilter(el);
  closeAll();
  render();
}

// ── MONITORING AS FILTER ──────────────────────────────────────
function pickMonitor(el) {
  document.querySelectorAll('#monitorPop .mp-item').forEach(i => i.classList.remove('sel'));
  el.classList.add('sel');

  state.monitorAs = el.dataset.val;

  // strip the checkmark SVG text from the label
  const labelText = el.childNodes[0].textContent.trim();
  document.getElementById('monitorLabel').textContent = labelText;

  // reset the model filter back to "All Model" whenever monitoring as changes
  const allModelItem = document.querySelector('#modelPop .mp-item[data-val="all"]');
  if (allModelItem) setModelFilter(allModelItem);

  closeAll();
  render();
}

// ── DATE FILTER ──────────────────────────────────────────────
function fmtDate(d) {
  return d.getDate() + ' ' + d.toLocaleString('en-US', { month: 'short' }) + ' ' + d.getFullYear();
}

function toInputVal(d) {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

// Returns the rel key that matches the given start/end values, or null
function matchRel(startVal, endVal) {
  const today    = new Date(); today.setHours(0,0,0,0);
  const todayVal = toInputVal(today);

  if (endVal !== todayVal) return null;

  const s    = new Date(startVal + 'T00:00:00');
  const diff = Math.round((today - s) / 86400000);

  if (diff === 0)  return 'today';
  if (diff === 6)  return '7d';
  if (diff === 29) return '30d';

  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  if (startVal === toInputVal(threeMonthsAgo)) return '3m';

  return null;
}

function syncRelHighlight() {
  const startVal = document.getElementById('startDate').value;
  const endVal   = document.getElementById('endDate').value;
  const matched  = matchRel(startVal, endVal);

  document.querySelectorAll('.dp-rel-item').forEach(i => {
    i.classList.toggle('sel', i.dataset.rel === matched);
  });
}

function pickRel(el) {
  const rel   = el.dataset.rel;
  const today = new Date(); today.setHours(0,0,0,0);

  const start = new Date(today);
  if      (rel === '7d') start.setDate(start.getDate() - 6);
  else if (rel === '30d') start.setDate(start.getDate() - 29);
  else if (rel === '3m')  start.setMonth(start.getMonth() - 3);

  document.getElementById('startDate').value = toInputVal(start);
  document.getElementById('endDate').value   = toInputVal(today);

  if (rel === 'today') {
    state.period    = 'today';
    state.dateLabel = fmtDate(today);
  } else if (rel === '7d') {
    state.period    = '7d';
    state.dateLabel = fmtDate(start) + ' – ' + fmtDate(today);
  } else if (rel === '30d') {
    state.period    = '30d';
    state.dateLabel = fmtDate(start) + ' – ' + fmtDate(today);
  } else if (rel === '3m') {
    state.period    = '3m';
    state.dateLabel = fmtDate(start) + ' – ' + fmtDate(today);
  }

  syncRelHighlight();
}

function onDateInput() {
  syncRelHighlight();
}

function applyDate() {
  const startVal = document.getElementById('startDate').value;
  const endVal   = document.getElementById('endDate').value;
  const s        = new Date(startVal + 'T00:00:00');
  const e        = new Date(endVal   + 'T00:00:00');
  const diff     = Math.round((e - s) / 86400000);

  state.period = diff <= 1 ? 'today' : diff <= 7 ? '7d' : diff <= 30 ? '30d' : '3m';

  state.dateLabel = s.toDateString() === e.toDateString()
    ? fmtDate(s)
    : fmtDate(s) + ' – ' + fmtDate(e);

  document.getElementById('dateLabel').textContent = state.dateLabel;

  closeAll();
  render();
}
