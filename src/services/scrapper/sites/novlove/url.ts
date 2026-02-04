const BASE = 'https://novlove.com';

export const toAbsolute = (href: string) =>
  href?.startsWith('http') ? href : `${BASE}${href || ''}`;

/**
 * Convert a full or relative href into just its pathname
 * e.g. "https://novlove.com/novel/test-novel/chapter-1" → "/novel/test-novel/chapter-1"
 */
export const toPath = (href: string) => {
  try {
    return new URL(href, BASE).pathname;
  } catch {
    return href || '';
  }
};

/**
 * Example:
 *   "/novel/im-the-king-of-technology"  → "im-the-king-of-technology"
 *   "/novel/reincarnated-with-the-strongest-system/chapter-1" → "reincarnated-with-the-strongest-system"
 *
 * If the path does not start with "/novel/", it returns an empty string.
 */
export const slugFromPath = (path: string) => {
  const parts = path.split('/').filter(Boolean);

  return parts[1] ?? '';
};

/**
 * Example:
 *   "/novel/reincarnated-with-the-strongest-system/chapter-1" → "chapter-1"
 *   "/novel/im-the-king-of-technology/chapter-12-special"     → "chapter-12-special"
 *
 * If the path is just "/novel/:slug" with no chapter, it returns an empty string.
 */
export const chapterSlugFromPath = (path: string) => {
  const parts = path.split('/').filter(Boolean);

  return parts[0] === 'novel' ? (parts[2] ?? '') : '';
};
