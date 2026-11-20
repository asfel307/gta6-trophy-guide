// views.js — everything the reader sees: the checklist rows, the guide
// detail pane, the progress header, the missables list and the tab switching.
// All text is set with textContent, never innerHTML, so trophy names and
// descriptions can never inject markup.

import { gradeLabel, kindLabel, countText } from './data.js';
import { displayName, displayDescription, isSpoilerHidden } from './filters.js';

// One checklist row: a tick box, the name + description, and the grade badge.
// Missable trophies carry a visible flag; counted trophies show their target.
export function trophyRow(trophy, earned, spoilersOn, onToggle, onSelect, selected) {
  const li = document.createElement('li');
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'trophy-row' + (earned.has(trophy.name) ? ' earned' : '') + (selected ? ' selected' : '');
  row.addEventListener('click', (event) => {
    if (event.target instanceof HTMLInputElement) return;
    onSelect(trophy);
  });

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.name);
  box.setAttribute('aria-label', `Earned: ${displayName(trophy, earned, spoilersOn)}`);
  box.addEventListener('change', () => onToggle(trophy, box.checked));

  const body = document.createElement('span');
  const name = document.createElement('span');
  name.className = 'trophy-name';
  name.textContent = displayName(trophy, earned, spoilersOn);
  const desc = document.createElement('span');
  desc.className = 'trophy-desc';
  desc.textContent = displayDescription(trophy, earned, spoilersOn);
  const kind = document.createElement('span');
  kind.className = 'trophy-kind';
  kind.textContent = kindLabel(trophy.kind);
  body.append(name, document.createElement('br'), desc, document.createElement('br'), kind);
  if (trophy.missable) {
    const flag = document.createElement('span');
    flag.className = 'flag';
    flag.textContent = 'MISSABLE';
    body.append(' ', flag);
  }
  const target = countText(trophy);
  if (target) {
    const chip = document.createElement('span');
    chip.className = 'count-chip';
    chip.textContent = ` · ${target}`;
    body.append(chip);
  }

  const badge = document.createElement('span');
  badge.className = `grade-badge grade-${trophy.grade}`;
  badge.textContent = gradeLabel(trophy.grade);

  row.append(box, body, badge);
  li.append(row);
  return li;
}

// The detail pane: the selected trophy's guide in full, its sources, and a
// plain note when a step has not yet been checked in the game.
export function renderDetail(detailElement, trophy, earned, spoilersOn) {
  detailElement.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'detail-empty';
    empty.textContent = 'Pick a trophy on the left to read its guide and sources.';
    detailElement.append(empty);
    return;
  }
  const hidden = isSpoilerHidden(trophy, earned, spoilersOn);
  const title = document.createElement('h3');
  title.textContent = displayName(trophy, earned, spoilersOn);
  const meta = document.createElement('p');
  meta.className = 'meta-line';
  meta.textContent = `${gradeLabel(trophy.grade)} · ${kindLabel(trophy.kind)}${trophy.missable ? ' · Missable — do it on time' : ''}${trophy.hidden ? ' · Hidden on PlayStation until earned' : ''}`;
  const desc = document.createElement('p');
  desc.textContent = hidden ? 'Hidden until earned.' : trophy.description;
  const guide = document.createElement('p');
  guide.className = 'guide-text';
  guide.textContent = hidden ? 'This is a story trophy. Its guide stays hidden with its name until you earn it.' : trophy.guide;
  const sources = document.createElement('p');
  sources.className = 'sources';
  sources.textContent = `Sources: ${trophy.sources}`;
  detailElement.append(title, meta, desc, guide, sources);
}

// The header counters: how many are earned, and the fill of the progress bar.
export function renderProgress(trophies, earned) {
  const total = trophies.length;
  const done = earned.size;
  document.getElementById('earned-count').textContent = String(done);
  document.getElementById('progress-fill').style.width = `${total ? Math.round((done / total) * 100) : 0}%`;
  document.getElementById('platinum-note').textContent =
    done === total && total > 0
      ? 'Platinum earned — you are a Leonida Legend!'
      : '1 platinum · 2 gold · 6 silver · 46 bronze';
}

// Shows or hides the four views and marks the active tab.
export function switchView(name) {
  for (const view of ['checklist', 'roadmap', 'missables', 'settings']) {
    document.getElementById(`view-${view}`).classList.toggle('hidden', view !== name);
  }
  for (const tab of document.querySelectorAll('#tabs button')) {
    tab.classList.toggle('active', tab.dataset.view === name);
  }
}
