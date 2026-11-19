// Filtering for the trophy checklist: by search text, kind, grade and earned
// state. One pure function, so the list, the counters and the screenshots all
// agree on what "filtered" means.

export const KIND_LABELS = {
  story: 'Story',
  side: 'Side quests',
  collectibles: 'Collectibles',
  activities: 'Activities',
  robbery: 'Robberies',
  exploration: 'Exploration',
  completion: '100% Completion',
  platinum: 'Platinum',
  missable: 'Missable',
  online: 'Online',
};

// A story trophy counts as a spoiler while it is still unearned and the
// reader has the spoiler setting on. Earned story trophies are always shown.
export function isSpoilerHidden(trophy, earnedIds, hideSpoilers) {
  return hideSpoilers && trophy.kind === 'story' && !earnedIds.has(trophy.id);
}

export function filterTrophies(trophies, options) {
  const { search, kind, grade, earnedFilter, earnedIds } = options;
  const needle = (search || '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (kind === 'online') return false; // This list has no online trophies.
    if (kind === 'missable' && !trophy.missable) return false;
    if (kind !== 'all' && kind !== 'missable' && trophy.kind !== kind) return false;
    if (grade !== 'all' && trophy.grade !== grade) return false;
    if (earnedFilter === 'earned' && !earnedIds.has(trophy.id)) return false;
    if (earnedFilter === 'unearned' && earnedIds.has(trophy.id)) return false;
    if (needle) {
      const haystack = `${trophy.name} ${trophy.description}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

export function countByGrade(trophies, earnedIds) {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const trophy of trophies) {
    counts[trophy.grade][1] += 1;
    if (earnedIds.has(trophy.id)) counts[trophy.grade][0] += 1;
  }
  return counts;
}

export function countByKind(trophies, earnedIds) {
  const counts = new Map();
  for (const trophy of trophies) {
    const entry = counts.get(trophy.kind) || [0, 0];
    entry[1] += 1;
    if (earnedIds.has(trophy.id)) entry[0] += 1;
    counts.set(trophy.kind, entry);
  }
  return counts;
}
