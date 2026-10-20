// Small recurring motifs, drawn originally: three tomoe, crows, a crimson accent.
// Quiet on purpose: decoration to most, a nod to those who know.
import { C } from './theme.mjs';

export const CRIMSON = '#dc2626';
const INK = '#05030d';

/** One tomoe, head at the origin, tail sweeping back along -x (so it trails when it turns). */
const TOMOE = `<circle r="5"/><path d="M0.6,-5 C-7,-6.8 -14.5,-3.5 -17.5,5.5 C-13,0.6 -7.5,-0.2 -3.2,3.9 Z"/>`;

/** Three tomoe evenly spaced on a ring of radius r, ready to sit inside a turning group. */
export function tomoeRing(r, glowFilter) {
  return [0, 120, 240]
    .map((angle) => `<g transform="rotate(${String(angle)}) translate(${String(r)} 0) rotate(90)" fill="${CRIMSON}"${glowFilter ? ` filter="url(#${glowFilter})"` : ''}>${TOMOE}</g>`)
    .join('');
}

/** A crow in flight, about 26×12, wings flapping about its own centre. */
function flyingCrow(scale, flapDelay) {
  return `<g transform="scale(${String(scale)})"><path style="transform-box:fill-box;transform-origin:center;animation:flap .5s ease-in-out ${String(flapDelay)}s infinite alternate"
    d="M0,6 C4,0 8,-1 11,4 L13,5.5 L15,4 C18,-1 22,0 26,6 C22,4 18.5,4.5 16,7.5 L14,9 L13,11 L12,9 L10,7.5 C7.5,4.5 4,4 0,6 Z"
    fill="${INK}" stroke="${C.violet}" stroke-opacity=".55" stroke-width=".8"/></g>`;
}

/**
 * A few crows crossing a scene from right to left, clipped by the caller.
 * At rest (reduced motion) they sit at (x, y); `crowStyles(from, to)` sets the flight.
 */
export function crowFlock(x, y) {
  const birds = [
    [0, 0, 0.8, 0],
    [22, -8, 0.65, 0.2],
    [40, 4, 0.7, 0.35],
    [62, -4, 0.55, 0.1],
  ];
  return `<g transform="translate(${String(x)} ${String(y)})"><g style="animation:fly 24s linear infinite">
    ${birds.map(([bx, by, scale, d]) => `<g transform="translate(${String(bx)} ${String(by)})">${flyingCrow(scale, d)}</g>`).join('\n    ')}
  </g></g>`;
}

export const crowStyles = (from, to) => `<style>@keyframes fly{from{transform:translateX(${String(from)}px)}to{transform:translateX(${String(to)}px)}}
@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(.45)}}</style>`;

/** A perched crow, about size × 0.7, outlined so it reads on navy, with a crimson eye. */
export function perchedCrow(x, y, size = 24) {
  const shapes = `<polygon points="-6,1.5 -12,5 -11,6.5 -5.5,3.5"/>
    <ellipse cx="0" cy="0.5" rx="7.5" ry="4.6" transform="rotate(-18)"/>
    <circle cx="6.2" cy="-4" r="3.3"/>
    <polygon points="8.9,-4.8 13,-3.7 8.9,-2.6"/>`;
  return `<svg x="${String(x)}" y="${String(y)}" width="${String(size)}" height="${String(size * 0.7)}" viewBox="-12.5 -9 26.5 18" overflow="visible">
    <g fill="${C.indigo}" stroke="${C.indigo}" stroke-width="1.4" stroke-linejoin="round" opacity=".8">${shapes}</g>
    <g fill="${INK}">${shapes}</g>
    <path d="M-1,4.5 L-1.6,8 M1.5,4.5 L1.6,8" stroke="${C.muted}" stroke-width="1" stroke-linecap="round"/>
    <circle cx="7.1" cy="-4.6" r="1.05" fill="${CRIMSON}"/>
  </svg>`;
}
