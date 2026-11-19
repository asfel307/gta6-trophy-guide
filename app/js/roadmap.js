// The roadmap to the platinum and the missables view. Both are built from
// the official trophy descriptions, following PowerPyx's three-step route:
// story first, then the 100% checklist, then Strangers & Freaks and clean-up.

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Before you start: saves and the one missable trophy',
    time: 'Chapter 1',
    text: 'Keep a manual save at the start and end of each chapter — the game has 15 manual slots, 1 autosave slot and no mission replay. In Chapter 1, after the mission Down to Earth, talk to Lucia in the kitchen in the morning, follow her to the balcony at Jason’s house and choose Accept when she offers to meditate. That balcony meditation is gone after Chapter 1 and may be required for Positive Mental Attitude, the only potentially missable trophy. Keep a Chapter 1 save until it pops.',
    trophyIds: [28],
  },
  {
    stage: 2,
    title: 'Play the story: Chapters 1–5',
    time: '60–80 hours',
    text: 'Finish the story in order. Twelve trophies pop automatically: the five chapter trophies, the gold for the final mission, and the named missions Gone Fishing, Breakfast Run, The Cartel Heist, Child’s Play, Headliners, VCIA Takedown and Operation Savage Glory. There are no mission gold medals to chase. Switching between Jason and Lucia opens after Breakfast Run in Chapter 2, which is when the partner trophies become possible. Scan vehicles and study animals as you travel — that progress already counts toward the 100% checklist.',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    stage: 3,
    title: 'Side-character finales',
    time: 'Alongside the story',
    text: 'Six trophies come from finishing optional questlines: Andy (Lucia only, Chapter 3), Kenton (treasure diving, 7 shipwrecks), Billy (Thrillbilly Mudclub, Chapter 2), Randy (deliver 16 sports cars), Tyrone (destroy the Synthetic Labs, Jason only) and Bret (hunting, Jason only). All of them stay available after the story, and quest givers who vanish temporarily always return, so do them as they appear or save them for free-roam.',
    trophyIds: [22, 23, 24, 26, 27, 29],
  },
  {
    stage: 4,
    title: 'The 100% Completion checklist',
    time: 'About 100 hours',
    text: 'After the credits the checklist opens under Progress, then Stats, then 100% Completion. It is lenient — closer to 60% true completion: scan 200 of 277 base-model vehicles, study 100 of 255 animals, finish 70 of 80 challenges, meditate at 15 of 18 spots, do 300 stunts, complete any 100 optional missions, rob all 39 gang operations and all 8 bank vaults, and finish all 15 target decks. Most of it is already part-done from the story. This stage also earns the gold A Long Road and, along the way, the stunt, shooting-range, drone-race, challenge, card-set, WAiNK, vehicle, robbery and money trophies.',
    trophyIds: [14, 15, 17, 18, 19, 30, 31, 32, 35, 40, 41, 42, 43, 52],
  },
  {
    stage: 5,
    title: 'Strangers & Freaks and clean-up',
    time: 'About 10 hours',
    text: 'Finish 8 stranger mission strands — Kirk, Kyle, Yago and Pilot Pete are confirmed to count — and clear whatever is left: the one-off trophies (the VCIA plane, the Rhino tank, the blue Banshee showroom smash, the Ocean Beach cocktail, the UFO easter egg), the two still-unconfirmed ones, and the money trophies (spend $100,000, buy all 8 garages, register 10 vehicles). Do Yago’s Race Against Yago as soon as it appears: it is time-sensitive.',
    trophyIds: [25, 37, 38, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55],
  },
  {
    stage: 6,
    title: 'Platinum: Vice Got a Price!',
    time: 'The moment the last trophy pops',
    text: 'Earn the other 54 trophies and the platinum is yours. No extra task, no multiplayer, no DLC. PowerPyx estimates the whole run at about 200 hours and difficulty 4 out of 10.',
    trophyIds: [1],
  },
];

export function renderRoadmap(roadmapElement, trophiesById, earnedIds) {
  roadmapElement.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const item = document.createElement('li');
    const time = document.createElement('div');
    time.className = 'stage-time';
    time.textContent = `Stage ${stage.stage} · ${stage.time}`;
    const heading = document.createElement('h3');
    heading.textContent = stage.title;
    const text = document.createElement('p');
    text.textContent = stage.text;
    const trophiesLine = document.createElement('p');
    trophiesLine.className = 'stage-trophies';
    const names = stage.trophyIds.map((id) => {
      const trophy = trophiesById.get(id);
      if (!trophy) return '';
      const mark = earnedIds.has(id) ? '✓ ' : '';
      return `${mark}${trophy.name}`;
    });
    trophiesLine.textContent = `Trophies: ${names.join(' · ')}`;
    item.append(time, heading, text, trophiesLine);
    roadmapElement.append(item);
  }
}

// The missables view: the one trophy that can be missed, shown in full, with
// the same guide and sources as the checklist's detail pane.
export function renderMissables(container, trophies, earnedIds, renderDetailInto) {
  container.replaceChildren();
  const missable = trophies.filter((trophy) => trophy.missable);
  if (missable.length === 0) {
    const note = document.createElement('p');
    note.textContent = 'No trophy in this list is missable.';
    container.append(note);
    return;
  }
  for (const trophy of missable) {
    const card = document.createElement('div');
    card.className = 'detail';
    card.style.position = 'static';
    renderDetailInto(card, trophy, earnedIds);
    container.append(card);
  }
}
