// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  COPIED_MS,
  copyFrom,
  copyShortcut,
  initCopy,
} from '../src/scripts/copy';
import { pickCurrent } from '../src/scripts/toc';

const markup = `
  <figure class="code"><figcaption class="code-bar">
    <button class="copy" type="button" data-copy aria-label="Copy HTML snippet" hidden><span class="copy-t">Copy</span></button>
  </figcaption><pre><code>&lt;lm-card&gt;&lt;/lm-card&gt;</code></pre></figure>
  <p id="copy-live" aria-live="polite"></p>`;

describe('copy button', () => {
  beforeEach(() => {
    document.body.innerHTML = markup;
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());
  const btn = () =>
    document.querySelector<HTMLButtonElement>(
      'button[data-copy]',
    ) as HTMLButtonElement;

  it('stays hidden until JS runs, then shows', () => {
    expect(btn().hidden).toBe(true);
    expect(initCopy(document, { writeText: async () => {} })).toBe(1);
    expect(btn().hidden).toBe(false);
  });
  it('copies the code text, shows Copied and announces it', async () => {
    const writeText = vi.fn(async () => {});
    const ok = await copyFrom(btn(), { writeText });
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('<lm-card></lm-card>');
    expect(btn().hasAttribute('data-copied')).toBe(true);
    expect(btn().textContent?.trim()).toBe('Copied');
    expect(document.getElementById('copy-live')?.textContent).toBe(
      'Copied to clipboard',
    );
  });
  it('returns to idle after 2000ms', async () => {
    await copyFrom(btn(), { writeText: async () => {} });
    vi.advanceTimersByTime(COPIED_MS);
    expect(btn().hasAttribute('data-copied')).toBe(false);
    expect(btn().textContent?.trim()).toBe('Copy');
    expect(document.getElementById('copy-live')?.textContent).toBe('');
  });
  it('on clipboard failure selects the code and says Press Ctrl+C', async () => {
    const ok = await copyFrom(btn(), {
      platform: 'Linux x86_64',
      writeText: async () => {
        throw new Error('denied');
      },
    });
    expect(ok).toBe(false);
    expect(btn().hasAttribute('data-copied')).toBe(false);
    expect(btn().textContent?.trim()).toBe('Press Ctrl+C');
    expect(window.getSelection()?.toString()).toContain('<lm-card>');
  });
});

describe('copy shortcut', () => {
  it('says ⌘C on Apple platforms and Ctrl+C elsewhere', () => {
    expect(copyShortcut('MacIntel')).toBe('⌘C');
    expect(copyShortcut('macOS')).toBe('⌘C');
    expect(copyShortcut('iPhone')).toBe('⌘C');
    expect(copyShortcut('Win32')).toBe('Ctrl+C');
    expect(copyShortcut('Linux x86_64')).toBe('Ctrl+C');
  });
  it('uses ⌘C in the fallback label and announcement on Mac', async () => {
    document.body.innerHTML = markup;
    const b = document.querySelector<HTMLButtonElement>(
      'button[data-copy]',
    ) as HTMLButtonElement;
    await copyFrom(b, {
      platform: 'MacIntel',
      writeText: async () => {
        throw new Error('denied');
      },
    });
    expect(b.textContent?.trim()).toBe('Press ⌘C');
    expect(document.getElementById('copy-live')?.textContent).toBe(
      'Copy failed. Code selected, press ⌘C.',
    );
  });
});

describe('on this page', () => {
  it('picks the last heading scrolled past the offset, else the first', () => {
    const ids = ['a', 'b', 'c'];
    expect(
      pickCurrent(
        ids,
        new Map([
          ['a', 300],
          ['b', 900],
          ['c', 1500],
        ]),
        96,
      ),
    ).toBe('a');
    expect(
      pickCurrent(
        ids,
        new Map([
          ['a', -400],
          ['b', 50],
          ['c', 700],
        ]),
        96,
      ),
    ).toBe('b');
    expect(
      pickCurrent(
        ids,
        new Map([
          ['a', -900],
          ['b', -500],
          ['c', 10],
        ]),
        96,
      ),
    ).toBe('c');
  });
});
