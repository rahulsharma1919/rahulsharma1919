// One-off: downloads the brand icons, fonts and avatar the cards embed, into
// scripts/vendor/. Committed, so every build is offline and reproducible.
// Run again only after adding an icon or changing a font: `node scripts/fetch-vendor.mjs`.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const vendor = join(here, 'vendor');
const SIMPLE_ICONS = '16.35.0';
const USERNAME = 'rahulsharma1919';

/** Simple Icons slugs. Tools it has no icon for get a drawn glyph in lib/icons.mjs. */
const SLUGS = [
  'react', 'nextdotjs', 'typescript', 'javascript', 'mui', 'tailwindcss', 'bootstrap', 'vite',
  'html5', 'css', 'gsap', 'framer', 'postgresql', 'mysql', 'mongodb', 'firebase', 'drizzle',
  'nodedotjs', 'nestjs', 'graphql', 'vitest', 'postman', 'claude', 'googlegemini', 'vercel',
  'cloudflare', 'render', 'neon', 'netlify', 'git', 'github', 'githubactions', 'figma', 'x',
  'leetcode', 'gmail', 'instagram',
];

/** Every character the cards print, so the embedded fonts carry nothing else. */
const GLYPHS =
  Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('') + '·—–’“”•→←✓★●▸…×';

const FONTS = [
  { file: 'display-500.woff2', family: 'Space Grotesk', weight: 500 },
  { file: 'display-700.woff2', family: 'Space Grotesk', weight: 700 },
  { file: 'mono-500.woff2', family: 'JetBrains Mono', weight: 500 },
  { file: 'mono-700.woff2', family: 'JetBrains Mono', weight: 700 },
];

async function get(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${String(response.status)} for ${url}`);
  return response;
}

async function icons() {
  const base = `https://cdn.jsdelivr.net/npm/simple-icons@${SIMPLE_ICONS}`;
  const data = await (await get(`${base}/data/simple-icons.json`)).json();
  const list = Array.isArray(data) ? data : data.icons;
  const out = {};
  for (const slug of SLUGS) {
    const svg = await (await get(`${base}/icons/${slug}.svg`)).text();
    const path = /<path d="([^"]+)"/.exec(svg)?.[1];
    const title = /<title>([^<]+)<\/title>/.exec(svg)?.[1];
    const entry = list.find((icon) => icon.slug === slug || icon.title === title);
    if (!path || !entry) throw new Error(`No path or colour for ${slug}`);
    out[slug] = { title: entry.title, hex: entry.hex, path };
  }
  await writeFile(join(vendor, 'icons.json'), `${JSON.stringify(out, null, 1)}\n`);
  console.log(`icons: ${String(Object.keys(out).length)}`);
}

async function fonts() {
  await mkdir(join(vendor, 'fonts'), { recursive: true });
  for (const font of FONTS) {
    const css = await (
      await get(
        `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family)}:wght@${String(font.weight)}&text=${encodeURIComponent(GLYPHS)}&display=swap`,
        // A modern user agent, or Google serves TTF instead of WOFF2.
        { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' } },
      )
    ).text();
    const url = /url\((https:[^)]+)\)/.exec(css)?.[1];
    if (!url) throw new Error(`No font URL for ${font.family} ${String(font.weight)}`);
    const bytes = Buffer.from(await (await get(url)).arrayBuffer());
    await writeFile(join(vendor, 'fonts', font.file), bytes);
    console.log(`font ${font.file}: ${String(bytes.length)} bytes`);
  }
}

async function avatar() {
  const bytes = Buffer.from(
    await (await get(`https://avatars.githubusercontent.com/${USERNAME}?s=320`)).arrayBuffer(),
  );
  await writeFile(join(vendor, 'avatar.jpg'), bytes);
  console.log(`avatar: ${String(bytes.length)} bytes`);
}

await mkdir(vendor, { recursive: true });
await icons();
await fonts();
await avatar();
