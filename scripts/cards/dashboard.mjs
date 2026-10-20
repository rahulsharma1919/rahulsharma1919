import { ui } from '../lib/icons.mjs';
import { perchedCrow } from '../lib/motifs.mjs';
import { C, delay, esc, panel, svg } from '../lib/theme.mjs';

const W = 1280;
const H = 480;

const fmt = (value) => Number(value).toLocaleString('en-US');

/** The ID card on a lanyard, swinging a few degrees about the clip. */
function badge(profile, stats, avatar) {
  const cx = 230;
  const bars = Array.from({ length: 30 }, (_, i) => `<rect x="${String(112 + i * 4.3)}" y="414" width="${String(i % 3 === 0 ? 2.4 : 1.2)}" height="16" fill="${C.text}" fill-opacity=".7"/>`).join('');
  return `
  <g style="transform-origin:${String(cx)}px 0px;animation:swing 5s ease-in-out infinite alternate">
    <path d="M${String(cx - 16)},0 L${String(cx - 8)},80 M${String(cx + 16)},0 L${String(cx + 8)},80" stroke="url(#dashboard-accent)" stroke-width="12" stroke-linecap="round"/>
    <rect x="${String(cx - 18)}" y="74" width="36" height="22" rx="6" fill="${C.faint}"/>
    <rect x="${String(cx - 10)}" y="80" width="20" height="10" rx="3" fill="${C.card}"/>
    <rect x="90" y="92" width="280" height="360" rx="20" fill="${C.surface}" stroke="url(#dashboard-edge)" stroke-width="1.5"/>
    ${perchedCrow(318, 73, 30)}
    <rect x="112" y="112" width="28" height="20" rx="4" fill="${C.amber}" fill-opacity=".85"/>
    <path d="M112 122h28M126 112v20" stroke="${C.card}" stroke-opacity=".5"/>
    <text class="label" x="150" y="126" font-size="10" fill="${C.crimson}">DEVELOPER ID</text>
    <text class="m5" x="348" y="126" font-size="10" fill="${C.faint}" text-anchor="end">v3.0</text>

    <clipPath id="dashboard-photo"><rect x="166" y="146" width="128" height="128" rx="26"/></clipPath>
    <rect x="162" y="142" width="136" height="136" rx="29" fill="none" stroke="url(#dashboard-accent)" stroke-width="3"/>
    <image href="data:image/jpeg;base64,${avatar}" x="166" y="146" width="128" height="128" clip-path="url(#dashboard-photo)" preserveAspectRatio="xMidYMid slice"/>

    <text class="d7" x="${String(cx)}" y="306" font-size="24" fill="${C.text}" text-anchor="middle">${esc(profile.name)}</text>
    <text class="label" x="${String(cx)}" y="326" font-size="10.5" fill="${C.steel}" text-anchor="middle">${esc(profile.role.toUpperCase())}</text>

    ${[
      ['BASE', 'Noida, IN', 112, 350],
      ['FOCUS', 'React · SQL', 240, 350],
      ['ID', profile.idNumber, 112, 386],
      ['SINCE', stats.activeSince, 240, 386],
    ]
      .map(([label, value, x, y]) => `<text class="m5" x="${String(x)}" y="${String(y)}" font-size="9.5" fill="${C.faint}" letter-spacing="1.5">${label}</text>
    <text class="m7" x="${String(x)}" y="${String(y + 16)}" font-size="12.5" fill="${C.text}">${esc(value)}</text>`)
      .join('\n    ')}
    ${bars}
    <circle class="pulse" cx="117" cy="442" r="3.5" fill="${C.green}"/>
    <text class="m7" x="126" y="445.5" font-size="9.5" fill="${C.green}" letter-spacing="1.2">${esc(profile.status)}</text>
    <text class="m5" x="348" y="445.5" font-size="9.5" fill="${C.faint}" text-anchor="end">@${esc(profile.login)}</text>
  </g>`;
}

function tile(x, y, width, { value, label, icon, color, note }, index) {
  return `<g class="rise" ${delay(0.4 + index * 0.1)}>
    <rect x="${String(x)}" y="${String(y)}" width="${String(width)}" height="104" rx="14" fill="${C.surface}" stroke="${C.line}"/>
    <rect x="${String(x + 18)}" y="${String(y + 16)}" width="28" height="3" rx="1.5" fill="${color}"/>
    ${ui(icon, x + width - 38, y + 14, 20, color)}
    <text class="d7" x="${String(x + 18)}" y="${String(y + 66)}" font-size="38" fill="${C.text}">${esc(value)}</text>
    ${note ? `<text class="m5" x="${String(x + width - 18)}" y="${String(y + 66)}" font-size="11" fill="${color}" text-anchor="end">${esc(note)}</text>` : ''}
    <text class="m7" x="${String(x + 18)}" y="${String(y + 90)}" font-size="10" fill="${C.faint}" letter-spacing="1.6">${esc(label)}</text>
  </g>`;
}

