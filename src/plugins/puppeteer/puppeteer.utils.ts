import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import fs from 'node:fs';

import { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import {
  PUPPETEER_EXECUTABLE_PATH,
  PUPPETEER_LAUNCH_ARGS,
} from './puppeteer.const.js';

type BrowserState = {
  activeBrowserInstance: Browser | null;
  launchInProgress: Promise<Browser> | null;
};

const browserState: BrowserState = {
  activeBrowserInstance: null,
  launchInProgress: null,
};

function resolveExecutablePath(): string | undefined {
  const candidates = PUPPETEER_EXECUTABLE_PATH.filter(Boolean) as string[];
  for (const p of candidates) {
    try {
      if (p && fs.existsSync(p)) return p;
    } catch {}
  }
  return undefined;
}

function withStealth<T>(launcher: T): T {
  const p = addExtra(launcher as any);

  if (process.env.USE_STEALTH === '1' || process.env.USE_STEALTH === 'true') {
    p.use(StealthPlugin());
  }

  return p as unknown as T;
}

/* === NEW: check if current browser is still connected === */
function isConnected(b?: Browser | null) {
  try {
    // puppeteer exposes isConnected(); cast avoids TS complaining on older types
    return !!b && (b as any).isConnected?.() !== false;
  } catch {
    return false;
  }
}

export const getSharedBrowserInstance = async (): Promise<Browser> => {
  /* === NEW: only reuse if still connected; otherwise drop it so we recreate cleanly === */
  if (
    browserState.activeBrowserInstance &&
    isConnected(browserState.activeBrowserInstance)
  ) {
    return browserState.activeBrowserInstance;
  }
  if (
    browserState.activeBrowserInstance &&
    !isConnected(browserState.activeBrowserInstance)
  ) {
    browserState.activeBrowserInstance = null;
  }

  if (browserState.launchInProgress) return browserState.launchInProgress;

  const wsEndpoint = `${process.env.BROWSERLESS_URL}=${process.env.BROWSERLESS_WS}`;

  const launching = (async () => {
    let browser: Browser;

    if (process.env.BUILD_TYPE === 'production') {
      const pptrConnect = withStealth(puppeteerCore);

      browser = await pptrConnect.connect({
        browserWSEndpoint: wsEndpoint,
        slowMo: 0,
        protocolTimeout: 45_000,
      });
    } else {
      const execPath = resolveExecutablePath();
      const pptrLaunch = withStealth(puppeteer);

      browser = await pptrLaunch.launch({
        headless: true,
        args: PUPPETEER_LAUNCH_ARGS,
        ...(execPath ? { executablePath: execPath } : {}),
      });
    }

    browser.on('disconnected', () => {
      browserState.activeBrowserInstance = null;
      browserState.launchInProgress = null;
    });

    browserState.activeBrowserInstance = browser;
    browserState.launchInProgress = null;
    return browser;
  })().catch((err) => {
    browserState.launchInProgress = null;
    throw err;
  });

  browserState.launchInProgress = launching;
  return launching;
};

export const closeSharedBrowserInstance = async (): Promise<void> => {
  if (!browserState.activeBrowserInstance) return;

  try {
    /* === NEW: in production (WS/remote) prefer disconnect() instead of close() === */
    if (
      process.env.BUILD_TYPE === 'production' &&
      typeof (browserState.activeBrowserInstance as any).disconnect ===
        'function'
    ) {
      (browserState.activeBrowserInstance as any).disconnect();
    } else {
      await browserState.activeBrowserInstance.close();
    }
  } finally {
    browserState.activeBrowserInstance = null;
    browserState.launchInProgress = null;
  }
};
