import { describe, expect, it } from 'vitest';
import docsCss from '../src/styles/docs.css?raw';

// #18 prev/next fidelity (design/docs-shell/SPEC.md "Pager").
const rule = (sel: string) =>
  docsCss.match(
    new RegExp(`\\n${sel.replace(/[.]/g, '\\.')} \\{([^}]*)\\}`),
  )?.[1] ?? '';

describe('docs.css pager', () => {
  it('title is the 14.5px chip size, bold', () => {
    expect(rule('.pager strong')).toMatch(
      /font: 700 var\(--lm-font-size-chip\)/,
    );
  });
  it('tickets: pad 12 16, 44px min height, 220px min width, shot shadow', () => {
    const a = rule('.pager a');
    expect(a).toContain('padding: 12px 16px;');
    expect(a).toContain('min-height: var(--lm-docs-tap);');
    expect(a).toContain('min-width: min(100%, 220px);');
    expect(a).toContain('box-shadow: var(--lm-docs-shadow-hard);');
  });
  it('stacks only below 768, not at 860', () => {
    const m767 =
      docsCss.match(/@media \(max-width: 767px\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(m767).toMatch(/\.pager \{\s*grid-template-columns: 1fr;/);
    const m860 =
      docsCss.match(/@media \(max-width: 860px\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(m860).not.toContain('.pager');
  });
});
