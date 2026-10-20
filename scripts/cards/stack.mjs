import { brand, brandColor } from '../lib/icons.mjs';
import { C, delay, esc, heading, monoWidth, panel, svg } from '../lib/theme.mjs';

const W = 1280;
const LEFT = 470;
const RIGHT = W - 44;
const CHIP_H = 32;
const GAP = 9;
const GROUP_TONES = [C.cyan, C.violet, C.amber, C.indigo, C.green, '#f472b6', C.blue];

function chip(x, y, slug, label) {
  const width = 14 + 16 + 8 + monoWidth(label, 13) + 14;
  const color = brandColor(slug);
  return {
    width,
    svg: `<rect x="${String(x)}" y="${String(y)}" width="${String(width)}" height="${String(CHIP_H)}" rx="9" fill="${C.surface}" stroke="${color}" stroke-opacity=".38"/>
    ${brand(slug, x + 14, y + 8, 16)}
    <text class="m5" x="${String(x + 38)}" y="${String(y + 21)}" font-size="13" fill="${C.text}">${esc(label)}</text>`,
  };
}

/** Groups flow down the right column; chips wrap within it. Returns the svg and its bottom. */
function groups(stack, top) {
  let y = top;
  const parts = [];
  stack.forEach((group, index) => {
    const tone = GROUP_TONES[index % GROUP_TONES.length];
    parts.push(`<g class="rise" ${delay(0.2 + index * 0.08)}>
    <rect x="${String(LEFT)}" y="${String(y + 1)}" width="16" height="3" rx="1.5" fill="${tone}"/>
    <text class="label" x="${String(LEFT + 24)}" y="${String(y + 7)}" font-size="10.5" fill="${tone}">${esc(group.group)}</text>`);
    y += 18;
    let x = LEFT;
    for (const [slug, label] of group.items) {
      const width = 14 + 16 + 8 + monoWidth(label, 13) + 14;
      if (x + width > RIGHT) {
        x = LEFT;
        y += CHIP_H + GAP;
      }
      parts.push(chip(x, y, slug, label).svg);
      x += width + GAP;
    }
    parts.push('</g>');
    y += CHIP_H + 20;
  });
  return { svg: parts.join('\n  '), bottom: y - 20 };
}

/** Icons circling a core; each ring turns, each icon counter-turns to stay upright. */
function orbit(cx, cy, rings) {
  const radii = [70, 116, 162];
  const speeds = [22, 32, 44];
  return `
  <g transform="translate(${String(cx)} ${String(cy)})">
    <circle r="190" fill="url(#stack-glow-cyan)"/>
    ${rings
      .map((slugs, ring) => {
        const r = radii[ring];
        const duration = speeds[ring];
        const nodes = slugs
          .map((slug, i) => {
            const angle = (i / slugs.length) * Math.PI * 2 + ring * 0.6;
            const nx = Math.cos(angle) * r;
            const ny = Math.sin(angle) * r;
            return `<g transform="translate(${nx.toFixed(1)} ${ny.toFixed(1)})"><g style="transform-box:fill-box;transform-origin:center;animation:spinr ${String(duration)}s linear infinite">
          <circle r="19" fill="${C.surface}" stroke="${brandColor(slug)}" stroke-opacity=".55"/>
          ${brand(slug, -10, -10, 20)}
        </g></g>`;
          })
          .join('');
        return `<circle r="${String(r)}" fill="none" stroke="${C.indigo}" stroke-opacity=".28" stroke-dasharray="3 7"/>
    <g style="animation:spin ${String(duration)}s linear infinite">${nodes}</g>`;
      })
      .join('\n    ')}
    <circle r="40" fill="url(#stack-accent)" filter="url(#stack-glow)"/>
    <circle r="40" fill="none" stroke="#fff" stroke-opacity=".25"/>
    <text class="m7" y="7" font-size="20" fill="#fff" text-anchor="middle">&lt;/&gt;</text>
  </g>`;
}

export function stack(stackGroups, rings) {
  const id = 'stack';
  const laid = groups(stackGroups, 48);
  // Tall enough for the outer ring (162 + node radius) below the subtitle.
  const H = Math.max(laid.bottom + 40, 520);

  const body = `
  ${panel(id, 0, 0, W, H)}
  <g class="rise" ${delay(0.1)}>${heading(44, 52, '// TECH STACK', 'Tools I build with', C.cyan, 28)}</g>
  <text class="d5 rise" ${delay(0.2)} x="44" y="122" font-size="15" fill="${C.muted}">Frontend first, data close behind.</text>
  ${orbit(222, 132 + (H - 132) / 2, rings)}
  <line x1="${String(LEFT - 26)}" y1="44" x2="${String(LEFT - 26)}" y2="${String(H - 44)}" stroke="${C.line}"/>
  ${laid.svg}`;

  return svg(id, W, H, {
    title: 'Tech stack',
    desc: stackGroups.map((g) => `${g.group}: ${g.items.map(([, label]) => label).join(', ')}`).join('. '),
  }, body);
}
