import { crowFlock, crowStyles } from '../lib/motifs.mjs';
import { C, svg } from '../lib/theme.mjs';

const W = 1280;
const H = 170;

const BACK = 'M0,112 C200,84 400,132 640,106 S1040,82 1280,102 V170 H0 Z';
const FRONT = 'M0,132 C240,112 420,152 700,128 S1100,112 1280,136';

/** The sign-off, flat like the rest: hills under a red moon, crows crossing it. No background, so it sits on the page. */
export function footer() {
  const id = 'footer';
  const body = `
  <clipPath id="footer-sky"><rect width="${String(W)}" height="${String(H)}"/></clipPath>
  <g transform="translate(1040 60)">
    <circle r="46" fill="${C.crimson}" fill-opacity=".12"/>
    <circle r="32" fill="${C.crimson}"/>
  </g>
  <g clip-path="url(#footer-sky)">${crowFlock(1000, 46)}</g>
  ${crowStyles(380, -1100)}
  <path d="${BACK}" fill="${C.surface2}"/>
  <path d="${FRONT} V170 H0 Z" fill="${C.surface}"/>
  <path d="${FRONT}" fill="none" stroke="url(#footer-accent)" stroke-width="2"/>`;

  return svg(id, W, H, { title: 'End of profile', desc: 'Hills under a red moon, with crows flying across it.' }, body);
}
