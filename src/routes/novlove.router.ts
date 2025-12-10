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

  fastify.get('/novlove/debug/redis/home', debug.home);
  fastify.get('/novlove/debug/redis/sort', debug.sort);
  fastify.get('/novlove/debug/redis/genre', debug.genre);
  fastify.get('/novlove/debug/redis/detail', debug.detail);
}
