import { Browser, Page } from 'puppeteer';
import { FastifyRedis } from '@fastify/redis';

declare module 'fastify' {
  interface FastifyInstance {
    redis: FastifyRedis;
    puppeteer: {
      browser: Promise<Browser>;
      getPage: (url: string, selectors?: string[]) => Promise<Page>;
    };
  }
}
