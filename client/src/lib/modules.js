import { score } from './fuzzy.js';

// Auto-discovery: dropping a folder in /modules is all it takes.
const configs = import.meta.glob('../modules/*/module.config.js', { eager: true });
const lessonFiles = import.meta.glob('../modules/*/lessons/*.md', { query: '?raw', import: 'default' });

export const modules = Object.values(configs)
  .map((m) => m.default)
  .filter((m) => m && m.slug && !m.slug.startsWith('_'))
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

export const getModule = (slug) => modules.find((m) => m.slug === slug);
export const flatLessons = (mod) =>
  mod.sections.flatMap((s) => s.lessons.map((l) => ({ ...l, sectionId: s.id, sectionTitle: s.title })));
export const lessonCount = (mod) => flatLessons(mod).length;
export const loadLesson = (slug, file) => lessonFiles[`../modules/${slug}/lessons/${file}`]?.() ?? Promise.resolve('');

const pages = [
  { type: 'Page', title: 'All modules', sub: 'Browse every learning track', to: '/modules' },
  { type: 'Page', title: 'Roadmaps', sub: 'Suggested learning order', to: '/roadmaps' },
  { type: 'Page', title: 'Profile', sub: 'Progress, revision list and notes', to: '/profile' },
];

export function searchAll(query) {
  const q = query.trim();
  const items = [
    ...modules.map((m) => ({ type: 'Module', title: m.title, sub: m.subtitle, to: `/m/${m.slug}`, hay: `${m.title} ${m.subtitle}` })),
    ...modules.flatMap((m) =>
      flatLessons(m).map((l) => ({ type: 'Lesson', title: l.title, sub: `${m.title} / ${l.sectionTitle}`, to: `/m/${m.slug}/${l.id}`, hay: `${l.title} ${m.title} ${(l.tags || []).join(' ')}` }))
    ),
    ...pages.map((p) => ({ ...p, hay: `${p.title} ${p.sub}` })),
  ];
  if (!q) return items.slice(0, 8);
  return items
    .map((i) => ({ ...i, s: score(q, i.hay) }))
    .filter((i) => i.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 12);
}

export const allLessonRefs = () =>
  modules.flatMap((m) => flatLessons(m).map((l) => ({ ...l, slug: m.slug, moduleTitle: m.title })));
