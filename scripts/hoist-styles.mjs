import { createHash } from 'node:crypto';

/** Move presentation `style` attributes onto hashed `lm-ix-*` classes. */
export function hoistInlineStyles(svg) {
  const rules = new Map();
  const next = svg.replace(
    /<([A-Za-z][\w:.-]*)(\s[^>]*?)?>/g,
    (full, tag, attrs = '') => {
      const style = attrs.match(/\sstyle="([^"]*)"/);
      if (!style) return full;
      const value = style[1].trim();
      let rest = attrs.replace(style[0], '');
      if (!value) return `<${tag}${rest}>`;
      const id = createHash('sha1').update(value).digest('hex').slice(0, 6);
      const cls = `lm-ix-${id}`;
      rules.set(cls, value);
      if (/\sclass="/.test(rest)) {
        rest = rest.replace(/class="([^"]*)"/, (_, names) => {
          const parts = names.split(/\s+/).filter(Boolean);
          if (!parts.includes(cls)) parts.push(cls);
          return `class="${parts.join(' ')}"`;
        });
      } else {
        rest += ` class="${cls}"`;
      }
      return `<${tag}${rest}>`;
    },
  );
  return { svg: next, rules };
}

export function rulesToCss(rules) {
  let css = '';
  for (const [cls, value] of rules) {
    const decls = value
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean);
    css += `:where(.lm-art) .${cls} {\n`;
    for (const decl of decls) {
      const splitAt = decl.indexOf(':');
      const prop = decl.slice(0, splitAt).trim();
      const val = decl.slice(splitAt + 1).trim();
      css += `  ${prop}: ${val};\n`;
    }
    css += '}\n';
  }
  return css;
}
