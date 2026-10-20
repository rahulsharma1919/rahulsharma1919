import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const vendor = join(dirname(fileURLToPath(import.meta.url)), '..', 'vendor');

/**
 * Two palettes, same roles: ink and steel with a crimson lead, ember for fire.
 * Cards read `C` when they render, so `setTheme` before each build pass.
 */
const PALETTES = {
  dark: {
    mode: 'dark',
    card: '#0c0c10',
    inset: '#101015',
    surface: '#15151b',
    surface2: '#1c1c24',
    line: '#2c2c36',
    text: '#f4f4f5',
    muted: '#a8a8b3',
    faint: '#70707c',
    ash: '#e4e4e7',
    steel: '#94a3b8',
    crimson: '#ef4444',
    ember: '#f97316',
    amber: '#fbbf24',
    green: '#34d399',
    red: '#f87171',
    glow: 0.16,
  },
  light: {
    mode: 'light',
    card: '#ffffff',
    inset: '#fafafa',
    surface: '#f6f6f7',
    surface2: '#ededf0',
    line: '#e0e0e6',
    text: '#18181b',
    muted: '#52525b',
    faint: '#7a7a85',
    ash: '#3f3f46',
    steel: '#475569',
    crimson: '#dc2626',
    ember: '#ea580c',
    amber: '#b45309',
    green: '#047857',
    red: '#dc2626',
    glow: 0.07,
  },
};

export const C = { ...PALETTES.dark };
export const THEMES = Object.keys(PALETTES);
export const setTheme = (name) => Object.assign(C, PALETTES[name]);

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
    <stop offset="0" stop-color="${C.crimson}" stop-opacity=".75"/>
    <stop offset=".5" stop-color="${C.line}"/>
    <stop offset="1" stop-color="${C.steel}" stop-opacity=".6"/>
  </linearGradient>
  <linearGradient id="${id}-accent" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.ember}"/>
    <stop offset=".5" stop-color="${C.crimson}"/>
    <stop offset="1" stop-color="#991b1b"/>
  </linearGradient>
  <radialGradient id="${id}-glow-a"><stop offset="0" stop-color="${C.crimson}" stop-opacity="${String(C.glow)}"/><stop offset="1" stop-color="${C.crimson}" stop-opacity="0"/></radialGradient>
  <radialGradient id="${id}-glow-b"><stop offset="0" stop-color="${C.steel}" stop-opacity="${String(C.glow)}"/><stop offset="1" stop-color="${C.steel}" stop-opacity="0"/></radialGradient>
  <linearGradient id="${id}-name" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.ash}"/><stop offset=".55" stop-color="${C.crimson}"/><stop offset="1" stop-color="#b91c1c"/></linearGradient>
  <pattern id="${id}-grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="${C.steel}" fill-opacity=".14"/></pattern>
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
        ? `<g transform="translate(${String(x + width * 0.18)} ${String(y + 20)})"><circle class="drift" r="${String(Math.max(width, height) * 0.45)}" fill="url(#${id}-glow-a)"/></g>
    <g transform="translate(${String(x + width * 0.85)} ${String(y + height)})"><circle class="drift" style="animation-direction:alternate-reverse" r="${String(Math.max(width, height) * 0.5)}" fill="url(#${id}-glow-b)"/></g>`
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
export function heading(x, y, label, title, color = C.crimson, size = 30) {
  return `<text class="label" x="${String(x)}" y="${String(y)}" fill="${color}">${esc(label)}</text>
  <text class="d7" x="${String(x)}" y="${String(y + size + 8)}" font-size="${String(size)}" fill="${C.text}">${esc(title)}</text>`;
}
