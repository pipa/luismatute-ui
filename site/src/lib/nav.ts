import pkg from '../../../package.json';

/** Docs sidebar: groups and pages from pipa/luismatute-ui #18. */
export interface NavItem {
  /** Path under the base, no leading or trailing slash. */
  slug: string;
  label: string;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const nav: NavGroup[] = [
  {
    label: 'Getting started',
    items: [
      {
        slug: 'getting-started/install-from-a-tag',
        label: 'Install from a tag',
      },
      { slug: 'getting-started/astro-usage', label: 'Astro usage' },
      { slug: 'getting-started/bare-imports', label: 'Bare imports' },
    ],
  },
  {
    label: 'Foundations',
    items: [
      { slug: 'foundations/colour', label: 'Colour' },
      { slug: 'foundations/type', label: 'Type' },
      { slug: 'foundations/spacing', label: 'Spacing' },
      { slug: 'foundations/motion-tokens', label: 'Motion tokens' },
    ],
  },
  {
    label: 'Components',
    items: [
      'lm-card',
      'lm-chip',
      'lm-more',
      'lm-motion-toggle',
      'lm-pause',
      'lm-shot',
      'lm-avatar',
      'lm-globe',
      'lm-flight-plan',
    ].map((n) => ({ slug: `components/${n}`, label: n })),
  },
  {
    label: 'Illustrations',
    items: [{ slug: 'illustrations/svg-kit', label: 'SVG kit' }],
  },
  {
    label: 'Changelog',
    items: [{ slug: 'changelog', label: pkg.version }],
  },
];

export const allItems: NavItem[] = nav.flatMap((g) => g.items);

/** Joins the base ('/ui/') and a slug into a trailing-slash href. */
export function hrefFor(base: string, slug: string): string {
  const b = base.endsWith('/') ? base : `${base}/`;
  return slug ? `${b}${slug.replace(/^\/+|\/+$/g, '')}/` : b;
}

/** The slug of a pathname under base, or null when outside it. */
export function slugOf(base: string, pathname: string): string | null {
  const b = base.endsWith('/') ? base : `${base}/`;
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (p === b || p === b.slice(0, -1)) return '';
  if (!p.startsWith(b)) return null;
  return p.slice(b.length).replace(/\/+$/, '');
}

export function groupOf(slug: string): NavGroup | undefined {
  return nav.find((g) => g.items.some((i) => i.slug === slug));
}

export function neighbours(slug: string): {
  prev: NavItem | undefined;
  next: NavItem | undefined;
} {
  const i = allItems.findIndex((x) => x.slug === slug);
  if (i < 0) return { prev: undefined, next: allItems[0] };
  return { prev: allItems[i - 1], next: allItems[i + 1] };
}