function languages(x, y, stats) {
  const top = stats.languages[0]?.share ?? 1;
  const rows = stats.languages
    .map((language, i) => {
      const width = Math.max(6, (language.share / top) * 280);
      return `<text class="m5" x="${String(x + 20)}" y="${String(y + 64 + i * 27)}" font-size="13" fill="${C.text}">${esc(language.name)}</text>
    <rect x="${String(x + 130)}" y="${String(y + 55 + i * 27)}" width="280" height="9" rx="4.5" fill="${C.line}"/>
    <rect x="${String(x + 130)}" y="${String(y + 55 + i * 27)}" width="${width.toFixed(1)}" height="9" rx="4.5" fill="${language.color}" style="transform-box:fill-box;transform-origin:left;transform:scaleX(0);animation:grow 1.1s cubic-bezier(.2,.7,.2,1) ${String(0.8 + i * 0.12)}s forwards"/>
    <text class="m7" x="${String(x + 470)}" y="${String(y + 64 + i * 27)}" font-size="12" fill="${C.muted}" text-anchor="end">${(language.share * 100).toFixed(1)}%</text>`;
    })
    .join('\n    ');
  return `<g class="rise" ${delay(0.7)}>
    <rect x="${String(x)}" y="${String(y)}" width="496" height="208" rx="16" fill="${C.surface}" stroke="${C.line}"/>
    <text class="label" x="${String(x + 20)}" y="${String(y + 30)}" font-size="10.5" fill="${C.faint}">MOST-USED LANGUAGES</text>
    ${rows}
  </g>`;
}

function now(x, y, items) {
  const tones = { crimson: C.crimson, steel: C.steel, ember: C.ember };
  return `<g class="rise" ${delay(0.8)}>
    <rect x="${String(x)}" y="${String(y)}" width="308" height="208" rx="16" fill="${C.surface}" stroke="${C.line}"/>
    <text class="label" x="${String(x + 20)}" y="${String(y + 30)}" font-size="10.5" fill="${C.faint}">RIGHT NOW</text>
    ${items
      .map(
        (item, i) => `<circle class="pulse" style="animation-delay:${String(i * 0.5)}s" cx="${String(x + 25)}" cy="${String(y + 59 + i * 50)}" r="4" fill="${tones[item.color]}"/>
    <text class="m7" x="${String(x + 38)}" y="${String(y + 63 + i * 50)}" font-size="10" fill="${tones[item.color]}" letter-spacing="1.5">${esc(item.label)}</text>
    <text class="d5" x="${String(x + 38)}" y="${String(y + 83 + i * 50)}" font-size="14" fill="${C.text}">${esc(item.text)}</text>`,
      )
      .join('\n    ')}
  </g>`;
}

export function dashboard(profile, stats, nowItems, avatar) {
  const id = 'dashboard';
  const x0 = 420;
  const tileWidth = (W - 40 - x0 - 3 * 16) / 4;
  const updated = new Date(stats.generatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

  const tiles = [
    { value: fmt(stats.contributions), label: 'CONTRIBUTIONS · 1Y', icon: 'calendar', color: C.crimson },
    { value: fmt(stats.commits), label: 'COMMITS · 1Y', icon: 'commit', color: C.steel },
    { value: fmt(stats.pullRequests), label: 'PULL REQUESTS · 1Y', icon: 'pr', color: C.ember },
    { value: fmt(stats.best), label: 'BEST STREAK · DAYS', icon: 'flame', color: C.amber, note: `now ${String(stats.current)}d` },
  ];

  const body = `
  <style>@keyframes swing{from{transform:rotate(-2.5deg)}to{transform:rotate(2.5deg)}}</style>
  ${panel(id, 0, 0, W, H)}
  ${badge(profile, stats, avatar)}

  <g class="rise" ${delay(0.2)}>
    <text class="label" x="${String(x0)}" y="58" fill="${C.crimson}">// DEVELOPER DASHBOARD</text>
    <text class="d7" x="${String(x0)}" y="98" font-size="30" fill="${C.text}">Profile at a glance</text>
    <rect x="1070" y="42" width="170" height="28" rx="14" fill="${C.green}" fill-opacity=".1" stroke="${C.green}" stroke-opacity=".45"/>
    <circle class="pulse" cx="1090" cy="56" r="4" fill="${C.green}"/>
    <text class="label" x="1102" y="60" font-size="10.5" fill="${C.green}">LIVE · GITHUB</text>
    <text class="m5" x="1240" y="92" font-size="11" fill="${C.faint}" text-anchor="end">updated ${esc(updated)}</text>
  </g>
  ${tiles.map((item, i) => tile(x0 + i * (tileWidth + 16), 118, tileWidth, item, i)).join('\n  ')}
  ${languages(x0, 240, stats)}
  ${now(x0 + 512, 240, nowItems)}`;

  return svg(id, W, H, {
    title: 'Developer ID and live GitHub dashboard',
    desc: `${profile.name}, ${profile.role}. Last year: ${fmt(stats.contributions)} contributions, ${fmt(stats.commits)} commits, ${fmt(stats.pullRequests)} pull requests. Best streak ${String(stats.best)} days. Top languages: ${stats.languages.map((l) => l.name).join(', ')}.`,
  }, body);
}
