import fp from 'fastify-plugin';
import type { Page, Browser } from 'puppeteer';

import {
  getSharedBrowserInstance,
  closeSharedBrowserInstance,
} from './puppeteer.utils.js';
import { PUPPETEER_CONFIG } from './puppeteer.const.js';
import { saveDebugArtifacts } from '#utils/debugSnap.js';

export default fp(async (fastify) => {
  await getSharedBrowserInstance();

  fastify.decorate(PUPPETEER_CONFIG.name, {
    get browser() {
      return getSharedBrowserInstance();
    },

    async getPage(url: string, selectors?: string[]): Promise<Page> {
      new URL(url);

      const browser = await getSharedBrowserInstance();
      const page = await browser.newPage();

      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
      });

      page.setDefaultNavigationTimeout(PUPPETEER_CONFIG.timeout.navigation);
      page.setDefaultTimeout(PUPPETEER_CONFIG.timeout.selector);

      if (PUPPETEER_CONFIG.assets.isBlocked) {
        await page.setRequestInterception(true);
        const block = (req: any) => {
          if (PUPPETEER_CONFIG.assets.types.includes(req.resourceType())) {
            req.abort();
            return;
          }
          req.continue();
        };
        page.on('request', block);
      }

      await page.setViewport(PUPPETEER_CONFIG.viewport);

      const waitSelectors = async () => {
        if (!selectors?.length) return;
        await Promise.all(
          selectors.map((selector) =>
            page.waitForSelector(selector, {
              timeout: PUPPETEER_CONFIG.timeout.selector,
            }),
          ),
        );
      };

      try {
        await page.goto(url, { waitUntil: PUPPETEER_CONFIG.waitOption });
        await waitSelectors();
        return page;
      } catch (err) {
        const snap1 = await saveDebugArtifacts(
          page,
          'goto-or-selectors-failed',
          fastify.log.error.bind(fastify.log),
        );

        fastify.log.error(
          { err, url, ...snap1 },
          'Puppeteer failed — captured artifacts, retrying once',
        );

        try {
          await page.reload({ waitUntil: PUPPETEER_CONFIG.waitOption });
          await waitSelectors();
          return page;
        } catch (err2) {
          const snap2 = await saveDebugArtifacts(page, 'retry-failed');
          fastify.log.error(
            { err: err2, url, ...snap2 },
            'Retry failed — giving up',
            fastify.log.error.bind(fastify.log),
          );
          throw err2;
        }
      }
    },
  });

  fastify.addHook('onClose', async () => {
    await closeSharedBrowserInstance();
  });
});
