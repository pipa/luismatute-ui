import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = here;
const base = 'http://127.0.0.1:4174/design/docs-shell/mock';

await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--font-render-hinting=none'],
});

async function openPage(theme, viewport, urlPath) {
  const context = await browser.newContext({
    viewport,
    colorScheme: theme === 'dark' ? 'dark' : 'light',
    deviceScaleFactor: 1,
  });
  await context.addInitScript((next) => {
    if (next === 'auto') localStorage.removeItem('lm.ui.theme');
    else localStorage.setItem('lm.ui.theme', next);
  }, theme);
  const page = await context.newPage();
  await page.goto(`${base}/${urlPath}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}

const pages = [
  ['component-1440-light', 'light', { width: 1440, height: 900 }, 'index.html'],
  ['component-1440-dark', 'dark', { width: 1440, height: 900 }, 'index.html'],
  ['component-1280-light', 'light', { width: 1280, height: 800 }, 'index.html'],
  ['component-1280-dark', 'dark', { width: 1280, height: 800 }, 'index.html'],
  ['component-768-light', 'light', { width: 768, height: 1024 }, 'index.html'],
  ['component-768-dark', 'dark', { width: 768, height: 1024 }, 'index.html'],
  ['component-375-light', 'light', { width: 375, height: 812 }, 'index.html'],
  ['component-375-dark', 'dark', { width: 375, height: 812 }, 'index.html'],
  ['home-1440-light', 'light', { width: 1440, height: 900 }, 'home.html'],
  ['home-1440-dark', 'dark', { width: 1440, height: 900 }, 'home.html'],
];

for (const [name, theme, viewport, urlPath] of pages) {
  const { context, page } = await openPage(theme, viewport, urlPath);
  await page.screenshot({
    path: path.join(out, `${name}.png`),
    animations: 'disabled',
  });
  await context.close();
}

{
  const { context, page } = await openPage(
    'light',
    { width: 1440, height: 900 },
    'index.html',
  );
  const code = page.locator('.docs-code').first();
  await code.screenshot({ path: path.join(out, 'code-idle.png') });
  await page.locator('#copy-states .docs-copy.is-hover').screenshot({
    path: path.join(out, 'code-hover.png'),
  });
  const focusBtn = page.locator('[data-shot-focus]');
  await focusBtn.focus();
  await page.locator('#copy-states').screenshot({
    path: path.join(out, 'copy-states.png'),
  });
  await page.locator('.docs-theme').screenshot({
    path: path.join(out, 'theme-toggle.png'),
  });
  await page
    .locator('.docs-swatches')
    .first()
    .screenshot({
      path: path.join(out, 'token-copy.png'),
    });
  await context.close();
}

{
  const { context, page } = await openPage(
    'light',
    { width: 1440, height: 900 },
    'index.html?shot=search',
  );
  await page.locator('.docs-search-panel').screenshot({
    path: path.join(out, 'search-dialog.png'),
  });
  await context.close();
}

{
  const { context, page } = await openPage(
    'light',
    { width: 1440, height: 900 },
    'index.html?shot=search-empty',
  );
  await page.locator('.docs-search-panel').screenshot({
    path: path.join(out, 'search-empty.png'),
  });
  await context.close();
}

{
  const { context, page } = await openPage(
    'light',
    { width: 375, height: 812 },
    'index.html?shot=drawer',
  );
  await page.screenshot({
    path: path.join(out, 'phone-drawer.png'),
    animations: 'disabled',
  });
  await context.close();
}

{
  const { context, page } = await openPage(
    'light',
    { width: 1440, height: 900 },
    '404.html',
  );
  await page.screenshot({
    path: path.join(out, '404-1440-light.png'),
    animations: 'disabled',
  });
  await context.close();
}

await browser.close();
console.log(`wrote shots to ${out}`);
