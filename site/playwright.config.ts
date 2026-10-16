import { defineConfig, devices } from 'playwright/test';

// Docs site e2e. Pixel's port range 3100-3109; run `pnpm build:site` first.
const port = 3102;
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  fullyParallel: true,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  use: { baseURL: `http://127.0.0.1:${port}` },
  webServer: {
    command: `node e2e/serve.mjs ${port}`,
    port,
    reuseExistingServer: false,
  },
});
