import puppeteer, { Browser } from 'puppeteer';
import fs from 'node:fs';

type BrowserState = {
  activeBrowserInstance: Browser | null;
  launchInProgress: Promise<Browser> | null;
};

const browserState: BrowserState = {
  activeBrowserInstance: null,
  launchInProgress: null,
};

function resolveExecutablePath(): string | undefined {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    // Linux:
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    // macOS:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // Windows:
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean) as string[];

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
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
      ],
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
