import 'dotenv/config';
import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async (fastify) => {
  fastify.register(cors, {
    origin: [
      process.env.NOVEL_CLIENT || 'http://localhost:5173',
      process.env.VERCEL_CLIENT || '',
      'http://localhost:4173',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
});
