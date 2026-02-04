import { ChapterConfig } from './chapterScrapper.config.js';

export const parseChapter = (elements: Element[], config: ChapterConfig) => {
  const { title, chapter_name, prev_chapter, next_chapter, chapter_content } =
    config;

  return elements.map((el) => ({
    title: el.querySelector(title)?.textContent?.trim() || '',
    chapter_name: el.querySelector(chapter_name)?.textContent?.trim() || '',
    prev_chapter:
      (el.querySelector(prev_chapter) as HTMLAnchorElement)?.href || '',
    next_chapter:
      (el.querySelector(next_chapter) as HTMLAnchorElement)?.href || '',
    content: el.querySelector(chapter_content)?.textContent?.trim() || '',
  }));
};

export type ReturnTypeOfParseChapter = ReturnType<typeof parseChapter>;
