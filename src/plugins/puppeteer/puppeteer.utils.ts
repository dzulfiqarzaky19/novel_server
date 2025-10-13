import puppeteer, { Browser } from 'puppeteer';
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

export const getSharedBrowserInstance = async (): Promise<Browser> => {
  if (browserState.activeBrowserInstance) {
    return browserState.activeBrowserInstance;
  }

  if (browserState.launchInProgress) {
    return browserState.launchInProgress;
  }

  const executablePath = resolveExecutablePath();

  const launching = puppeteer
    .launch({
      headless: true,
      args: PUPPETEER_LAUNCH_ARGS,
      ...(executablePath ? { executablePath } : {}),
    })
    .then((launchedBrowser) => {
      browserState.activeBrowserInstance = launchedBrowser;
      browserState.launchInProgress = null;

      launchedBrowser.on('disconnected', () => {
        browserState.activeBrowserInstance = null;

        browserState.launchInProgress = null;
      });

      return launchedBrowser;
    })
    .catch((error) => {
      browserState.launchInProgress = null;

      throw error;
    });

  browserState.launchInProgress = launching;

  return launching;
};

export const closeSharedBrowserInstance = async (): Promise<void> => {
  if (browserState.activeBrowserInstance) {
    await browserState.activeBrowserInstance.close();

    browserState.activeBrowserInstance = null;
  }
};
