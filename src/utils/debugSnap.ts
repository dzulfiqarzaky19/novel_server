import { promises as fs } from 'node:fs';
import { join, isAbsolute } from 'node:path';
import type { Page } from 'puppeteer';

const DEFAULT_DIR = join(process.cwd(), 'snaps');

const configured = process.env.DEBUG_SNAPSHOTS_DIR;

const BASE_DIR = configured
  ? isAbsolute(configured)
    ? configured
    : join(process.cwd(), configured)
  : DEFAULT_DIR;

export async function saveDebugArtifacts(
  page: Page,
  tag: string,
  log?: (o: any, msg: string) => void,
) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const base = `${tag}-${ts}`;
  const png = join(BASE_DIR, `${base}.png`);
  const htmlPath = join(BASE_DIR, `${base}.html`);

  await fs.mkdir(BASE_DIR, { recursive: true }).catch(() => {});

  try {
    await page.screenshot({ path: png as `${string}.png`, fullPage: true });
  } catch (e) {
    log?.({ e, png }, 'screenshot failed');
  }
  try {
    const html = await page.content();
    await fs.writeFile(htmlPath, html, 'utf8');
  } catch (e) {
    log?.({ e, htmlPath }, 'html write failed');
  }

  log?.({ png, htmlPath }, 'debug artifacts saved');
  return { png, html: htmlPath };
}
