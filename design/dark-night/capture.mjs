// node capture.mjs  (serve the repo root on 127.0.0.1:3400 first)
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '/workspace/team/luismatute/design/ui-fidelity/harness/node_modules/playwright/index.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const base = 'http://127.0.0.1:3400/design/docs-shell/mock/index.html';
const nightCss = await readFile(path.join(here, 'night.css'), 'utf8');
const browser = await chromium.launch();
const variants = [['light', 'light', false], ['dark-current', 'dark', false], ['dark-night', 'dark', true]];
const sizes = [[1280, 800], [375, 812]];
for (const [name, theme, night] of variants) for (const [w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => localStorage.setItem('lm.ui.theme', t), theme);
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  if (night) await page.addStyleTag({ content: nightCss });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(here, 'shots', `${name}-${w}.png`), fullPage: process.env.FULL === '1' });
  {
    await page.keyboard.press('Shift');
    await page.evaluate(() => document.querySelector('[data-shot-focus]')?.focus({ preventScroll: true }));
    // a second still lower down, where code, table and callouts sit
    const y = await page.evaluate(() => { const el = document.querySelector('.docs-code'); return el ? el.getBoundingClientRect().top + scrollY - (innerWidth < 640 ? 20 : 120) : 0; });
    await page.evaluate((yy) => scrollTo(0, yy), y);
    await page.screenshot({ path: path.join(here, 'shots', `${name}-${w}-code.png`) });
  }
  await ctx.close();
}
await browser.close();
