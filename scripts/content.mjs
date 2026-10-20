// Everything the cards say, in one place. Edit here, then `node scripts/build.mjs`.

export const PROFILE = {
  login: 'rahulsharma1919',
  name: 'Rahul Sharma',
  role: 'Frontend Engineer',
  typed: 'Frontend Engineer · at home in the database',
  pitch: [
    'I build fast, accessible React interfaces, and the',
    'schemas and queries that keep them fast.',
  ],
  location: 'Noida, India',
  education: 'B.Tech CSE (AI & ML)',
  status: 'OPEN TO WORK',
  idNumber: 'RS-1919',
};

export const DEVELOPER = {
  label: '// DEVELOPER',
  title: 'Interfaces people enjoy using',
  url: 'localhost:5173/keepsafe',
  points: [
    { icon: 'layout', title: 'Responsive, pixel-perfect UI', detail: 'React · Next.js · MUI · Tailwind' },
    { icon: 'wave', title: 'Motion that tells a story', detail: 'GSAP · Framer Motion' },
    { icon: 'database', title: 'Data that stays fast', detail: 'PostgreSQL · indexes · query budgets' },
  ],
};

export const LIFE = {
  label: '// OFF THE CLOCK',
  title: 'Stories, anime & games',
  rings: [
    { label: 'Read', detail: 'Sci-fi books', share: 0.8 },
    { label: 'Watch', detail: 'Anime nights', share: 0.65 },
    { label: 'Play', detail: 'Story games', share: 0.7 },
  ],
};

/** Simple Icons slugs, or a drawn glyph name from lib/icons.mjs. */
export const STACK = [
  { group: 'FRONTEND', items: [
    ['react', 'React'], ['nextdotjs', 'Next.js'], ['typescript', 'TypeScript'], ['javascript', 'JavaScript'],
    ['mui', 'MUI'], ['tailwindcss', 'Tailwind'], ['bootstrap', 'Bootstrap'], ['vite', 'Vite'],
    ['html5', 'HTML'], ['css', 'CSS'],
  ] },
  { group: 'MOTION', items: [['gsap', 'GSAP'], ['framer', 'Framer Motion']] },
  { group: 'DATABASES', items: [
    ['postgresql', 'PostgreSQL'], ['mysql', 'MySQL'], ['mongodb', 'MongoDB'], ['firebase', 'Firebase'],
    ['drizzle', 'Drizzle ORM'],
  ] },
  { group: 'API & BACKEND', items: [['restapi', 'REST API'], ['graphql', 'GraphQL'], ['nodedotjs', 'Node.js'], ['nestjs', 'NestJS']] },
  { group: 'TESTING', items: [['playwright', 'Playwright'], ['vitest', 'Vitest'], ['postman', 'Postman']] },
  { group: 'AI TOOLS', items: [['claude', 'Claude'], ['antigravity', 'Antigravity'], ['codex', 'Codex'], ['stitch', 'Stitch']] },
  { group: 'CLOUD & TOOLS', items: [
    ['vercel', 'Vercel'], ['cloudflare', 'Cloudflare'], ['render', 'Render'], ['neon', 'Neon'],
    ['netlify', 'Netlify'], ['git', 'Git'], ['github', 'GitHub'], ['githubactions', 'Actions'], ['figma', 'Figma'],
  ] },
];

/** The orbit around the core, inner ring first. */
export const ORBITS = [
  ['react', 'typescript'],
  ['postgresql', 'nextdotjs', 'tailwindcss'],
  ['gsap', 'graphql', 'mui', 'playwright'],
];

export const NOW = [
  { color: 'cyan', label: 'BUILDING', text: 'KeepSafe: a vault for API keys' },
  { color: 'indigo', label: 'SHARPENING', text: 'Query plans, indexes, motion' },
  { color: 'violet', label: 'OFF-SCREEN', text: 'Sci-fi, anime and story games' },
];

export const CONTACTS = [
  { icon: 'linkedin', title: 'LinkedIn', handle: 'in/rahulsharma1919' },
  { icon: 'gmail', title: 'Email', handle: 'rahul1sharma1919@gmail.com' },
  { icon: 'x', title: 'X', handle: '@HeyRahulSharma_' },
  { icon: 'leetcode', title: 'LeetCode', handle: 'rahul1sharma1919' },
];

export const QUOTE = 'Tomorrow is in your hand. Set your heart ablaze.';
