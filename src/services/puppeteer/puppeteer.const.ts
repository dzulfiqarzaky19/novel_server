export const PUPPETEER_CONFIG = {
  name: 'puppeteer',
  waitOption: 'networkidle2',
  timeout: { navigation: 30_000, selector: 10_000 },
  viewport: { width: 1280, height: 1024 },
  assets: {
    isBlocked: true,
    types: ['image', 'media'] as string[],
  },
} as const;

export const PUPPETEER_EXECUTABLE_PATH = [
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
] as const;

export const PUPPETEER_LAUNCH_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--no-zygote',
  '--single-process',
  '--disable-gpu',
  `--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
];
