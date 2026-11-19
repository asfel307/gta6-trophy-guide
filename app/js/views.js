// Rendering for the checklist view: the progress counters, the trophy list
// and the detail pane that opens beside it. Everything is built with DOM
// calls, so trophy names and guide text are never pasted into HTML strings.

import { KIND_LABELS, countByGrade, countByKind, isSpoilerHidden } from './filters.js';

const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

export function renderProgressCounters(trophies, earnedIds) {
  const text = document.getElementById('progress-text');
  const pct = document.getElementById('progress-pct');
  const fill = document.getElementById('progress-fill');
  const counters = document.getElementById('counters');
  const total = trophies.length;
  const earned = earnedIds.size;
  const percent = total === 0 ? 0 : Math.round((earned / total) * 100);
  text.textContent = `${earned} of ${total} earned`;
  pct.textContent = `${percent}%`;
  fill.style.width = `${percent}%`;

  const byGrade = countByGrade(trophies, earnedIds);
  const byKind = countByKind(trophies, earnedIds);
  counters.replaceChildren();
  for (const grade of GRADE_ORDER) {
    const [got, all] = byGrade[grade];
    const span = document.createElement('span');
    const label = grade.charAt(0).toUpperCase() + grade.slice(1);
    const strong = document.createElement('b');
    strong.textContent = `${got}/${all}`;
    span.append(document.createTextNode(`${label} `), strong);
    counters.append(span);
  }
  const kinds = ['story', 'side', 'collectibles', 'activities', 'robbery', 'exploration'];
  for (const kind of kinds) {
    const entry = byKind.get(kind);
    if (!entry) continue;
    const span = document.createElement('span');
    const strong = document.createElement('b');
    strong.textContent = `${entry[0]}/${entry[1]}`;
    span.append(document.createTextNode(`${KIND_LABELS[kind]} `), strong);
    counters.append(span);
  }
}

function badge(text, className) {
  const span = document.createElement('span');
  span.className = `badge ${className}`;
  span.textContent = text;
  return span;
}

export function renderTrophyList(listElement, trophies, state, callbacks) {
  listElement.replaceChildren();
  if (trophies.length === 0) {
    const note = document.createElement('li');
    note.className = 'empty-note';
    if (state.kind === 'online') {
      note.textContent =
        'No online trophies in this list — all 55 trophies are single-player and offline (PowerPyx). Nothing here needs a connection or another player.';
    } else {
      note.textContent = 'No trophies match these filters. Clear the search or widen the kind and grade filters.';
    }
    listElement.append(note);
    return;
  }
  for (const trophy of trophies) {
    const item = document.createElement('li');
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'trophy' + (state.earnedIds.has(trophy.id) ? ' earned' : '');
    if (state.selectedId === trophy.id) row.classList.add('selected');
    row.addEventListener('click', () => callbacks.onSelect(trophy.id));

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.earnedIds.has(trophy.id);
    box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    box.addEventListener('click', (event) => event.stopPropagation());
    box.addEventListener('change', () => callbacks.onToggleEarned(trophy.id, box.checked));

    const body = document.createElement('div');
    body.className = 'trophy-body';
    const name = document.createElement('div');
    name.className = 'trophy-name';
    const hidden = isSpoilerHidden(trophy, state.earnedIds, state.hideSpoilers);
    name.textContent = hidden ? 'Hidden story trophy — earn it to reveal' : trophy.name;
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = hidden ? 'Its name and description stay hidden until you earn it.' : trophy.description;
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    meta.append(
      badge(trophy.grade, trophy.grade),
      badge(KIND_LABELS[trophy.kind] || trophy.kind, 'kind'),
    );
    if (trophy.missable) meta.append(badge('Missable', 'missable'));
    if (trophy.hidden) meta.append(badge('Hidden on PSN', 'hidden-tag'));
    if (trophy.countLabel) meta.append(badge(trophy.countLabel, 'kind'));
    body.append(name, desc, meta);
    row.append(box, body);
    item.append(row);
    listElement.append(item);
  }
}

// The detail pane: official name, description and grade, the guide in our own
// words, and the sources it cites — plus the missable warning where it applies.
export function renderDetail(detailElement, trophy, state, callbacks) {
  detailElement.replaceChildren();
  if (!trophy) {
    const placeholder = document.createElement('p');
    placeholder.className = 'placeholder';
    placeholder.textContent =
      'Select a trophy on the left to read its guide: the official description, how to earn it, and the sources behind each step.';
    detailElement.append(placeholder);
    return;
  }
  const hidden = isSpoilerHidden(trophy, state.earnedIds, state.hideSpoilers);

  const heading = document.createElement('h2');
  heading.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  detailElement.append(heading);

  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  meta.append(badge(trophy.grade, trophy.grade), badge(KIND_LABELS[trophy.kind] || trophy.kind, 'kind'));
  if (trophy.missable) meta.append(badge('Missable', 'missable'));
  if (trophy.hidden) meta.append(badge('Hidden on PSN', 'hidden-tag'));
  detailElement.append(meta);

  if (hidden) {
    const note = document.createElement('p');
    note.className = 'spoiler-note';
    note.textContent =
      'Spoilers are hidden. Turn off “Hide story spoilers” above, or earn this trophy in game, to reveal its name, description and guide.';
    detailElement.append(note);
  } else {
    const official = document.createElement('p');
    official.className = 'official';
    official.textContent = `Official: “${trophy.description}” — ${trophy.grade}.`;
    detailElement.append(official);
    if (trophy.countLabel) {
      const count = document.createElement('p');
      count.className = 'count-line';
      count.textContent = `Target: ${trophy.countLabel}.`;
      detailElement.append(count);
    }
    if (trophy.missable) {
      const warn = document.createElement('p');
      warn.className = 'spoiler-note';
      warn.textContent =
        'Missable: the Chapter 1 balcony meditation at Jason’s house disappears after Chapter 1. Do it before the chapter ends and keep a Chapter 1 save until this trophy pops.';
      detailElement.append(warn);
    }
    const guideHeading = document.createElement('h3');
    guideHeading.textContent = 'How to earn it';
    const guideText = document.createElement('p');
    guideText.className = 'guide-text';
    guideText.textContent = trophy.guide;
    detailElement.append(guideHeading, guideText);

    const sourcesHeading = document.createElement('h3');
    sourcesHeading.textContent = 'Sources';
    const sources = document.createElement('ul');
    sources.className = 'sources';
    for (const source of trophy.sources || []) {
      const item = document.createElement('li');
      if (source.url) {
        const link = document.createElement('a');
        link.href = source.url;
        link.textContent = source.name;
        link.rel = 'noopener';
        item.append(link);
      } else {
        item.textContent = source.name;
      }
      sources.append(item);
    }
    detailElement.append(sourcesHeading, sources);
  }

  const earnRow = document.createElement('div');
  earnRow.className = 'earn-row';
  const earnButton = document.createElement('button');
  earnButton.type = 'button';
  earnButton.textContent = state.earnedIds.has(trophy.id) ? 'Mark as not earned' : 'Mark as earned';
  earnButton.addEventListener('click', () => callbacks.onToggleEarned(trophy.id, !state.earnedIds.has(trophy.id)));
  earnRow.append(earnButton);
  detailElement.append(earnRow);
}
