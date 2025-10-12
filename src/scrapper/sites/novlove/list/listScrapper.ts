import { FastifyInstance } from 'fastify';

import { LIST_CONFIG } from './listScrapper.config.js';
import { parseSortRow } from './listScrapper.parser.js';
import { normalizeList } from './listScrapper.normalizer.js';

import { evalOrEmpty } from '#scrapper/utils/evalOrEmpty.js';
import { defaultScheduler } from '#scrapper/utils/jobScheduler.js';

interface IListScrapperConfig {
  list: string;
  listType: string;
  query: string;
}

export const listScrapper = async (
  fastify: FastifyInstance,
  config: IListScrapperConfig,
) => {
  return defaultScheduler.addJob(async () => {
    const { list, listType, query } = config;

    const queryString = query === '1' ? '' : `?page=${query}`;
    const pageUrl = `${LIST_CONFIG.url}${list}/${listType}${queryString}`;

    const page = await fastify.puppeteer.getPage(pageUrl, [
      LIST_CONFIG.selector,
    ]);

    try {
      const listRaw = await evalOrEmpty({
        page,
        selector: LIST_CONFIG.selector,
        parser: parseSortRow,
        config: LIST_CONFIG,
      });

      return {
        list: normalizeList(listRaw),
      };
    } finally {
      await page.close();
    }
  });
};
