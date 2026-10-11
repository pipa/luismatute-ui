import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  testDir: 'tests/qa',
  timeout: 60_000,
  fullyParallel: true,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
  },
  webServer: {
    command: 'python3 -m http.server 4173',
    cwd: 'docs-dist',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
