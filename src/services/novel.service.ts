import { FastifyInstance } from 'fastify';

import { homeScrapper } from '#scrapper/sites/novlove/home/homeScrapper.js';
import { listScrapper } from '#scrapper/sites/novlove/list/listScrapper.js';
import { detailScrapper } from '#scrapper/sites/novlove/detail/detailScrapper.js';
import { chapterScrapper } from '#scrapper/sites/novlove/chapter/chapterScrapper.js';
import { redisCache } from '#utils/redisCache.js';
import { NOVLOVE_CONFIG } from '#config/novlove.config.js';

export const NovelService = (fastify: FastifyInstance) => {
    const getHome = async () => {
        return redisCache(fastify, {
            key: NOVLOVE_CONFIG.home.redis_key,
            ttl: NOVLOVE_CONFIG.home.ttl_seconds,
            fetcher: () => homeScrapper(fastify),
        });
    };

    const getList = async (list: string, listType: string, page: string) => {
        return redisCache(fastify, {
            key: `${NOVLOVE_CONFIG.list.redis_key}:${list}:${listType}`,
            ttl: NOVLOVE_CONFIG.list.ttl_seconds,
            fetcher: () =>
                listScrapper(fastify, {
                    list,
                    listType,
                    query: page,
                }),
            isSkipCache: page !== '1',
        });
    };

    const getNovel = async (name: string) => {
        return redisCache(fastify, {
            key: `${NOVLOVE_CONFIG.detail.redis_key}:${name}`,
            ttl: NOVLOVE_CONFIG.detail.ttl_seconds,
            fetcher: () => detailScrapper(fastify, name),
        });
    };

    const getChapter = async (slug: string) => {
        return chapterScrapper(fastify, slug);
    };

    return { getHome, getList, getNovel, getChapter };
};
