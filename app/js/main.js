// Leonida Trophy Guide — entry point.
//
// Loads app/data/trophies.json, keeps the earned set (localStorage, or a fixed
// demo set under ?demo=1), and wires the checklist, the roadmap, the missables
// view, the filters, the spoiler setting and progress export/import. The app
// fetches nothing but its own data file and never reaches the network.

import { loadEarnedIds, saveEarnedIds, clearEarnedIds, demoEarnedIds, idsFromImportedData } from './store.js';
import { filterTrophies } from './filters.js';
import { renderProgressCounters, renderTrophyList, renderDetail } from './views.js';
import { renderRoadmap, renderMissables } from './roadmap.js';

const params = new URLSearchParams(window.location.search);
const isDemo = params.get('demo') === '1';

const state = {
  trophies: [],
  earnedIds: isDemo ? demoEarnedIds() : loadEarnedIds(),
  selectedId: null,
  search: '',
  kind: 'all',
  grade: 'all',
  earnedFilter: 'all',
  hideSpoilers: params.get('spoiler') === 'off' ? false : true,
  view: 'checklist',
};

const trophiesById = new Map();
const trophiesByName = new Map();

function persistEarned() {
  if (!isDemo) saveEarnedIds(state.earnedIds);
}

function selectedTrophy() {
  return trophiesById.get(state.selectedId) || null;
}

function refreshAll() {
  renderProgressCounters(state.trophies, state.earnedIds);
  const filtered = filterTrophies(state.trophies, {
    search: state.search,
    kind: state.kind,
    grade: state.grade,
    earnedFilter: state.earnedFilter,
    earnedIds: state.earnedIds,
  });
  renderTrophyList(document.getElementById('trophy-list'), filtered, state, {
    onSelect: (id) => {
      state.selectedId = id;
      refreshAll();
    },
    onToggleEarned: (id, earned) => {
      if (earned) state.earnedIds.add(id);
      else state.earnedIds.delete(id);
      persistEarned();
      refreshAll();
    },
  });
  renderDetail(document.getElementById('detail'), selectedTrophy(), state, {
    onToggleEarned: (id, earned) => {
      if (earned) state.earnedIds.add(id);
      else state.earnedIds.delete(id);
      persistEarned();
      refreshAll();
    },
  });
  const hint = document.getElementById('list-hint');
  hint.textContent =
    state.kind === 'online'
      ? 'Online filter: this list has no online trophies — every one of the 55 is single-player.'
      : `Showing ${filtered.length} of ${state.trophies.length} trophies` +
        (state.hideSpoilers ? ' · story spoilers hidden until earned' : ' · story spoilers shown');
  renderRoadmap(document.getElementById('roadmap'), trophiesById, state.earnedIds);
  renderMissables(
    document.getElementById('missable-list'),
    state.trophies,
    state.earnedIds,
    (card, trophy) =>
      renderDetail(card, trophy, { ...state, hideSpoilers: false }, {
        onToggleEarned: (id, earned) => {
          if (earned) state.earnedIds.add(id);
          else state.earnedIds.delete(id);
          persistEarned();
          refreshAll();
        },
      }),
  );
}

function showView(view) {
  state.view = view;
  for (const name of ['checklist', 'roadmap', 'missables']) {
    document.getElementById(`view-${name}`).hidden = name !== view;
    document.getElementById(`tab-${name}`).classList.toggle('active', name === view);
  }
}

function exportProgress() {
  const payload = {
    game: 'Grand Theft Auto VI',
    guide: 'Leonida Trophy Guide',
    exportedAt: new Date().toISOString(),
    earned: [...state.earnedIds].sort((a, b) => a - b).map((id) => trophiesById.get(id)?.name).filter(Boolean),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gta6-trophy-progress.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

async function importProgress(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = idsFromImportedData(data, trophiesById, trophiesByName);
    if (ids === null) {
      window.alert('That file does not look like exported trophy progress.');
      return;
    }
    state.earnedIds = ids;
    persistEarned();
    refreshAll();
  } catch {
    window.alert('Could not read that file as trophy progress.');
  }
}

async function boot() {
  const response = await fetch('data/trophies.json');
  const data = await response.json();
  state.trophies = data.trophies || [];
  for (const trophy of state.trophies) {
    trophiesById.set(trophy.id, trophy);
    trophiesByName.set(trophy.name, trophy);
  }
  // Drop any saved ids that no longer name a trophy in the list.
  state.earnedIds = new Set([...state.earnedIds].filter((id) => trophiesById.has(id)));

  const searchInput = document.getElementById('search');
  const kindSelect = document.getElementById('kind');
  const gradeSelect = document.getElementById('grade');
  const earnedSelect = document.getElementById('earned-filter');
  const spoilerBox = document.getElementById('spoiler');

  searchInput.addEventListener('input', () => {
    state.search = searchInput.value;
    refreshAll();
  });
  kindSelect.addEventListener('change', () => {
    state.kind = kindSelect.value;
    refreshAll();
  });
  gradeSelect.addEventListener('change', () => {
    state.grade = gradeSelect.value;
    refreshAll();
  });
  earnedSelect.addEventListener('change', () => {
    state.earnedFilter = earnedSelect.value;
    refreshAll();
  });
  spoilerBox.addEventListener('change', () => {
    state.hideSpoilers = spoilerBox.checked;
    refreshAll();
  });
  spoilerBox.checked = state.hideSpoilers;

  document.getElementById('export').addEventListener('click', exportProgress);
  document.getElementById('import').addEventListener('change', (event) => {
    importProgress(event.target.files[0]);
    event.target.value = '';
  });
  document.getElementById('reset').addEventListener('click', () => {
    if (!window.confirm('Clear all earned trophies?')) return;
    state.earnedIds = new Set();
    if (!isDemo) clearEarnedIds();
    refreshAll();
  });

  for (const name of ['checklist', 'roadmap', 'missables']) {
    document.getElementById(`tab-${name}`).addEventListener('click', () => showView(name));
  }

  // Deep links used by the screenshots and by readers sharing a trophy:
  // ?view=roadmap, ?view=missables, ?detail=<id>, ?spoiler=off, ?demo=1.
  const detailId = Number(params.get('detail'));
  if (Number.isInteger(detailId) && trophiesById.has(detailId)) {
    state.selectedId = detailId;
  } else if (state.trophies.length > 0) {
    state.selectedId = state.trophies[0].id;
  }
  const viewParam = params.get('view');
  if (['checklist', 'roadmap', 'missables'].includes(viewParam)) showView(viewParam);
  refreshAll();
  // Deep link into a trophy's sources (?detailFocus=sources): scroll the
  // detail pane itself (not the page) so the cited sources are in view with
  // the guide above them. Done synchronously — reading offsetTop forces the
  // layout, so no animation frame or timer is needed before a screenshot.
  if (params.get('detailFocus') === 'sources') {
    const pane = document.getElementById('detail');
    const sources = pane.querySelector('.sources');
    if (pane && sources) pane.scrollTop = Math.max(0, sources.offsetTop - 12);
  }
}

boot();
