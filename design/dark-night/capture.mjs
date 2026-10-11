// node capture.mjs  (serve the repo root on 127.0.0.1:3400 first)
import path from 'node:path';
import { copyFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const base = 'http://127.0.0.1:3400/design/docs-shell/mock/index.html';
const nightCss = await readFile(path.join(here, 'night.css'), 'utf8');
const chrome = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const browser = await chromium.launch({
  executablePath: chrome,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

async function shoot(file, theme, css, { w, h, query = '', scroll = 'top' }) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    colorScheme: theme,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  await ctx.addInitScript((t) => localStorage.setItem('lm.ui.theme', t), theme);
  const page = await ctx.newPage();
  await page.goto(base + query, { waitUntil: 'networkidle' });
  if (css) await page.addStyleTag({ content: css });
  await page.evaluate(() => document.fonts.ready);
  if (scroll === 'code') {
    await page.keyboard.press('Shift');
    await page.evaluate(() => document.querySelector('[data-shot-focus]')?.focus({ preventScroll: true }));
    const y = await page.evaluate(() => {
      const el = document.querySelector('.docs-code');
      return el ? el.getBoundingClientRect().top + scrollY - (innerWidth < 640 ? 20 : 120) : 0;
    });
    await page.evaluate((yy) => scrollTo(0, yy), y);
  }
  if (scroll === 'search') {
    await page.locator('#docs-search:not([hidden])').waitFor({ state: 'visible' });
  }
  await page.screenshot({ path: path.join(here, 'shots', file) });
  await ctx.close();
}

const sizes = [1280, 375];
for (const w of sizes) {
  const h = w === 1280 ? 800 : 812;
  await shoot(`v2-${w}.png`, 'dark', nightCss, { w, h });
  await shoot(`v2-${w}-code.png`, 'dark', nightCss, { w, h, scroll: 'code' });
  await shoot(`v2-${w}-search.png`, 'dark', nightCss, { w, h, query: '?shot=search', scroll: 'search' });
  await shoot(`light-${w}-search.png`, 'light', null, { w, h, query: '?shot=search', scroll: 'search' });
}

try {
  const v1 = await readFile('/tmp/night-v1.css', 'utf8');
  for (const w of sizes) {
    const h = w === 1280 ? 800 : 812;
    await shoot(`dark-night-${w}-search.png`, 'dark', v1, { w, h, query: '?shot=search', scroll: 'search' });
  }
} catch {
  console.log('no /tmp/night-v1.css, skipped first-pass search stills');
}

await copyFile(path.join(here, 'shots', 'v2-1280.png'), path.join(here, 'night-v2-1280.png'));
await browser.close();
