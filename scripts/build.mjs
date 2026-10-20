// Renders the profile cards into assets/. With GITHUB_TOKEN set, the dashboard
// gets live numbers (and data/stats.json is refreshed); without it, the last
// saved numbers are used, so the build always works offline.
//   node scripts/build.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { about } from './cards/about.mjs';
import { connect } from './cards/connect.mjs';
import { dashboard } from './cards/dashboard.mjs';
import { hero } from './cards/hero.mjs';
import { stack } from './cards/stack.mjs';
import { CONTACTS, DEVELOPER, LIFE, MOTTO, NOW, ORBITS, PROFILE, QUOTE, STACK } from './content.mjs';
import { fetchStats } from './lib/github.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const statsFile = join(root, 'data', 'stats.json');

async function loadStats() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('No GITHUB_TOKEN: using the saved numbers in data/stats.json.');
    return JSON.parse(await readFile(statsFile, 'utf8'));
  }
  const stats = await fetchStats(token, PROFILE.login);
  await writeFile(statsFile, `${JSON.stringify(stats, null, 2)}\n`);
  console.log(`Live stats: ${String(stats.contributions)} contributions, ${String(stats.commits)} commits.`);
  return stats;
}

const stats = await loadStats();
const avatar = (await readFile(join(root, 'scripts', 'vendor', 'avatar.jpg'))).toString('base64');

const cards = {
  'hero.svg': hero(PROFILE, stats),
  'about.svg': about(DEVELOPER, LIFE),
  'stack.svg': stack(STACK, ORBITS),
  'dashboard.svg': dashboard(PROFILE, stats, NOW, avatar),
  'connect.svg': connect(CONTACTS, QUOTE, MOTTO),
};

for (const [file, content] of Object.entries(cards)) {
  await writeFile(join(root, 'assets', file), content);
  console.log(`assets/${file}: ${(content.length / 1024).toFixed(1)} KB`);
}
