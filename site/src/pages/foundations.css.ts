import type { APIRoute } from 'astro';
import {
  borders,
  colours,
  durations,
  easings,
  families,
  fontSizes,
  nightColours,
  radii,
  slug,
  spaces,
} from '../lib/tokens';

/**
 * Per-token classes for the Foundations pages, served as an external
 * stylesheet so no page needs a style attribute (CSP style-src-attr 'none').
 * Swatches use the literal value painted over a fixed base (day paper or
 * night sky), so alpha colours look the same in both modes and the label
 * contrast computed at build time holds.
 */
export const GET: APIRoute = () => {
  const rules: string[] = [];
  for (const t of colours)
    rules.push(
      `.sw-${slug(t.name)}{background-color:#fff6e4;box-shadow:inset 0 0 0 100vmax ${t.value}}`,
    );
  for (const t of nightColours)
    rules.push(
      `.sw-night-${slug(t.name)}{background-color:#120d2c;box-shadow:inset 0 0 0 100vmax ${t.value}}`,
    );
  for (const t of families)
    rules.push(`.ff-${slug(t.name)}{font-family:var(${t.name})}`);
  for (const t of fontSizes)
    rules.push(`.fs-${slug(t.name)}{font-size:var(${t.name})}`);
  for (const t of spaces)
    rules.push(`.sp-${slug(t.name)}{width:var(${t.name})}`);
  for (const t of radii)
    rules.push(`.rd-${slug(t.name)}{border-radius:var(${t.name})}`);
  for (const t of borders)
    rules.push(`.bd-${slug(t.name)}{border-width:var(${t.name})}`);
  for (const t of easings)
    rules.push(`.ez-${slug(t.name)}{--lm-docs-demo-ease:var(${t.name})}`);
  for (const t of durations)
    rules.push(`.du-${slug(t.name)}{--lm-docs-demo-dur:var(${t.name})}`);
  return new Response(`${rules.join('\n')}\n`, {
    headers: { 'content-type': 'text/css' },
  });
};
