import { defineConfig } from 'playwright/test';

// E2E_PORT picks the static server port (default 4173); see README > "Ports (E2E_PORT)".
const port = Number(process.env.E2E_PORT ?? 4173);

export default defineConfig({
  testDir: 'tests/visual',
  timeout: 60_000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
  },
  webServer: {
    command: `python3 -m http.server ${port} --bind 127.0.0.1`,
    cwd: 'docs-dist',
    port,
    reuseExistingServer: false,
  },
});
