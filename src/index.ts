import Fastify from 'fastify';
import puppeteerPlugin from './services/puppeteer/puppeteer.js';
import redisPlugin from './config/redis.js';
import corsPlugin from './config/cors.js';
import novelRoutes from './routes/novlove.router.js';

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';

async function main() {
  const app = Fastify({ logger: true });
  app.register(corsPlugin);
  app.register(puppeteerPlugin);
  app.register(redisPlugin);

  app.register(novelRoutes, { prefix: '/api/novel' });

  app.get('/', async (_req, reply) => reply.send({ hello: 'world' }));

  await app.ready();

  app.log.info(`puppeteer decorated? ${Boolean((app as any).puppeteer)}`);
  app.log.info(`redis decorated? ${Boolean((app as any).redis)}`);

  const address = await app.listen({
    port: PORT,
    host: HOST,
  });
  console.log(`🚀 Server running on ${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
