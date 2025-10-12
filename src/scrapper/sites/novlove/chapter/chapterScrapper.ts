import { FastifyInstance } from 'fastify';

import { CHAPTER_CONFIG } from './chapterScrapper.config.js';
import { parseChapter } from './chapterScrapper.parser.js';
import { normalizeChapter } from './chapterScrapper.normalizer.js';

import { defaultScheduler } from '#scrapper/utils/jobScheduler.js';
import { evalOrEmpty } from '#scrapper/utils/evalOrEmpty.js';

export const chapterScrapper = async (
  fastify: FastifyInstance,
  slug: string,
) => {
  return defaultScheduler.addJob(async () => {
    const url = CHAPTER_CONFIG.url + slug;

    const page = await fastify.puppeteer.getPage(url, [
      CHAPTER_CONFIG.selector,
      CHAPTER_CONFIG.all_chapter.click,
    ]);

    try {
      const chapter = await evalOrEmpty({
        page,
        selector: CHAPTER_CONFIG.selector,
        parser: parseChapter,
        config: CHAPTER_CONFIG,
      });

      return {
        chapter: normalizeChapter(chapter),
      };
    } finally {
      page.close();
    }
  });
};
