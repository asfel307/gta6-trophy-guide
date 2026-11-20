// Leonida Trophy Guide — hand-in program (Node 22, standard library only).
//
// This program takes the guide that lives beside it — the static app/ folder
// and the screenshots/ renders — and packs them into the output directory the
// grader reads. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The dossier it writes comes from vendor/makefun-frontend.ts, the kit's own
// library, copied byte for byte. That file is never edited: the scorer rebuilds
// the dossier with its own identical copy and the two must match exactly.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The folder this file sits in, so the copy works wherever the repo is checked out.
const here = fileURLToPath(new URL('.', import.meta.url));

// The grader gives us /output; locally we let an env var point somewhere else.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });

// app/ is the whole guide: pages, styles, scripts and the trophy data file.
cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });

// screenshots/ holds the four renders of the guide; the first by name is the cover.
// Fail fast when they are missing, so a hand-in never goes out with no images.
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (!existsSync(join(here, 'screenshots'))) {
  throw new Error('screenshots/ is missing: take the four renders before handing in');
}
cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

// Caps mirror the sealed gate (reference/gate.json): the text cap shapes the
// dossier bytes, the rest refuse anything the scorer would refuse anyway —
// more than 4 screenshots, one over 256 KiB, or an app/ over 993 files / 48 MiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);

console.log(`Leonida Trophy Guide handed in to ${outDir}`);
