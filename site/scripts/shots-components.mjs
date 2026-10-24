// Proof stills for #18 component pages: site/shots/<w>/<slug>[-open]-<mode>.png.
// Usage: pnpm build:site && node site/scripts/shots-components.mjs [port] [slug...]
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.argv[2] ?? 3201);
const slugs = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ['lm-globe', 'lm-flight-plan'];
const srv = spawn('node', ['site/e2e/serve.mjs', String(port)], {
  stdio: 'inherit',
});
await new Promise((r) => setTimeout(r, 600));
const browser = await chromium.launch();
try {
  for (const w of [375, 768, 1280, 1440]) {
    mkdirSync(`site/shots/${w}`, { recursive: true });
    for (const slug of slugs) {
      for (const mode of ['day', 'night']) {
        const page = await browser.newPage({
          viewport: { width: w, height: 900 },
        });
        await page.goto(
          `http://127.0.0.1:${port}/ui/components/${slug}/?mode=${mode}&motion=reduce`,
        );
        await page.locator('.demo-stage :defined').first().waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: `site/shots/${w}/${slug}-${mode}.png` });
        if (slug === 'lm-globe') {
          await page.getByRole('button', { name: 'Open route map' }).click();
          await page.getByRole('dialog').waitFor();
          await page.screenshot({
            path: `site/shots/${w}/${slug}-open-${mode}.png`,
          });
        }
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
  srv.kill();
}
