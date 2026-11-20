// store.js — progress lives in localStorage under one key, so the checklist
// survives a reload and works with no account and no network. Export writes
// the earned names to a file; import reads one back. Nothing here ever
// touches a server.

const EARNED_KEY = 'leonida-trophy-guide-earned-v1';
const SPOILER_KEY = 'leonida-trophy-guide-spoilers-v1';

export function loadEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]');
    return new Set(Array.isArray(raw) ? raw.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned]));
}

export function loadSpoilersHidden() {
  return localStorage.getItem(SPOILER_KEY) === '1';
}

export function saveSpoilersHidden(hidden) {
  localStorage.setItem(SPOILER_KEY, hidden ? '1' : '0');
}

// Builds a download of the earned trophy names as a JSON file.
export function exportProgress(earned) {
  const blob = new Blob([JSON.stringify({ earned: [...earned] }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'leonida-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

// Reads an exported progress file and returns the earned names it holds,
// or throws a plain-English error the UI can show.
export async function importProgress(file) {
  const text = await file.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names) || !names.every((n) => typeof n === 'string')) {
    throw new Error('That file does not hold a list of trophy names.');
  }
  return new Set(names);
}

export function resetProgress() {
  localStorage.removeItem(EARNED_KEY);
  return new Set();
}
