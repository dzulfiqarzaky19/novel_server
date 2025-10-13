import { FastifyInstance } from 'fastify';

import { NovloveController } from '#controller/novlove.controller.js';
import { NovloveRedisDebugController } from '#controller/novlove.debug.controller.js';
import {
  ChapterRequest,
  ListsRequest,
  NovelRequest,
} from '#model/novlove.model.js';

import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

const SNAP_DIR = process.env.DEBUG_SNAPSHOTS_DIR || '/tmp/snaps';

export default async function novloveRoute(fastify: FastifyInstance) {
  const novlove = NovloveController(fastify);
  const debug = NovloveRedisDebugController(fastify);

  fastify.get('/novlove', novlove.home);

  fastify.get<NovelRequest>('/novlove/novel/:name', novlove.novel);
  fastify.get<ChapterRequest>('/novlove/novel/:name/:chapter', novlove.chapter);
  fastify.get<ListsRequest>('/novlove/:list/:listType', novlove.list);

  fastify.get('/novlove/__debug/gallery-grouped', async (req, reply) => {
    const limit = Math.max(1, Math.min(+(req.query as any)?.limit || 30, 200));

    const names = (await readdir(SNAP_DIR)).filter(
      (f) => f.endsWith('.png') || f.endsWith('.html'),
    );

    type G = {
      png?: string;
      html?: string;
      mtime?: number;
      pngBytes?: number;
      htmlBytes?: number;
    };
    const groups = new Map<string, G>();
    for (const name of names) {
      const id = name.slice(0, name.length - extname(name).length);
      const full = join(SNAP_DIR, name);
      const st = await stat(full).catch(() => null);
      const g = groups.get(id) ?? {};
      g.mtime = Math.max(g.mtime ?? 0, st?.mtimeMs ?? 0);
      if (name.endsWith('.png')) {
        g.png = full;
        g.pngBytes = st?.size ?? 0;
      } else {
        g.html = full;
        g.htmlBytes = st?.size ?? 0;
      }
      groups.set(id, g);
    }

    // newest first, apply limit
    const ordered = [...groups.entries()]
      .sort((a, b) => (b[1].mtime ?? 0) - (a[1].mtime ?? 0))
      .slice(0, limit);

    // inline images as data URIs; html as data URI link
    const esc = (s: string) =>
      s.replace(
        /[&<>"]/g,
        (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!,
      );

    const cards: string[] = [];
    for (const [id, g] of ordered) {
      const title = esc(id);
      let imgTag = '<div class="meta">no PNG</div>';
      let htmlLink = '';

      if (g.png && (g.pngBytes ?? 0) > 0) {
        const b64 = (await readFile(g.png)).toString('base64');
        imgTag = `<img loading="lazy" src="data:image/png;base64,${b64}" alt="${title}" />`;
      }

      if (g.html && (g.htmlBytes ?? 0) > 0) {
        const htmlB64 = (await readFile(g.html)).toString('base64');
        htmlLink = `<a href="data:text/html;charset=utf-8;base64,${htmlB64}" target="_blank">open HTML (${g.htmlBytes} bytes)</a>`;
      }

      const meta = [
        g.pngBytes ? `PNG: ${g.pngBytes} bytes` : 'PNG: —',
        g.htmlBytes ? `HTML: ${g.htmlBytes} bytes` : 'HTML: —',
      ].join(' • ');

      cards.push(`
      <div class="card">
        <div class="head">
          <div class="title">${title}</div>
          <div class="links">${htmlLink}</div>
        </div>
        <div class="meta">${meta}</div>
        ${imgTag}
      </div>
    `);
    }

    const html = `<!doctype html>
<html><head><meta charset="utf-8"/>
<title>Snaps (grouped)</title>
<style>
  :root { color-scheme: light dark; }
  body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;
       padding:20px;margin:0;background:#fafafa;color:#111}
  h1{margin:0 0 12px}
  .sub{color:#6b7280;font-size:12px;margin-bottom:16px}
  .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:16px 0;
        box-shadow:0 1px 2px rgba(0,0,0,.03)}
  .head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
  .title{font-weight:600;font-size:14px;word-break:break-all}
  .meta{color:#6b7280;font-size:12px;margin:6px 0 8px}
  img{max-width:100%;height:auto;border:1px solid #e5e7eb;border-radius:8px}
  a{font-size:12px}
</style></head>
<body>
  <h1>Snaps (grouped)</h1>
  <div class="sub">dir: ${esc(SNAP_DIR)} • showing ${ordered.length} of ${groups.size} (use ?limit=NN)</div>
  ${cards.join('\n')}
</body></html>`;

    reply.type('text/html').send(html);
  });

  fastify.get('/novlove/debug/redis/home', debug.home);
  fastify.get('/novlove/debug/redis/sort', debug.sort);
  fastify.get('/novlove/debug/redis/genre', debug.genre);
  fastify.get('/novlove/debug/redis/detail', debug.detail);
}
