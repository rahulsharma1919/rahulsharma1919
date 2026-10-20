import { brand } from '../lib/icons.mjs';
import { C, delay, esc, panel, svg } from '../lib/theme.mjs';

const W = 1280;
const H = 330;

/** Pictures can't hold links on GitHub; the README puts real link badges under this. */
export function connect(contacts, quote, motto) {
  const id = 'connect';
  const hex = 'M0,-70 L60.6,-35 L60.6,35 L0,70 L-60.6,35 L-60.6,-35 Z';
  const tiles = contacts
    .map((contact, i) => {
      const x = 340 + (i % 2) * 452;
      const y = 150 + Math.floor(i / 2) * 72;
      return `<g class="rise" ${delay(0.4 + i * 0.1)}>
    <rect x="${String(x)}" y="${String(y)}" width="436" height="60" rx="14" fill="${C.surface}" stroke="${C.line}"/>
    <rect x="${String(x + 12)}" y="${String(y + 11)}" width="38" height="38" rx="10" fill="${C.surface2}"/>
    ${brand(contact.icon, x + 21, y + 20, 20)}
    <text class="d7" x="${String(x + 64)}" y="${String(y + 27)}" font-size="15" fill="${C.text}">${esc(contact.title)}</text>
    <text class="m5" x="${String(x + 64)}" y="${String(y + 45)}" font-size="12" fill="${C.faint}">${esc(contact.handle)}</text>
  </g>`;
    })
    .join('\n  ');

  const body = `
  <linearGradient id="connect-name" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.blue}"/><stop offset="1" stop-color="${C.violet}"/></linearGradient>
  ${panel(id, 0, 0, W, H)}
  <g transform="translate(170 165)">
    <circle r="120" fill="url(#connect-glow-violet)"/>
    <g style="animation:spin 30s linear infinite">
      <circle r="112" fill="none" stroke="${C.indigo}" stroke-opacity=".35" stroke-dasharray="3 8"/>
      <circle cx="112" r="4" fill="${C.cyan}" filter="url(#connect-glow)"/>
    </g>
    <path d="${hex}" fill="${C.card}" fill-opacity=".6" stroke="url(#connect-accent)" stroke-width="3.5" stroke-linejoin="round"
          stroke-dasharray="440" stroke-dashoffset="440" style="animation:draw 2s ease-out .2s forwards" filter="url(#connect-glow)"/>
    <text class="d7 rise" ${delay(0.7)} y="22" font-size="60" fill="url(#connect-name)" text-anchor="middle">RS</text>
  </g>

  <g class="rise" ${delay(0.1)}>
    <text class="label" x="340" y="56" fill="${C.violet}">// LET’S CONNECT</text>
    <text class="d7" x="340" y="96" font-size="32" fill="${C.text}">Let’s build something together</text>
    <text class="d5" x="340" y="126" font-size="16" fill="${C.muted}">Open to frontend roles, freelance work and good ideas.</text>
  </g>
  ${tiles}
  <text class="m5 rise" ${delay(0.9)} x="340" y="312" font-size="13" fill="${C.violet}">“${esc(quote)}”</text>
  <text class="m5 rise" ${delay(1)} x="1228" y="312" font-size="13" fill="${C.faint}" text-anchor="end">“${esc(motto)}”</text>`;

  return svg(id, W, H, {
    title: 'Let’s connect',
    desc: `Contact: ${contacts.map((c) => `${c.title} ${c.handle}`).join(', ')}.`,
  }, body);
}
