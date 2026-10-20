import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const vendor = join(dirname(fileURLToPath(import.meta.url)), '..', 'vendor');

/** One palette for every card: deep navy, blue to violet, a cyan accent. */
export const C = {
  card: '#0a0d1c',
  surface: '#11152d',
  surface2: '#161b3a',
  line: '#252b55',
  text: '#e8ebff',
  muted: '#a3abd1',
  faint: '#6c7499',
  blue: '#60a5fa',
  indigo: '#818cf8',
  violet: '#c084fc',
  cyan: '#22d3ee',
  amber: '#fbbf24',
  green: '#34d399',
  red: '#f87171',
};

export const esc = (value) =>
  String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** JetBrains Mono advances 0.6em per character, so mono text can be measured exactly. */
export const monoWidth = (text, size) => text.length * size * 0.6;

const font = (file) => readFileSync(join(vendor, 'fonts', file)).toString('base64');

/**
 * Fonts are embedded: GitHub serves SVGs through a proxy that blocks web
 * fonts. `D` is the display face, `M` the mono one.
 */
const FONT_CSS = [
  ['D', 500, 'display-500.woff2'],
  ['D', 700, 'display-700.woff2'],
  ['M', 500, 'mono-500.woff2'],
  ['M', 700, 'mono-700.woff2'],
]
  .map(
    ([family, weight, file]) =>
      `@font-face{font-family:'${family}';font-weight:${String(weight)};src:url(data:font/woff2;base64,${font(file)}) format('woff2')}`,
  )
  .join('');

/*
 * Shared classes and motion. Every animated element must not carry its own
 * `transform` attribute: a CSS transform would replace it and move the element.
 * Position on an outer <g>, animate an inner one.
 */
const BASE_CSS = `
.d5{font-family:'D','Segoe UI',system-ui,sans-serif;font-weight:500}
.d7{font-family:'D','Segoe UI',system-ui,sans-serif;font-weight:700}
.m5{font-family:'M',ui-monospace,Consolas,monospace;font-weight:500}
.m7{font-family:'M',ui-monospace,Consolas,monospace;font-weight:700}
.label{font-family:'M',ui-monospace,Consolas,monospace;font-weight:700;font-size:12px;letter-spacing:2.4px}
.rise{opacity:0;animation:rise .8s cubic-bezier(.2,.7,.2,1) forwards}
.pulse{animation:pulse 2.2s ease-in-out infinite}
.blink{animation:blink 1s steps(1) infinite}
.float{animation:float 6s ease-in-out infinite alternate}
.drift{animation:drift 14s ease-in-out infinite alternate}
@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:.45}50%{opacity:1}}
@keyframes blink{0%{opacity:1}50%{opacity:0}}
@keyframes float{from{transform:translateY(0)}to{transform:translateY(-10px)}}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(-50px,24px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes spinr{to{transform:rotate(-360deg)}}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes rise-y{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;opacity:1!important;transform:none!important;stroke-dashoffset:0!important}}
`;

/** `animation-delay` for staggered entrances. */
export const delay = (seconds) => `style="animation-delay:${String(seconds)}s"`;

/** Shared gradients, patterns and filters, prefixed so cards never collide. */
function defs(id) {
  return `
  <linearGradient id="${id}-edge" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.cyan}" stop-opacity=".7"/>
    <stop offset=".5" stop-color="${C.indigo}" stop-opacity=".35"/>
    <stop offset="1" stop-color="${C.violet}" stop-opacity=".7"/>
  </linearGradient>
  <linearGradient id="${id}-accent" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.blue}"/>
    <stop offset=".55" stop-color="${C.indigo}"/>
    <stop offset="1" stop-color="${C.violet}"/>
  </linearGradient>
  <radialGradient id="${id}-glow-cyan"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".22"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></radialGradient>
  <radialGradient id="${id}-glow-violet"><stop offset="0" stop-color="${C.violet}" stop-opacity=".2"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/></radialGradient>
  <pattern id="${id}-grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="${C.indigo}" fill-opacity=".14"/></pattern>
  <filter id="${id}-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
}

/** A panel: navy fill, dot grid, gradient edge. Coordinates are the card's own. */
export function panel(id, x, y, width, height, { glows = true } = {}) {
  const clip = `${id}-clip-${String(x)}-${String(y)}`;
  return `
  <clipPath id="${clip}"><rect x="${String(x)}" y="${String(y)}" width="${String(width)}" height="${String(height)}" rx="24"/></clipPath>
  <g clip-path="url(#${clip})">
    <rect x="${String(x)}" y="${String(y)}" width="${String(width)}" height="${String(height)}" fill="${C.card}"/>
    <rect x="${String(x)}" y="${String(y)}" width="${String(width)}" height="${String(height)}" fill="url(#${id}-grid)"/>
    ${
      glows
        ? `<g transform="translate(${String(x + width * 0.18)} ${String(y + 20)})"><circle class="drift" r="${String(Math.max(width, height) * 0.45)}" fill="url(#${id}-glow-cyan)"/></g>
    <g transform="translate(${String(x + width * 0.85)} ${String(y + height)})"><circle class="drift" style="animation-direction:alternate-reverse" r="${String(Math.max(width, height) * 0.5)}" fill="url(#${id}-glow-violet)"/></g>`
        : ''
    }
  </g>
  <rect x="${String(x + 0.75)}" y="${String(y + 0.75)}" width="${String(width - 1.5)}" height="${String(height - 1.5)}" rx="23.5" fill="none" stroke="url(#${id}-edge)" stroke-width="1.5"/>`;
}

/** A complete SVG document. */
export function svg(id, width, height, { title, desc }, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${String(width)} ${String(height)}" width="${String(width)}" height="${String(height)}" role="img" aria-labelledby="${id}-t ${id}-d">
<title id="${id}-t">${esc(title)}</title>
<desc id="${id}-d">${esc(desc)}</desc>
<defs>${defs(id)}</defs>
<style>${FONT_CSS}${BASE_CSS}</style>
${body}
</svg>
`;
}

/** A small "// LABEL" eyebrow and a heading under it. */
export function heading(x, y, label, title, color = C.cyan, size = 30) {
  return `<text class="label" x="${String(x)}" y="${String(y)}" fill="${color}">${esc(label)}</text>
  <text class="d7" x="${String(x)}" y="${String(y + size + 8)}" font-size="${String(size)}" fill="${C.text}">${esc(title)}</text>`;
}
