import { defineConfig, devices } from 'playwright/test';

// Docs site e2e; run `pnpm build:site` first. E2E_PORT picks the port; the
// default (4174) differs from the root suites' 4173 so they never collide.
const port = Number(process.env.E2E_PORT ?? 4174);
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
