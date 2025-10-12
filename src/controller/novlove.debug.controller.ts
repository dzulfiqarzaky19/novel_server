import { FastifyInstance } from 'fastify';
import { NOVLOVE_CONFIG } from '#config/novlove.config.js';

export const NovloveRedisDebugController = (fastify: FastifyInstance) => {
  const getCache = async (key: string) => {
    const data = await fastify.redis.get(key);
    return data ? JSON.parse(data) : { msg: 'no cache' };
  };

  return {
    home: () => getCache(NOVLOVE_CONFIG.home.redis_key),
    genre: () => getCache(NOVLOVE_CONFIG.genre.redis_key),
    sort: () => getCache(NOVLOVE_CONFIG.sort.redis_key),
    detail: () => getCache(NOVLOVE_CONFIG.detail.redis_key),
  };
};
