// Progress storage for the Leonida Trophy Guide.
//
// Earned trophies live in localStorage under one key, as an array of trophy ids,
// so progress survives a reload and works with the network off. Export writes
// the same ids to a JSON file; import reads that file back and replaces the set.
// Demo mode (?demo=1) seeds a fixed example set in memory only, so screenshots
// can show a living tracker without touching the reader's saved progress.

export const STORAGE_KEY = 'gta6-trophy-guide-v1';

// A plausible mid-story example set, used only when ?demo=1 is in the URL.
// Thirteen trophies: the opening story beats, a few early activities and the
// first missable-trophy protection done on time.
export const DEMO_EARNED_IDS = [2, 3, 8, 16, 20, 21, 28, 33, 35, 42, 44, 52, 53];

export function loadEarnedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => Number.isInteger(id)));
  } catch {
    return new Set();
  }
}

export function saveEarnedIds(earnedIds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earnedIds].sort((a, b) => a - b)));
  } catch {
    // Private browsing or a full store: the checklist still works in memory.
  }
}

export function clearEarnedIds() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

export function demoEarnedIds() {
  return new Set(DEMO_EARNED_IDS);
}

// Turn an imported JSON value into a set of valid trophy ids. Accepts either
// a bare array of ids, or an object with an "earned" array of ids or names.
export function idsFromImportedData(data, trophiesById, trophiesByName) {
  const rawList = Array.isArray(data) ? data : data?.earned;
  if (!Array.isArray(rawList)) return null;
  const ids = new Set();
  for (const entry of rawList) {
    if (Number.isInteger(entry) && trophiesById.has(entry)) {
      ids.add(entry);
    } else if (typeof entry === 'string' && trophiesByName.has(entry)) {
      ids.add(trophiesByName.get(entry).id);
    }
  }
  return ids;
}
