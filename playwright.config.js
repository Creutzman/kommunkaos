import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4173/kommunkaos/',
    // Optional system Chrome for local runs; CI uses Playwright's pinned Chromium.
    launchOptions: process.env.PLAYWRIGHT_CHROME_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH } : {},
  },
  projects: [
    { name: 'mobile', use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: { command: 'npm run preview -- --host 127.0.0.1', port: 4173, reuseExistingServer: !process.env.CI },
});
