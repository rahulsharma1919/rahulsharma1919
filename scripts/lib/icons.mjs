import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { C } from './theme.mjs';

const BRANDS = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'vendor', 'icons.json'), 'utf8'),
);

/** Relative luminance of a hex colour, 0 (black) to 1 (white). */
function luminance(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Drawn for tools Simple Icons has no mark for. 24×24, their own colours. */
const glyphs = () => ({
  restapi: `<path d="M8 3.5c-2 0-3 1-3 3v2.5c0 1-1 2-2 2v2c1 0 2 1 2 2V17.5c0 2 1 3 3 3M16 3.5c2 0 3 1 3 3v2.5c0 1 1 2 2 2v2c-1 0-2 1-2 2V17.5c0 2-1 3-3 3" fill="none" stroke="${C.crimson}" stroke-width="2" stroke-linecap="round"/>`,
  playwright: `<circle cx="9" cy="12" r="6.5" fill="#2EAD33"/><circle cx="15.5" cy="12" r="6.5" fill="#E2574C" fill-opacity=".9"/>`,
  codex: `<rect x="2.5" y="4" width="19" height="16" rx="3.5" fill="none" stroke="${C.text}" stroke-width="1.8"/><path d="M7 9.5l3 2.5-3 2.5M12.5 15h4.5" fill="none" stroke="${C.text}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  antigravity: `<ellipse cx="12" cy="16" rx="9.5" ry="3.6" fill="none" stroke="#4285F4" stroke-width="1.7"/><path d="M12 15V3.5M7.8 7.7L12 3.5l4.2 4.2" fill="none" stroke="#34A853" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  stitch: `<path d="M3 17.5l4.5-11 4.5 11 4.5-11 4.5 11" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  linkedin: `<rect x="2" y="2" width="20" height="20" rx="4.5" fill="#0A66C2"/><path d="M7.5 10.5v6.5M7.5 7.3v.1M11.2 17v-6.5m0 3c0-2 1.2-3 2.6-3s2.4 1 2.4 3V17" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
});

/** Brand colours too close to the card (dark on dark, light on light) can't be seen. */
const unreadable = (hex) => (C.mode === 'dark' ? luminance(hex) < 0.12 : luminance(hex) > 0.7);

/** A brand mark at (x, y), `size` square. Unreadable brand colours fall back to text. */
export function brand(slug, x, y, size, colorOverride) {
  const box = `x="${String(x)}" y="${String(y)}" width="${String(size)}" height="${String(size)}" viewBox="0 0 24 24"`;
  const glyph = glyphs()[slug];
  if (glyph) return `<svg ${box}>${glyph}</svg>`;
  const icon = BRANDS[slug];
  if (!icon) throw new Error(`No icon for ${slug}`);
  const color = colorOverride ?? (unreadable(icon.hex) ? C.text : `#${icon.hex}`);
  return `<svg ${box}><path fill="${color}" d="${icon.path}"/></svg>`;
}

/** The colour a brand reads as on the card, for chip borders and glows. */
export function brandColor(slug) {
  const custom = { restapi: C.crimson, playwright: '#2EAD33', codex: C.text, antigravity: '#4285F4', stitch: '#F59E0B', linkedin: '#0A66C2' };
  if (custom[slug]) return custom[slug];
  const hex = BRANDS[slug]?.hex ?? 'a3abd1';
  return unreadable(hex) ? C.muted : `#${hex}`;
}

/** Line icons for the cards themselves (24×24 strokes). */
const UI = {
  pin: '<path d="M12 21s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.3"/>',
  cap: '<path d="M2 9.5L12 4.5l10 5-10 5-10-5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/>',
  bolt: '<path d="M13 2.5L4.5 14H11l-1 7.5L18.5 10H12l1-7.5z"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M9 9v11"/>',
  wave: '<path d="M2 12c2.2-4.5 4.3-4.5 6.5 0s4.3 4.5 6.5 0 4.3-4.5 6.5 0"/>',
  database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  book: '<path d="M3.5 5h5.5a3 3 0 0 1 3 3v12a2.3 2.3 0 0 0-2.3-2.3H3.5z"/><path d="M20.5 5H15a3 3 0 0 0-3 3v12a2.3 2.3 0 0 1 2.3-2.3h6.2z"/>',
  film: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7.5 4v16M16.5 4v16M3 9h4.5M3 15h4.5M16.5 9H21M16.5 15H21"/>',
  gamepad: '<path d="M6.5 8h11a4.5 4.5 0 0 1 4.5 4.5v.7a3.3 3.3 0 0 1-6 1.9L14.5 13.5h-5L8 15.1a3.3 3.3 0 0 1-6-1.9v-.7A4.5 4.5 0 0 1 6.5 8z"/><path d="M7.5 10.5v3.5M5.8 12.2h3.4"/><path d="M16 11h.01M18 13h.01"/>',
  code: '<path d="M8.5 6L2.5 12l6 6M15.5 6l6 6-6 6"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  repo: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/>',
  commit: '<circle cx="12" cy="12" r="3.5"/><path d="M2 12h6.5M15.5 12H22"/>',
  pr: '<circle cx="6" cy="5.5" r="2.5"/><circle cx="6" cy="18.5" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M6 8v8M18 16V9.5a3 3 0 0 0-3-3h-4M13 4l-2.5 2.5L13 9"/>',
  flame: '<path d="M12 21.5c-4 0-7-2.8-7-6.6 0-3.4 2.6-5.5 3.6-8.4.9 1.4 1.5 2.4 2.9 2.9C12.3 6.5 13 4.2 15 2.5c.4 3 4 5.7 4 11 0 4.6-3 8-7 8z"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
};

export function ui(name, x, y, size, color, width = 1.8) {
  if (!UI[name]) throw new Error(`No UI icon ${name}`);
  return `<svg x="${String(x)}" y="${String(y)}" width="${String(size)}" height="${String(size)}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${String(width)}" stroke-linecap="round" stroke-linejoin="round">${UI[name]}</svg>`;
}
