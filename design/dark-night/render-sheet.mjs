import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { chromium } from '/workspace/team/luismatute/design/ui-fidelity/harness/node_modules/playwright/index.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch(); const base = 'http://127.0.0.1:3400/design/dark-night/';
for (const [f, out, w] of [['sheet.html', 'night-sheet.png', 2400], ['swatches.html', 'swatches.png', 600]]) {
  const p = await b.newPage({ viewport: { width: w, height: 200 } }); await p.goto(base + f, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: path.join(here, out), fullPage: true }); await p.close();
}
await b.close();
