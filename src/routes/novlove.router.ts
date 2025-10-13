import { FastifyInstance } from 'fastify';

import { NovloveController } from '#controller/novlove.controller.js';
import { NovloveRedisDebugController } from '#controller/novlove.debug.controller.js';
import {
  ChapterRequest,
  ListsRequest,
  NovelRequest,
} from '#model/novlove.model.js';

export default async function novloveRoute(fastify: FastifyInstance) {
  const novlove = NovloveController(fastify);
  const debug = NovloveRedisDebugController(fastify);

  fastify.get('/novlove', novlove.home);

  fastify.get<NovelRequest>('/novlove/novel/:name', novlove.novel);
  fastify.get<ChapterRequest>('/novlove/novel/:name/:chapter', novlove.chapter);
  fastify.get<ListsRequest>('/novlove/:list/:listType', novlove.list);

  fastify.get('/__debug/snap', async (_req, reply) => {
    const dir = process.env.DEBUG_SNAPSHOTS_DIR || '/tmp/snaps';
    const { readdir, readFile } = await import('node:fs/promises');
    try {
      const files = (await readdir(dir))
        .filter((f) => f.endsWith('.png'))
        .sort();
      if (!files.length) return reply.code(404).send('no snaps');
      const latest = files[files.length - 1];
      const buf = await readFile(`${dir}/${latest}`);
      reply.header('Content-Type', 'image/png').send(buf);
    } catch (e) {
      reply.code(500).send(String(e));
    }
  });

  fastify.get('/novlove/debug/redis/home', debug.home);
  fastify.get('/novlove/debug/redis/sort', debug.sort);
  fastify.get('/novlove/debug/redis/genre', debug.genre);
  fastify.get('/novlove/debug/redis/detail', debug.detail);
}
