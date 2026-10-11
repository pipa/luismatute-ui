import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium, firefox, webkit } from 'playwright';

const base = process.env.BASE ?? 'http://127.0.0.1:4179/ui/';
const label = process.env.LABEL ?? 'starlight';
const out = process.env.OUT ?? `results/csp-${label}.json`;

const engines = [
  ['chromium', chromium],
  ['firefox', firefox],
  ['webkit', webkit],
];

function isViolation(text) {
  return /content security policy|content-security-policy|refused to (execute|apply|load|compile|create)|blocked:csp/i.test(
    text,
  );
}

async function step(features, name, fn) {
  try {
    features[name] = await fn();
  } catch (error) {
    features[name] = error instanceof Error ? error.message : String(error);
  }
}

async function exerciseStarlight(page) {
  const features = {};
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: 'load' });
  await step(features, 'themeDefined', () =>
    page.evaluate(() => customElements.get('starlight-theme-select') !== undefined),
  );
  await step(features, 'themeLight', async () => {
    await page.locator('starlight-theme-select select').first().selectOption('light');
    return page.evaluate(() => document.documentElement.dataset.theme === 'light');
  });
  await step(features, 'themeDark', async () => {
    await page.locator('starlight-theme-select select').first().selectOption('dark');
    return page.evaluate(() => document.documentElement.dataset.theme === 'dark');
  });
  await step(features, 'toc', async () => {
    const link = page.locator('a[href="#install"]').locator('visible=true').first();
    await link.click();
    return new URL(page.url()).hash === '#install';
  });
  await step(features, 'copy', async () => {
    await page.locator('.expressive-code .copy button').first().click();
    await page.waitForTimeout(200);
    return (await page.locator('.expressive-code .feedback.show, .expressive-code .feedback').count()) > 0;
  });
  await step(features, 'search', async () => {
    await page.locator('button[data-open-modal]').first().click();
    const input = page.locator('#starlight__search input, .pagefind-ui input').first();
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill('boarding-pass-demo');
    await page.waitForTimeout(1000);
    return page.locator('.pagefind-ui__result, .pagefind-ui__result-link').count();
  });
  return features;
}

async function exerciseCustom(page) {
  const features = {};
  await page.goto(base, { waitUntil: 'load' });
  const select = page.locator('#theme');
  await select.selectOption('light');
  features.themeLight = await page.evaluate(() => document.documentElement.dataset.theme === 'light');
  await select.selectOption('dark');
  features.themeDark = await page.evaluate(() => document.documentElement.dataset.theme === 'dark');
  await page.locator('a[href="#install"]').click();
  features.tocHash = new URL(page.url()).hash === '#install';
  await page.locator('[data-copy]').click();
  features.copyFeedback = await page.evaluate(() => document.querySelector('[data-copy-status]')?.hidden === false);
  const input = page.locator('.pagefind-ui input, #search input').first();
  try {
    await input.waitFor({ state: 'visible', timeout: 4000 });
    features.searchInput = true;
    await input.fill('sandals-stop-card');
    await page.waitForTimeout(800);
    features.searchHits = await page.locator('.pagefind-ui__result, .pagefind-ui__result-link').count();
  } catch {
    features.searchInput = false;
    features.searchHits = 0;
  }
  return features;
}

const exercise = label.startsWith('custom') ? exerciseCustom : exerciseStarlight;
const report = { label, base, engines: {} };

for (const [name, browserType] of engines) {
  const browser = await browserType.launch();
  const context = await browser.newContext();
  if (name === 'chromium') {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  }
  const page = await context.newPage();
  const messages = [];
  const errors = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (isViolation(text)) messages.push({ type: msg.type(), text });
    else if (msg.type() === 'error' || msg.type() === 'warning') errors.push({ type: msg.type(), text });
  });
  page.on('pageerror', (error) => {
    messages.push({ type: 'pageerror', text: error.message });
  });
  let features = {};
  let failed;
  try {
    features = await exercise(page);
  } catch (error) {
    failed = error instanceof Error ? error.message : String(error);
  }
  report.engines[name] = {
    violations: messages.length,
    messages,
    errors,
    features,
    failed,
  };
  await browser.close();
  console.log(`${name}: ${messages.length} violation message(s)`);
  for (const message of messages) console.log(`  - ${message.text.slice(0, 240)}`);
  console.log('  features', features, failed ?? '');
}

mkdirSync(out.split('/').slice(0, -1).join('/') || '.', { recursive: true });
writeFileSync(out, JSON.stringify(report, null, 2));
console.log(`wrote ${out}`);
