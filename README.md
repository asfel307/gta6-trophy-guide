# Leonida Trophy Guide

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/asfel307/gta6-trophy-guide/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/asfel307/gta6-trophy-guide/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: the official list with saved progress, filters and a spoiler setting, a five-stage roadmap to the platinum, missable trophies flagged, and a guide to every trophy in our own words, each with its sources named.

## What it does

- **Checklist of all 55 trophies** — official name, description and grade for each, exactly as PlayStation publishes them (1 platinum, 2 gold, 6 silver, 46 bronze).
- **Saved progress** — tick a trophy and it stays ticked in localStorage; export your progress to a file and import it back.
- **Filters** — by kind (story, strangers & side, collectibles, activities), by grade, by search, and hide-earned.
- **Spoiler setting** — hides the names and descriptions of story trophies until you earn them.
- **Roadmap to the platinum** — five stages in order, built from the official descriptions.
- **Missables flagged** — the trophies that need a moment that may not come back, with why.
- **A guide per trophy** — what to do, where and when it can be missed, with sources cited beside each one.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. The app is plain static files under `app/` — no build step, no network request, no Rockstar logo or artwork.

## Screenshots

The four images under `screenshots/` are real renders of this app in headless Chromium at 1280×800, taken with progress seeded at 13 of 55 earned: the checklist (cover), one trophy's guide with its sources, the roadmap, and the missable trophies.

## An honest note

GTA VI released 19 November 2026, one day before this guide was written. The trophy names, descriptions, grades and PSN counts come from the official list (Exophase / PSNProfiles, 18 Nov 2026). Every guide is written from those descriptions, and any step we have not yet been able to check in the game says so plainly in the guide itself — this guide invents no walkthrough.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `vendor/makefun-frontend.ts`.

## License

MIT — see [LICENSE](LICENSE).
