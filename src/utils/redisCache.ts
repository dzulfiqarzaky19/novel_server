import { FastifyInstance } from 'fastify';

interface IRedisCacheProps<Output> {
  key: string;
  ttl: number;
  fetcher: () => Promise<Output>;
  isSkipCache?: boolean;
}

export const redisCache = async <Output>(
  fastify: FastifyInstance,
  config: IRedisCacheProps<Output>,
): Promise<Output> => {
  const { key, ttl, fetcher, isSkipCache = false } = config;

  if (isSkipCache) return fetcher();

  try {
    const cached = await fastify.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    fastify.log.warn({ err }, 'redis get failed, falling back to scrape');
  }

  const data = await fetcher();

  try {
    await fastify.redis.set(key, JSON.stringify(data), 'EX', ttl);
  } catch (err) {
    fastify.log.warn({ err }, 'redis set failed, continuing');
  }

  return data;
};
