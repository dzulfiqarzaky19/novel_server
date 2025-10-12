import { FastifyInstance } from 'fastify';

import { defaultScheduler } from '#scrapper/utils/jobScheduler.js';
import { evalOrEmpty } from '#scrapper/utils/evalOrEmpty.js';

import { HOME_CONFIG } from './homeScrapper.config.js';
import {
  parseCompleted,
  parseGenres,
  parseHot,
  parseLatest,
  parseSorts,
} from './homeScrapper.parser.js';
import {
  normalizeCompleted,
  normalizedGenres,
  normalizedSorts,
  normalizeHot,
  normalizeLatest,
} from './homeScrapper.normalizers.js';

export const homeScrapper = async (fastify: FastifyInstance) => {
  return defaultScheduler.addJob(async () => {
    const page = await fastify.puppeteer.getPage(HOME_CONFIG.url, [
      HOME_CONFIG.hot.selector,
      HOME_CONFIG.latest.selector,
      HOME_CONFIG.completed.selector,
      HOME_CONFIG.genres.selector,
      HOME_CONFIG.sorts.selector,
    ]);

    try {
      const [hotRaw, latestRaw, completedRaw, genresRaw, sortsRaw] =
        await Promise.all([
          evalOrEmpty({
            page,
            selector: HOME_CONFIG.hot.selector,
            parser: parseHot,
            config: HOME_CONFIG.hot,
          }),
          evalOrEmpty({
            page,
            selector: HOME_CONFIG.latest.selector,
            parser: parseLatest,
            config: HOME_CONFIG.latest,
          }),
          evalOrEmpty({
            page,
            selector: HOME_CONFIG.completed.selector,
            parser: parseCompleted,
            config: HOME_CONFIG.completed,
          }),
          evalOrEmpty({
            page,
            selector: HOME_CONFIG.genres.selector,
            parser: parseGenres,
            config: HOME_CONFIG.genres,
          }),
          evalOrEmpty({
            page,
            selector: HOME_CONFIG.sorts.selector,
            parser: parseSorts,
            config: HOME_CONFIG.sorts,
          }),
        ]);

      return {
        hot: normalizeHot(hotRaw),
        latest: normalizeLatest(latestRaw),
        completed: normalizeCompleted(completedRaw),
        genres: normalizedGenres(genresRaw),
        sorts: normalizedSorts(sortsRaw),
      };
    } finally {
      await page.close();
    }
  });
};
