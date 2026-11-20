// roadmap.js — the five stages to the platinum, built from the official
// trophy descriptions: story first, stranger strands second, collectibles
// third, the long grinds fourth, platinum last. Each stage names the trophies
// it covers so the reader can check the plan against the checklist.

export const STAGES = [
  {
    title: 'Stage 1 — Play the story',
    count: '13 trophies: 12 story + the choices trophy',
    text: 'Play Chapters 1–4 and the final mission in order. This earns every chapter trophy, every named-mission trophy and the platinum’s gold story trophy.',
    trophies: [
      'Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!',
      'Top Of The World, Ma', 'You Gotta Know When to Get Off', 'Trust', 'Break the Bank',
      'Family Matters', 'DWNFALL', 'Hi-Jacked', 'Snow Storm', 'Actions Speak Louder',
    ],
    tip: 'On the way, do the missables the moment they appear: Hot Together, Retail Therapy, Catch Me If You Can and Sneakthief all need a partner, a place or a quiet approach you may not get back.',
  },
  {
    title: 'Stage 2 — Strangers & side strands',
    count: '8 trophies',
    text: 'Meet the strangers of Leonida and finish their strands: Andy, Kenton, Billy, Randy and Tyrone each end in a final mission with its own trophy, and finishing 8 strands earns the silver.',
    trophies: [
      'Road to Rehabilitation', 'This Was No Boat Accident', 'The Lone Rider',
      'Supply & Demand', 'Spin On This!', 'Strangers & Freaks', 'Fair Game',
      'Baited My Tackle',
    ],
    tip: 'Stranger markers appear as you explore, so sweep each region of the map between story chapters rather than saving them all for the end.',
  },
  {
    title: 'Stage 3 — Collectibles & the map',
    count: '10 trophies',
    text: 'Sweep Leonida for what is hidden in it: card sets, meditation spots, WAiNK It locations, vehicles, garage properties and every one of the 52 areas.',
    trophies: [
      "Don't Touch My Deck", 'You WAiNKer!', 'Positive Mental Attitude', 'Whip It Good',
      'The Goodtime State', 'Little Boxes', 'On the Spot', 'Top Fun',
      'Earn Cash, Not Kudos', 'The Shootist',
    ],
    tip: 'Do the shooting range and the races here too — 42 gold medals and 20 different race wins are skill work, best done while your aim is warm.',
  },
  {
    title: 'Stage 4 — The long grinds',
    count: '8 trophies',
    text: 'The counts that only move with time: 250 stunts, 50 challenges, 5 bank vaults, 9 gang operations, $250,000 laundered and $100,000 spent, plus 100% completion itself.',
    trophies: [
      'Cunning Stunts', 'One Last Thing', 'Maximum Withdrawal', 'Pest Control',
      'Dime on the Dollar', 'Treat Yo Self', 'A Long Road', 'Master of None',
    ],
    tip: 'Check the in-game completion list before this stage: it shows exactly which category is holding back 100%, so you grind the right thing.',
  },
  {
    title: 'Stage 5 — Platinum',
    count: '1 trophy',
    text: 'When the other 54 are ticked, Vice Got a Price! unlocks on its own. There is nothing left to do but enjoy being a Leonida Legend.',
    trophies: ['Vice Got a Price!'],
    tip: 'If anything is still unticked, the checklist filter “Hide earned” shows exactly what is left.',
  },
];

// Renders the stages into a <ol> and marks, per stage, how many of its
// trophies the reader has already earned.
export function renderStages(listElement, trophies, earned) {
  listElement.replaceChildren();
  for (const stage of STAGES) {
    const li = document.createElement('li');
    li.className = 'stage';
    const done = stage.trophies.filter((name) => earned.has(name)).length;
    const title = document.createElement('h3');
    title.textContent = stage.title;
    const count = document.createElement('p');
    count.className = 'stage-count';
    count.textContent = `${stage.count} — ${done} of ${stage.trophies.length} earned`;
    const text = document.createElement('p');
    text.textContent = stage.text;
    const names = document.createElement('ul');
    for (const name of stage.trophies) {
      const item = document.createElement('li');
      const trophy = trophies.find((t) => t.name === name);
      item.textContent = earned.has(name) ? `✓ ${name}` : name;
      if (trophy) item.textContent += ` — ${trophy.description}`;
      names.append(item);
    }
    const tip = document.createElement('p');
    tip.textContent = `Tip: ${stage.tip}`;
    li.append(title, count, text, names, tip);
    listElement.append(li);
  }
}
