import { ListConfig } from './listScrapper.config.js';

export const parseSortRow = (rows: Element[], config: ListConfig) => {
  const { cover, title, author, latestChapter } = config;

  return rows.map((row) => {
    const coverEl = row.querySelector(cover.selector);
    const titleEl = row.querySelector(title.selector);
    const authorEl = row.querySelector(author.selector);
    const chapterEl = row.querySelector(latestChapter.selector);

    return {
      title: titleEl?.textContent?.trim() || '',
      url: (titleEl as HTMLAnchorElement)?.href || '',
      author: authorEl?.textContent?.trim() || '',
      cover:
        cover.attributes
          .map((attribute) => coverEl?.getAttribute(attribute))
          .find(Boolean) || '',
      latestChapter: {
        title: chapterEl?.textContent?.trim() || '',
        url: (chapterEl?.parentElement as HTMLAnchorElement)?.href || '',
      },
    };
  });
};
