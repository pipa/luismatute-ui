import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { expect, type Page, test } from 'playwright/test';

// #50: which pages the Pagefind index covers. Run `pnpm build:site` first.
// Decision: every docs page is indexed, including the home page (/ui/); the
// 404 page is excluded on purpose (Docs.astro `bare` drops data-pagefind-body
// and its root has data-pagefind-ignore),
// so a search never offers "Page not found" as a result.
const dist = new URL('../../site-dist/', import.meta.url).pathname;

function htmlPages(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory())
      return f === 'pagefind' || f.startsWith('_') ? [] : htmlPages(p);
    return f.endsWith('.html') ? [p] : [];
  });
}

/** /ui/ URL Pagefind stores for a built file. */
const urlOf = (file: string) =>
  `/ui/${relative(dist, file).replace(/index\.html$/, '')}`;

/** Every URL in the index, through the same pagefind.js the dialog loads. */
async function indexedUrls(page: Page): Promise<string[]> {
  await page.goto('/ui/');
  return page.evaluate(async () => {
    const pf = await import('/ui/pagefind/pagefind.js' as string);
    await pf.options({ baseUrl: '/ui/' });
    const r = await pf.search(null);
    const data = await Promise.all(
      r.results.map((x: { data(): Promise<{ url: string }> }) => x.data()),
    );
    return data.map((d: { url: string }) => d.url).sort();
  });
}

test('index has every built page except 404', async ({ page }) => {
  const expected = htmlPages(dist)
    .filter((f) => !f.endsWith('404.html'))
    .map(urlOf)
    .sort();
  expect(expected).toContain('/ui/');
  expect(await indexedUrls(page)).toEqual(expected);
});

test('home page is searchable', async ({ page }) => {
  await page.goto('/ui/');
  const urls = await page.evaluate(async () => {
    const pf = await import('/ui/pagefind/pagefind.js' as string);
    await pf.options({ baseUrl: '/ui/' });
    const r = await pf.search('Wheels up illustration kit');
    const d = await Promise.all(
      r.results.map((x: { data(): Promise<{ url: string }> }) => x.data()),
    );
    return d.map((x: { url: string }) => x.url);
  });
  expect(urls).toContain('/ui/');
});

test('404 is excluded on purpose', async ({ page }) => {
  const html = readFileSync(join(dist, '404.html'), 'utf8');
  expect(html).not.toContain('data-pagefind-body');
  expect(html).toMatch(/class="not-found"[^>]*data-pagefind-ignore/);
  await page.goto('/ui/');
  const urls = await page.evaluate(async () => {
    const pf = await import('/ui/pagefind/pagefind.js' as string);
    await pf.options({ baseUrl: '/ui/' });
    const r = await pf.search('flight was cancelled');
    const d = await Promise.all(
      r.results.map((x: { data(): Promise<{ url: string }> }) => x.data()),
    );
    return d.map((x: { url: string }) => x.url);
  });
  expect(urls.some((u: string) => u.includes('404'))).toBe(false);
});
