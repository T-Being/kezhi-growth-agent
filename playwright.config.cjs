const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './app/tests',
  testMatch: '**/*.spec.cjs',
  timeout: 120000,
  workers: 1,
  retries: 0,
  globalSetup: './scripts/e2e-server.cjs',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4175',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
  },
});
