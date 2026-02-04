import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { NovelService } from '../services/novel.service.js';
import {
  ChapterRequest,
  ListsRequest,
  NovelRequest,
} from '#model/novlove.model.js';

const defaultQueryPage = '1';

export const NovloveController = (fastify: FastifyInstance) => {
  const service = NovelService(fastify);

  const home = async (_: FastifyRequest, res: FastifyReply) => {
    const data = await service.getHome();
    return res.send(data);
  };

  const list = async (req: FastifyRequest<ListsRequest>, res: FastifyReply) => {
    const { list, listType } = req.params;
    const page = req.query.page ?? defaultQueryPage;

    const data = await service.getList(list, listType, page);
    return res.send(data);
  };

  const novel = async (
    req: FastifyRequest<NovelRequest>,
    res: FastifyReply,
  ) => {
    const { name } = req.params;
    const data = await service.getNovel(name);
    return res.send(data);
  };

  const chapter = async (
    req: FastifyRequest<ChapterRequest>,
    res: FastifyReply,
  ) => {
    const { name, chapter } = req.params;
    const slug = `${name}/${chapter}`;

    const data = await service.getChapter(slug);
    return res.send(data);
  };

  return { home, list, novel, chapter };
};
