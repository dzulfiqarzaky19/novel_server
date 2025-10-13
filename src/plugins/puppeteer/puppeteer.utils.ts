// src/plugins/puppeteer/puppeteer.utils.ts
import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import fs from 'node:fs';

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

function isConnected(b?: Browser | null) {
  try {
    return !!b && (b as any).isConnected?.() !== false;
  } catch {
    return false;
  }
}

export const getSharedBrowserInstance = async (): Promise<Browser> => {
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

  const wsEndpoint =
    process.env.BROWSERLESS_WS ||
    `${process.env.BROWSERLESS_URL}=${process.env.BROWSERLESS_WS}`;

  const launching = (async () => {
    let browser: Browser;

    if (process.env.BUILD_TYPE === 'production') {
      browser = await puppeteerCore.connect({
        browserWSEndpoint: wsEndpoint,
        slowMo: 0,
        protocolTimeout: 45_000,
      });
    } else {
      const execPath = resolveExecutablePath();

      browser = await puppeteer.launch({
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
    // In production (remote WS), prefer disconnect() so upstream stays healthy
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
