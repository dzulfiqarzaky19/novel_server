import fp from 'fastify-plugin';
import redis from '@fastify/redis';

export default fp(async (fastify) => {
  const url = process.env.REDIS_URL || '';

  fastify.register(redis, {
    url,
    closeClient: true,
  });
});
