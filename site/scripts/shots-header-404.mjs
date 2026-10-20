// Proof stills for #18 header + 404: site/shots/<w>/{header,404}-<mode>.png.
// Usage: pnpm build:site && node site/scripts/shots-header-404.mjs [port]
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.argv[2] ?? 3201);
const srv = spawn('node', ['site/e2e/serve.mjs', String(port)], { stdio: 'inherit' });
await new Promise((r) => setTimeout(r, 600));
const browser = await chromium.launch();
try {
  for (const w of [375, 768, 1280, 1920]) {
    mkdirSync(`site/shots/${w}`, { recursive: true });
    for (const mode of ['day', 'night']) {
      const page = await browser.newPage({ viewport: { width: w, height: 900 } });
      await page.goto(`http://127.0.0.1:${port}/ui/getting-started/install-from-a-tag/?mode=${mode}&motion=reduce`);
      await page.locator('[data-theme-switch]:not([hidden])').waitFor();
      await page.locator('.head').screenshot({ path: `site/shots/${w}/header-${mode}.png` });
      await page.goto(`http://127.0.0.1:${port}/ui/404.html?mode=${mode}&motion=reduce`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `site/shots/${w}/404-${mode}.png` });
      await page.close();
    }
  }
} finally {
  await browser.close();
  srv.kill();
}
