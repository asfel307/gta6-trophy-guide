// app.js — boot. Loads the trophy list, restores saved progress, wires the
// filters, the tabs, the spoiler switches and the export/import buttons, and
// re-renders whenever anything changes. One render function, called after
// every change, keeps every view showing the same truth.

import { loadTrophies } from './data.js';
import {
  loadEarned, saveEarned, loadSpoilersHidden, saveSpoilersHidden,
  exportProgress, importProgress, resetProgress,
} from './store.js';
import { applyFilters } from './filters.js';
import { trophyRow, renderDetail, renderProgress, switchView } from './views.js';
import { renderStages } from './roadmap.js';

const listEl = document.getElementById('trophy-list');
const detailEl = document.getElementById('detail');
const metaEl = document.getElementById('list-meta');
const missableEl = document.getElementById('missable-list');
const stagesEl = document.getElementById('stages');

const searchInput = document.getElementById('search');
const kindSelect = document.getElementById('kind-filter');
const gradeSelect = document.getElementById('grade-filter');
const hideEarnedBox = document.getElementById('hide-earned');
const spoilerBox = document.getElementById('spoiler-toggle');
const spoilerBox2 = document.getElementById('spoiler-toggle-2');

let trophies = [];
let earned = loadEarned();
let spoilersOn = loadSpoilersHidden();
let selectedName = null;

spoilerBox.checked = spoilersOn;
spoilerBox2.checked = spoilersOn;

function currentFilters() {
  return {
    search: searchInput.value,
    kind: kindSelect.value,
    grade: gradeSelect.value,
    hideEarned: hideEarnedBox.checked,
  };
}

// Renders the checklist, the detail pane, the missables list, the roadmap
// stages and the header counters from the same state.
function renderAll() {
  const visible = applyFilters(trophies, earned, currentFilters());
  listEl.replaceChildren();
  for (const trophy of visible) {
    listEl.append(trophyRow(trophy, earned, spoilersOn, onToggle, onSelect, trophy.name === selectedName));
  }
  metaEl.textContent = `Showing ${visible.length} of ${trophies.length} trophies · ${earned.size} earned`;
  renderDetail(detailEl, trophies.find((t) => t.name === selectedName) ?? null, earned, spoilersOn);
  renderProgress(trophies, earned);

  missableEl.replaceChildren();
  for (const trophy of trophies.filter((t) => t.missable)) {
    missableEl.append(trophyRow(trophy, earned, spoilersOn, onToggle, onSelect, trophy.name === selectedName));
  }
  renderStages(stagesEl, trophies, earned);

  const summary = document.getElementById('save-summary');
  if (summary) summary.textContent = `${earned.size} of ${trophies.length} trophies earned, saved in this browser. Export keeps a copy as a file you can import back later.`;
}

function onToggle(trophy, checked) {
  if (checked) earned.add(trophy.name);
  else earned.delete(trophy.name);
  saveEarned(earned);
  renderAll();
}

function onSelect(trophy) {
  selectedName = trophy.name;
  renderAll();
  detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function setSpoilers(hidden) {
  spoilersOn = hidden;
  spoilerBox.checked = hidden;
  spoilerBox2.checked = hidden;
  saveSpoilersHidden(hidden);
  renderAll();
}

spoilerBox.addEventListener('change', () => setSpoilers(spoilerBox.checked));
spoilerBox2.addEventListener('change', () => setSpoilers(spoilerBox2.checked));
searchInput.addEventListener('input', renderAll);
kindSelect.addEventListener('change', renderAll);
gradeSelect.addEventListener('change', renderAll);
hideEarnedBox.addEventListener('change', renderAll);

for (const tab of document.querySelectorAll('#tabs button')) {
  tab.addEventListener('click', () => switchView(tab.dataset.view));
}

document.getElementById('export-btn').addEventListener('click', () => exportProgress(earned));

document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  const status = document.getElementById('import-status');
  if (!file) return;
  try {
    const names = await importProgress(file);
    earned = new Set([...names].filter((n) => trophies.some((t) => t.name === n)));
    saveEarned(earned);
    status.textContent = `Imported ${earned.size} earned trophies.`;
    renderAll();
  } catch (error) {
    status.textContent = error.message;
  }
  event.target.value = '';
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (!window.confirm('Clear all earned trophies? This cannot be undone.')) return;
  earned = resetProgress();
  selectedName = null;
  renderAll();
});

// Boot: fetch the list, then render. A failure leaves a plain message.
try {
  trophies = await loadTrophies();
  renderAll();
} catch {
  listEl.replaceChildren();
  const note = document.createElement('p');
  note.textContent = 'The trophy list could not be loaded. Check that data/trophies.json sits beside this page and reload.';
  listEl.append(note);
}
