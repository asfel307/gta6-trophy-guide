// data.js — loads the trophy list and gives the rest of the app small,
// named helpers for reading it. The list itself lives in data/trophies.json
// and is fetched at run time from this app's own files, never the network.

export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('trophy list could not be loaded');
  const doc = await response.json();
  return doc.trophies ?? doc;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(kind) {
  const labels = {
    story: 'Story',
    side: 'Strangers & side',
    collectible: 'Collectibles',
    activity: 'Activities',
  };
  return labels[kind] ?? kind;
}

// A short, human-readable count line for trophies PSN tracks a target for,
// e.g. "42 to earn" — nothing is shown when the list carries no count.
export function countText(trophy) {
  if (typeof trophy.count !== 'number') return '';
  return `PSN target: ${trophy.count.toLocaleString('en-US')}`;
}
