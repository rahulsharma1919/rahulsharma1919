import { ui } from '../lib/icons.mjs';
import { crowFlock, crowStyles } from '../lib/motifs.mjs';
import { C, delay, esc, heading, panel, svg } from '../lib/theme.mjs';

const W = 1280;
const H = 450;
const HALF = 616;

/** A tiny dashboard that assembles itself: tiles, a chart and a list. */
function browser(x, y, url) {
  const bars = [44, 62, 38, 70, 52, 80, 58, 74, 66];
  return `
  <rect x="${String(x)}" y="${String(y)}" width="552" height="196" rx="12" fill="#0d1126" stroke="${C.line}"/>
  <rect x="${String(x)}" y="${String(y)}" width="552" height="28" rx="12" fill="${C.surface2}"/>
  <rect x="${String(x)}" y="${String(y + 16)}" width="552" height="12" fill="${C.surface2}"/>
  ${[C.red, C.amber, C.green].map((color, i) => `<circle cx="${String(x + 18 + i * 14)}" cy="${String(y + 14)}" r="4.5" fill="${color}"/>`).join('')}
  <rect x="${String(x + 136)}" y="${String(y + 6)}" width="280" height="16" rx="8" fill="${C.card}"/>
  <text class="m5" x="${String(x + 276)}" y="${String(y + 18)}" font-size="10.5" fill="${C.faint}" text-anchor="middle">${esc(url)}</text>

  <!-- Sidebar -->
  <rect x="${String(x + 14)}" y="${String(y + 42)}" width="18" height="18" rx="5" fill="url(#about-accent)"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="${String(x + 14)}" y="${String(y + 74 + i * 20)}" width="${String(i === 1 ? 70 : 56)}" height="8" rx="4" fill="${i === 1 ? C.indigo : C.line}" fill-opacity="${i === 1 ? '.8' : '1'}"/>`).join('')}

  <!-- Stat tiles -->
  ${[C.cyan, C.indigo, C.violet]
    .map(
      (color, i) => `<rect x="${String(x + 104 + i * 146)}" y="${String(y + 42)}" width="134" height="48" rx="8" fill="${C.surface2}"/>
  <rect x="${String(x + 116 + i * 146)}" y="${String(y + 54)}" width="46" height="6" rx="3" fill="${C.line}"/>
  <g transform="translate(${String(x + 116 + i * 146)} ${String(y + 70)})"><rect width="${String(84 - i * 14)}" height="9" rx="4.5" fill="${color}" style="transform-box:fill-box;transform-origin:left;transform:scaleX(0);animation:grow 1s cubic-bezier(.2,.7,.2,1) ${String(0.6 + i * 0.2)}s forwards"/></g>`,
    )
    .join('\n  ')}

  <!-- Chart -->
  <rect x="${String(x + 104)}" y="${String(y + 102)}" width="280" height="82" rx="8" fill="${C.surface2}"/>
  ${bars
    .map(
      (height, i) => `<rect x="${String(x + 120 + i * 29)}" y="${String(y + 176 - height * 0.85)}" width="17" height="${String(height * 0.85)}" rx="3" fill="url(#about-accent)" fill-opacity=".9" style="transform-box:fill-box;transform-origin:bottom;transform:scaleY(0);animation:rise-y .9s cubic-bezier(.2,.7,.2,1) ${String(1 + i * 0.08)}s forwards"/>`,
    )
    .join('\n  ')}

  <!-- List -->
  <rect x="${String(x + 396)}" y="${String(y + 102)}" width="144" height="82" rx="8" fill="${C.surface2}"/>
  ${[0, 1, 2, 3].map((i) => `<rect class="pulse" style="animation-delay:${String(i * 0.3)}s" x="${String(x + 408)}" y="${String(y + 114 + i * 17)}" width="${String(120 - (i % 2) * 30)}" height="8" rx="4" fill="${C.line}"/>`).join('')}`;
}

/** A night skyline with things that float: the off-screen half. */
function scene(x, y) {
  const towers = [
    [0, 64], [38, 92], [70, 52], [104, 110], [146, 74], [182, 96], [220, 58], [254, 120], [300, 80],
    [336, 104], [378, 62], [412, 90], [450, 116], [496, 70], [522, 96],
  ];
  const stars = [[40, 30], [120, 22], [210, 44], [300, 26], [360, 52], [440, 30], [520, 46], [86, 66], [262, 70], [480, 74]];
  return `
  <linearGradient id="about-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0f2e"/><stop offset="1" stop-color="#2a1458"/></linearGradient>
  <clipPath id="about-scene"><rect x="${String(x)}" y="${String(y)}" width="552" height="196" rx="12"/></clipPath>
  <g clip-path="url(#about-scene)">
    <rect x="${String(x)}" y="${String(y)}" width="552" height="196" fill="url(#about-sky)"/>
    ${stars.map(([sx, sy], i) => `<circle class="pulse" style="animation-delay:${String(i * 0.37)}s" cx="${String(x + sx)}" cy="${String(y + sy)}" r="${String(i % 3 === 0 ? 1.8 : 1.2)}" fill="#fff"/>`).join('')}
    <circle cx="${String(x + 478)}" cy="${String(y + 46)}" r="34" fill="${C.violet}" fill-opacity=".18"/>
    <circle cx="${String(x + 478)}" cy="${String(y + 46)}" r="20" fill="#f5f3ff"/>
    <circle cx="${String(x + 470)}" cy="${String(y + 40)}" r="20" fill="#2a1a5c" fill-opacity=".35"/>
    ${towers
      .map(([tx, th], i) => {
        const left = x + tx;
        const top = y + 196 - th;
        const windows = Array.from({ length: Math.floor(th / 18) }, (_, row) =>
          `<rect class="${(i + row) % 3 === 0 ? 'pulse' : ''}" style="animation-delay:${String((i + row) * 0.2)}s" x="${String(left + 8)}" y="${String(top + 10 + row * 18)}" width="5" height="6" fill="${(i + row) % 2 ? C.cyan : C.violet}" fill-opacity=".75"/>`,
        ).join('');
        return `<rect x="${String(left)}" y="${String(top)}" width="30" height="${String(th)}" fill="#120c2e"/>${windows}`;
      })
      .join('\n    ')}
    <rect x="${String(x)}" y="${String(y + 188)}" width="552" height="8" fill="${C.violet}" fill-opacity=".25"/>
    ${crowFlock(x + 306, y + 16)}
  </g>
  ${crowStyles(260, -420)}
  ${[
    ['book', x + 96, y + 52, C.cyan, 0],
    ['gamepad', x + 246, y + 34, C.violet, 1.4],
    ['film', x + 380, y + 62, C.indigo, 0.7],
  ]
    .map(
      ([icon, ix, iy, color, d]) => `<g transform="translate(${String(ix)} ${String(iy)})"><g class="float" style="animation-delay:-${String(d)}s">
    <circle cx="26" cy="26" r="30" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-opacity=".5"/>
    ${ui(icon, 9, 9, 34, color)}
  </g></g>`,
    )
    .join('\n  ')}`;
}

function ring(x, y, item, color, index) {
  const r = 20;
  const length = 2 * Math.PI * r;
  const target = length * (1 - item.share);
  const icon = ['book', 'film', 'gamepad'][index];
  return `
  <rect x="${String(x)}" y="${String(y)}" width="174" height="106" rx="12" fill="${C.surface}" stroke="${C.line}"/>
  <g transform="translate(${String(x + 38)} ${String(y + 53)}) rotate(-90)">
    <circle r="${String(r)}" fill="none" stroke="${C.line}" stroke-width="5"/>
    <circle r="${String(r)}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${length.toFixed(2)}" stroke-dashoffset="${target.toFixed(2)}">
      <animate attributeName="stroke-dashoffset" values="${length.toFixed(2)};${target.toFixed(2)}" dur="1.4s" begin="${String(0.6 + index * 0.2)}s" fill="freeze"/>
    </circle>
  </g>
  ${ui(icon, x + 29, y + 44, 18, color)}
  <text class="d7" x="${String(x + 72)}" y="${String(y + 48)}" font-size="16" fill="${C.text}">${esc(item.label)}</text>
  <text class="m5" x="${String(x + 72)}" y="${String(y + 68)}" font-size="11" fill="${C.faint}">${esc(item.detail)}</text>`;
}

export function about(developer, life) {
  const id = 'about';
  const R = HALF + 48;
  const tones = [C.cyan, C.indigo, C.violet];

  const body = `
  ${panel(id, 0, 0, HALF, H)}
  ${panel(id, R, 0, HALF, H)}

  <g class="rise" ${delay(0.1)}>${heading(32, 46, developer.label, developer.title, C.cyan, 26)}</g>
  <g class="rise" ${delay(0.3)}>${browser(32, 98, developer.url)}</g>
  ${developer.points
    .map(
      (point, i) => `<g class="rise" ${delay(0.8 + i * 0.15)}>
    <rect x="32" y="${String(318 + i * 42)}" width="32" height="32" rx="9" fill="${C.surface2}" stroke="${tones[i]}" stroke-opacity=".5"/>
    ${ui(point.icon, 39, 325 + i * 42, 18, tones[i])}
    <text class="d7" x="78" y="${String(331 + i * 42)}" font-size="15" fill="${C.text}">${esc(point.title)}</text>
    <text class="m5" x="78" y="${String(347 + i * 42)}" font-size="11.5" fill="${C.faint}">${esc(point.detail)}</text>
  </g>`,
    )
    .join('\n  ')}

  <g class="rise" ${delay(0.2)}>${heading(R + 32, 46, life.label, life.title, C.violet, 26)}</g>
  <g class="rise" ${delay(0.4)}>${scene(R + 32, 98)}</g>
  ${life.rings.map((item, i) => `<g class="rise" ${delay(0.8 + i * 0.15)}>${ring(R + 32 + i * 189, 318, item, tones[i], i)}</g>`).join('\n  ')}`;

  return svg(id, W, H, {
    title: 'What I build, and life beyond the code',
    desc: `${developer.title}: ${developer.points.map((p) => `${p.title} (${p.detail})`).join('; ')}. ${life.title}: ${life.rings.map((r) => r.detail).join(', ')}.`,
  }, body);
}
