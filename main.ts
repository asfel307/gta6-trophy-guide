// Leonida Trophy Guide — the program that hands the guide in.
//
// Node 22, standard library only. It takes the guide as it sits in this
// repository (app/ and screenshots/) and lays it out for the grader: app/
// and screenshots/ copied into the output directory, plus dossier.json,
// the summary the judge reads, built with the vendored make.fun library.
//
// The output directory is /output inside the grader's container. Anywhere
// else, MAKEFUN_OUTPUT_DIR stands in for it:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The two runs the grader does must write identical bytes, so nothing here
// depends on the clock, on randomness, or on the order the filesystem
// happens to list files in.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message) {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

const appDir = join(repoRoot, 'app');
const shotsDir = join(repoRoot, 'screenshots');
if (!existsSync(appDir)) fail('app/ is missing from the repository');
if (!existsSync(shotsDir)) fail('screenshots/ is missing from the repository');

// Count what we are handing in, so a mistake shows up here instead of in
// the grader's sealed run.
const shotFiles = readdirSync(shotsDir).filter((name) => statSync(join(shotsDir, name)).isFile());
if (shotFiles.length < 3 || shotFiles.length > 4) {
  fail(`expected 3 or 4 screenshots, found ${shotFiles.length}`);
}

mkdirSync(outputDir, { recursive: true });
cpSync(appDir, join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });

// The scorer's own caps, as the starter documents them: the text cap shapes
// the dossier's bytes, the others refuse an entry the scorer would refuse
// (more than 4 screenshots or one over 256 KiB; app/ over 993 files and
// directories or 48 MiB; the whole output under the platform's 1,000-entry
// and 64 MiB caps, which app/, screenshots/ and dossier.json share).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);

// Say what was handed in, with the dossier's size, so a run that wrote
// nothing useful is obvious from its own output.
const dossierBytes = statSync(join(outputDir, 'dossier.json')).size;
console.log(`Leonida Trophy Guide handed in: ${shotFiles.length} screenshots, dossier ${dossierBytes} bytes at ${join(outputDir, 'dossier.json')}`);
