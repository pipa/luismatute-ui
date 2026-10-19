import { escapeHtml } from './highlight';

export interface ChangelogSection {
  id: string;
  title: string;
  html: string;
}

/** `code`, **bold** and [links](url) inside one already-escaped line. */
function inline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>');
}

export function slugify(s: string): string {
  return `v${s}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Turns CHANGELOG.md into one section per `## version`. Handles the subset
 * the file uses: `###` subheads, `-` lists with indented continuations,
 * and paragraphs. Everything is escaped first; no raw HTML passes through.
 */
export function parseChangelog(md: string): ChangelogSection[] {
  const sections: ChangelogSection[] = [];
  let cur: ChangelogSection | null = null;
  let out: string[] = [];
  let list: string[] | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list)
      out.push(
        `<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`,
      );
    list = null;
  };
  const flush = () => {
    flushPara();
    flushList();
    if (cur) cur.html = out.join('\n');
    out = [];
  };

  for (const raw of md.split('\n')) {
    const line = raw.trimEnd();
    const h2 = /^## (.+)$/.exec(line);
    if (h2) {
      flush();
      const title = h2[1] ?? '';
      const next: ChangelogSection = { id: slugify(title), title, html: '' };
      cur = next;
      sections.push(next);
      continue;
    }
    if (!cur || /^# /.test(line)) continue;
    const h3 = /^### (.+)$/.exec(line);
    if (h3) {
      flushPara();
      flushList();
      out.push(`<h3>${inline(h3[1] ?? '')}</h3>`);
    } else if (/^- /.test(line)) {
      flushPara();
      list ??= [];
      list.push(line.slice(2));
    } else if (line === '') {
      flushPara();
      flushList();
    } else if (list && /^\s+/.test(raw)) {
      list[list.length - 1] += ` ${line.trim()}`;
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flush();
  return sections;
}
