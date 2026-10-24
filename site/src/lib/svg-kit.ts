/**
 * SVG kit items, read at build time from dist/illustrations/*.svg (#18).
 * Old file names from #59 map to their generic ids; files with no generic
 * id yet are left out so no old id is shown or copied.
 */
const files = import.meta.glob('../../../dist/illustrations/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Old dist file name -> generic id exported by the package. */
export const RENAMED: Record<string, string> = {
  'island-sandals': 'island-resort',
  'island-fluky': 'island-studio',
};
/** Old file names that also ship under their generic id (#18); never listed. */
export const HIDDEN = new Set(['island-aa', 'island-bsc']);

export interface KitItem {
  id: string;
  /** Path import works only when the file name is already the generic id. */
  file: boolean;
}

export const fileNames = Object.keys(files)
  .map((p) =>
    p
      .split('/')
      .pop()!
      .replace(/\.svg$/, ''),
  )
  .sort();

export const kitItems: KitItem[] = fileNames
  .filter((n) => !HIDDEN.has(n))
  .map((n) => ({ id: RENAMED[n] ?? n, file: !(n in RENAMED) }))
  .sort((a, b) => a.id.localeCompare(b.id));

/** The one line a tile shows: the file import, or the inline call when there is no generic file. */
export function pathLine(item: KitItem): string {
  return item.file
    ? `import url from '@luismatute/ui/illustrations/${item.id}.svg';`
    : `inlineIllustration('${item.id}');`;
}

export const INLINE_EXAMPLE = `import { inlineIllustration } from '@luismatute/ui/illustrations';

// Inline art reads the --lm-* tokens, so it follows data-theme on its container.
el.innerHTML = inlineIllustration('palm');

// As a file (fills fall back to their built-in colours):
import url from '@luismatute/ui/illustrations/palm.svg';`;

export function snippet(item: KitItem): string {
  const lines = [
    `import { inlineIllustration } from '@luismatute/ui/illustrations';`,
  ];
  if (item.file)
    lines.unshift(
      `import url from '@luismatute/ui/illustrations/${item.id}.svg';`,
      `// <img src={url} alt="" />`,
    );
  lines.push(
    `// Inline, so fills follow the --lm-* tokens:`,
    `el.innerHTML = inlineIllustration('${item.id}');`,
  );
  return lines.join('\n');
}
