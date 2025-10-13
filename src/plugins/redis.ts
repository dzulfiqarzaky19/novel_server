import fp from 'fastify-plugin';
import redis from '@fastify/redis';

export default fp(async (fastify) => {
  const url = process.env.REDIS_URL || '';

  if (!url) {
    fastify.log.warn('REDIS_URL not set; starting without Redis cache');

    return;
  }

  const isTLS = url.startsWith('rediss://');
  const sniHost = new URL(url).hostname;

  fastify.register(redis, {
    url,
    closeClient: true,

    lazyConnect: true,
    enableReadyCheck: false,
    connectTimeout: 10_000,
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => Math.min(500 * times, 2_000),

    ...(isTLS ? { tls: { servername: sniHost } } : {}),
  });

  fastify.addHook('onReady', async () => {
    try {
      await fastify.redis.ping();

      fastify.log.info('Redis ping OK');
    } catch (err) {
      fastify.log.warn(
        { err },
        'Redis not reachable; proceeding without cache',
      );
    }
  });
});
