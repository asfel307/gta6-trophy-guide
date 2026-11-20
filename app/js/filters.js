// filters.js — which trophies the checklist shows, and the spoiler rule.
// A trophy passes when it matches the search text, the kind filter, the grade
// filter, and (when asked) is not already earned. Spoilers are a display rule,
// not a filter: a hidden story trophy still shows, with its name and
// description replaced until it is earned.

export function applyFilters(trophies, earned, options) {
  const query = (options.search ?? '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (options.kind !== 'all' && t.kind !== options.kind) return false;
    if (options.grade !== 'all' && t.grade !== options.grade) return false;
    if (options.hideEarned && earned.has(t.name)) return false;
    if (query && !`${t.name} ${t.description}`.toLowerCase().includes(query)) return false;
    return true;
  });
}

// The spoiler rule: story trophies stay masked while unearned. Missable and
// collectible trophies are never masked — their names say nothing about the
// story. Earned trophies are always shown in full.
export function isSpoilerHidden(trophy, earned, spoilersOn) {
  return spoilersOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

export function displayName(trophy, earned, spoilersOn) {
  return isSpoilerHidden(trophy, earned, spoilersOn) ? 'Hidden story trophy' : trophy.name;
}

export function displayDescription(trophy, earned, spoilersOn) {
  return isSpoilerHidden(trophy, earned, spoilersOn)
    ? 'Earn this trophy to reveal its name and description.'
    : trophy.description;
}
