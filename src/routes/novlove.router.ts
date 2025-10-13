import { FastifyInstance } from 'fastify';

import { NovloveController } from '#controller/novlove.controller.js';
import { NovloveRedisDebugController } from '#controller/novlove.debug.controller.js';
import {
  ChapterRequest,
  ListsRequest,
  NovelRequest,
} from '#model/novlove.model.js';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const SNAP_DIR = process.env.DEBUG_SNAPSHOTS_DIR || '/tmp/snaps';

export default async function novloveRoute(fastify: FastifyInstance) {
  const novlove = NovloveController(fastify);
  const debug = NovloveRedisDebugController(fastify);

  fastify.get('/novlove', novlove.home);

  fastify.get<NovelRequest>('/novlove/novel/:name', novlove.novel);
  fastify.get<ChapterRequest>('/novlove/novel/:name/:chapter', novlove.chapter);
  fastify.get<ListsRequest>('/novlove/:list/:listType', novlove.list);

  fastify.get('/__debug/snaps', async (_req, reply) => {
    try {
      const files = (await readdir(SNAP_DIR))
        .filter((f) => f.endsWith('.png') || f.endsWith('.html'))
        .sort();
      reply.send({ dir: SNAP_DIR, files });
    } catch (e) {
      reply.code(500).send({ error: String(e), dir: SNAP_DIR });
    }
  });

  fastify.get('/__debug/snap/:name', async (req, reply) => {
    const name = (req.params as any).name as string;
    try {
      const buf = await readFile(join(SNAP_DIR, name));
      if (name.endsWith('.png')) reply.header('Content-Type', 'image/png');
      if (name.endsWith('.html'))
        reply.header('Content-Type', 'text/html; charset=utf-8');
      reply.send(buf);
    } catch (e) {
      reply.code(404).send({ error: 'not found', name });
    }
  });

  fastify.get('/novlove/debug/redis/home', debug.home);
  fastify.get('/novlove/debug/redis/sort', debug.sort);
  fastify.get('/novlove/debug/redis/genre', debug.genre);
  fastify.get('/novlove/debug/redis/detail', debug.detail);
}
