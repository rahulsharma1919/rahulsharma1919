import { ui } from '../lib/icons.mjs';
import { tomoeRing } from '../lib/motifs.mjs';
import { C, delay, esc, monoWidth, panel, svg } from '../lib/theme.mjs';

const W = 1280;
const H = 420;

/** Code fragments drifting around the monogram: half frontend, half database. */
const tokens = () => [
  { text: '<div/>', x: 870, y: 92, color: C.crimson, d: 0 },
  { text: 'SELECT *', x: 1102, y: 110, color: C.amber, d: 1.2 },
  { text: 'useState()', x: 856, y: 318, color: C.steel, d: 0.6 },
  { text: 'JOIN', x: 1150, y: 300, color: C.ember, d: 1.8 },
  { text: '{ }', x: 1180, y: 196, color: C.ash, d: 2.4 },
];

export function hero(profile, stats) {
  const id = 'hero';
  const typedWidth = Math.round(monoWidth(profile.typed, 22));
  const hex = 'M0,-80 L69.3,-40 L69.3,40 L0,80 L-69.3,40 L-69.3,-40 Z';

  const body = `
  <clipPath id="hero-typed"><rect x="96" y="262" width="${String(typedWidth)}" height="34">
    <animate attributeName="width" values="0;${String(typedWidth)}" dur="2.4s" begin="0s" fill="freeze"/>
  </rect></clipPath>
  ${panel(id, 0, 0, W, H)}

  <!-- Status -->
  <g class="rise" ${delay(0.1)}>
    <rect x="64" y="48" width="168" height="30" rx="15" fill="${C.green}" fill-opacity=".1" stroke="${C.green}" stroke-opacity=".45"/>
    <circle class="pulse" cx="84" cy="63" r="4.5" fill="${C.green}"/>
    <text class="label" x="98" y="67.5" font-size="11" fill="${C.green}">${esc(profile.status)}</text>
  </g>

  <text class="d5 rise" ${delay(0.2)} x="64" y="128" font-size="28" fill="${C.muted}">Hi there, I’m</text>
  <g class="rise" ${delay(0.35)}>
    <text class="d7" x="62" y="208" font-size="84" fill="url(#hero-name)" opacity=".45" filter="url(#hero-glow)">${esc(profile.name)}</text>
    <text class="d7" x="62" y="208" font-size="84" fill="url(#hero-name)">${esc(profile.name)}</text>
  </g>
  <g transform="translate(64 228)"><rect class="rise" ${delay(0.7)} width="150" height="4" rx="2" fill="url(#hero-accent)"/></g>

  <!-- Typed role -->
  <text class="m7" x="64" y="286" font-size="22" fill="${C.crimson}">›</text>
  <text class="m5" x="96" y="286" font-size="22" fill="${C.text}" clip-path="url(#hero-typed)">${esc(profile.typed)}</text>
  <rect class="blink" x="${String(100 + typedWidth)}" y="267" width="11" height="24" fill="${C.crimson}" fill-opacity=".85"/>

  <g class="rise" ${delay(0.9)}>
    ${profile.pitch.map((line, i) => `<text class="d5" x="64" y="${String(330 + i * 26)}" font-size="18" fill="${C.muted}">${esc(line)}</text>`).join('\n    ')}
  </g>

  <!-- Meta -->
  <g class="rise" ${delay(1.1)}>
    ${ui('pin', 64, 380, 18, C.crimson)}<text class="m5" x="90" y="394" font-size="14" fill="${C.muted}">${esc(profile.location)}</text>
    ${ui('cap', 236, 380, 18, C.steel)}<text class="m5" x="262" y="394" font-size="14" fill="${C.muted}">${esc(profile.education)}</text>
    ${ui('bolt', 478, 380, 18, C.amber)}<text class="m5" x="504" y="394" font-size="14" fill="${C.muted}">${esc(stats.contributions.toLocaleString('en-US'))} contributions in the last year</text>
  </g>

  <!-- Hologram: the monogram -->
  <g class="rise" ${delay(0.4)}>
    <rect x="830" y="40" width="400" height="340" rx="18" fill="${C.surface}" fill-opacity=".55" stroke="${C.line}"/>
    ${[
      [846, 56, 1, 1],
      [1214, 56, -1, 1],
      [846, 364, 1, -1],
      [1214, 364, -1, -1],
    ]
      .map(([x, y, sx, sy]) => `<path d="M${String(x)},${String(y + sy * 22)} V${String(y)} H${String(x + sx * 22)}" fill="none" stroke="${C.text}" stroke-opacity=".7" stroke-width="2"/>`)
      .join('')}
  </g>
  <g transform="translate(1030 200)">
    <g style="animation:spin 26s linear infinite">
      <circle r="132" fill="none" stroke="${C.steel}" stroke-opacity=".35" stroke-dasharray="4 9"/>
      ${tomoeRing(132, 'hero-glow')}
    </g>
    <g style="animation:spinr 18s linear infinite">
      <circle r="104" fill="none" stroke="${C.ember}" stroke-opacity=".3" stroke-dasharray="2 7"/>
      <circle cx="-104" r="3.5" fill="${C.ember}"/>
    </g>
    <circle r="96" fill="url(#hero-glow-a)"/>
    <path d="${hex}" fill="${C.card}" fill-opacity=".6" stroke="url(#hero-accent)" stroke-width="4" stroke-linejoin="round"
          stroke-dasharray="500" stroke-dashoffset="500" style="animation:draw 2.2s ease-out .3s forwards" filter="url(#hero-glow)"/>
    <text class="d7 rise" ${delay(0.9)} x="0" y="25" font-size="70" text-anchor="middle" fill="url(#hero-name)">RS</text>
  </g>
  ${tokens().map(
    (token) => `<g transform="translate(${String(token.x)} ${String(token.y)})"><text class="m5 float" style="animation-delay:-${String(token.d)}s" font-size="14" fill="${token.color}" fill-opacity=".85" text-anchor="middle">${esc(token.text)}</text></g>`,
  ).join('\n  ')}

  <!-- HUD footer -->
  <circle class="pulse" cx="860" cy="352" r="4.5" fill="${C.red}"/>
  <text class="label" x="872" y="356" font-size="11" fill="${C.text}">LIVE</text>
  <text class="m5" x="1200" y="356" font-size="11" fill="${C.faint}" text-anchor="end">RS.PORTFOLIO · v3</text>
  <g transform="translate(846 366)">
    <rect width="368" height="3" rx="1.5" fill="${C.line}"/>
    <rect width="368" height="3" rx="1.5" fill="url(#hero-accent)" style="transform-box:fill-box;transform-origin:left;animation:grow 4s ease-in-out infinite alternate"/>
  </g>`;

  return svg(id, W, H, {
    title: `${profile.name}, ${profile.role}`,
    desc: `${profile.typed}. ${profile.pitch.join(' ')} ${profile.location}. ${profile.education}.`,
  }, body);
}
