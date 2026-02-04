import { FastifyInstance } from 'fastify';

import { DETAIL_CONFIG } from './detailScrapper.config.js';
import {
  normalizeAuthorNovels,
  normalizeChapters,
  normalizeCover,
  normalizeDescription,
  normalizeDetail,
  normalizeLatestChapter,
} from './detailScrapper.normalizer.js';
import {
  parseAuthorNovels,
  parseChapters,
  parseCover,
  parseDescription,
  parseDetail,
  parseLatestChapter,
} from './detailScrapper.parser.js';

import { evalOrEmpty } from '#scrapper/utils/evalOrEmpty.js';
import { createJobScheduler } from '#scrapper/utils/jobScheduler.js';

const scheduler = createJobScheduler(1, 1200);

export const detailScrapper = async (
  fastify: FastifyInstance,
  slug: string,
) => {
  return scheduler.addJob(async () => {
    const url = `${DETAIL_CONFIG.url}${slug}`;

    const page = await fastify.puppeteer.getPage(url, [DETAIL_CONFIG.selector]);

    try {
      const [
        rawDetail,
        rawLatestChapter,
        rawDescription,
        rawChapters,
        rawAuthorNovels,
        rawCover,
      ] = await Promise.all([
        evalOrEmpty({
          page,
          selector: DETAIL_CONFIG.selector,
          parser: parseDetail,
          config: DETAIL_CONFIG.detail,
        }),
        evalOrEmpty({
          page,
          selector: DETAIL_CONFIG.selector,
          parser: parseLatestChapter,
          config: DETAIL_CONFIG.latest_chapter,
        }),
        evalOrEmpty({
          page,
          selector: DETAIL_CONFIG.selector,
          parser: parseDescription,
          config: DETAIL_CONFIG.description,
        }),
        evalOrEmpty({
          page,
          selector: DETAIL_CONFIG.selector,
          parser: parseChapters,
          config: DETAIL_CONFIG.chapters,
        }),
        evalOrEmpty({
          page,
          selector: DETAIL_CONFIG.selector,
          parser: parseAuthorNovels,
          config: DETAIL_CONFIG.author_novels,
        }),
        evalOrEmpty({
          page,
          selector: DETAIL_CONFIG.selector,
          parser: parseCover,
          config: DETAIL_CONFIG.cover,
        }),
      ]);

      return {
        cover: normalizeCover(rawCover),
        detail: normalizeDetail(rawDetail),
        latest_chapter: normalizeLatestChapter(rawLatestChapter),
        description: normalizeDescription(rawDescription),
        chapters: normalizeChapters(rawChapters),
        author_novels: normalizeAuthorNovels(rawAuthorNovels),
      };
    } finally {
      await page.close();
    }
  });
};
