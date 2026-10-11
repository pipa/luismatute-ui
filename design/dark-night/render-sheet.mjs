import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const here = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const base = 'http://127.0.0.1:3400/design/dark-night/';
for (const [f, out, w] of [['sheet.html', 'night-sheet.png', 2400], ['sheet-v2.html', 'night-sheet-v2.png', 2800], ['swatches.html', 'swatches.png', 600]]) {
  const p = await b.newPage({ viewport: { width: w, height: 200 } }); await p.goto(base + f, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: path.join(here, out), fullPage: true }); await p.close();
}
await b.close();
