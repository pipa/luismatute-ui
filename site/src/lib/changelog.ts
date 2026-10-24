import { escapeHtml } from './highlight';

const REPO = 'https://github.com/pipa/luismatute-ui';
const SITE_REPO = 'https://github.com/pipa/luismatute.me';

export interface ChangelogGroup {
  id: string;
  title: string;
  html: string;
}
export interface ChangelogSection {
  /** Anchor id, e.g. `v0-2-1`. */
  id: string;
  /** Version without the v, e.g. `0.2.1`. */
  version: string;
  /** ISO date from `## 0.2.1 - 2026-10-15`, if given. */
  date?: string;
  /** Prose before the first `###`. */
  lead: string;
  groups: ChangelogGroup[];
}

// NUL and SOH mark placeholders between the replace passes below.
// Built with RegExp so the control characters are not regex literals.
const SITE_MARK = new RegExp(`${'\u0001'}(\\d+)`, 'g');
const CODE_MARK = new RegExp(`${'\u0000'}(\\d+)${'\u0000'}`, 'g');

const ref = (repo: string, n: string) =>
  `<a href="${repo}/issues/${n}">#${n}</a>`;

/** `code`, **bold**, [links](url) and #123 refs inside one line. Escapes first. */
export function inline(text: string): string {
  const codes: string[] = [];
  return (
    escapeHtml(text)
      .replace(
        /`([^`]+)`/g,
        (_, c: string) => `\u0000${codes.push(c) - 1}\u0000`,
      )
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>')
      // "luismatute.me #55/#56" points at the site repo, the rest at this one.
      .replace(
        /luismatute\.me ((?:#\d+[/–, ]*)+)/g,
        (_, refs: string) =>
          `luismatute.me ${refs.replace(/#(\d+)/g, '\u0001$1')}`,
      )
      .replace(/#(\d+)/g, (_, n: string) => ref(REPO, n))
      .replace(SITE_MARK, (_, n: string) => ref(SITE_REPO, n))
      .replace(CODE_MARK, (_, i: string) => `<code>${codes[Number(i)]}</code>`)
  );
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * CHANGELOG.md to one section per `## version - date`, newest first as written.
 * Handles the subset the file uses: `###` groups, `-` lists with indented
 * continuations, and paragraphs. "Unreleased" sections are dropped.
 */
export function parseChangelog(md: string): ChangelogSection[] {
  const sections: ChangelogSection[] = [];
  let sec: ChangelogSection | null = null;
  let group: ChangelogGroup | null = null;
  let out: string[] = [];
  let list: string[] | null = null;
  let para: string[] = [];

  const flushBlocks = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
    if (list)
      out.push(
        `<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`,
      );
    list = null;
  };
  const flushTarget = () => {
    flushBlocks();
    const html = out.join('\n');
    out = [];
    if (group) group.html = html;
    else if (sec) sec.lead = html;
  };

  for (const raw of md.split('\n')) {
    const line = raw.trimEnd();
    const h2 = /^## (.+)$/.exec(line);
    if (h2) {
      flushTarget();
      group = null;
      const m = /^v?(\S+?)(?:\s+[-–]\s+(\d{4}-\d{2}-\d{2}))?$/.exec(
        (h2[1] ?? '').trim(),
      );
      const version = m?.[1] ?? (h2[1] ?? '').trim();
      if (/^unreleased$/i.test(version)) {
        sec = null;
        continue;
      }
      const next: ChangelogSection = {
        id: slugify(`v${version}`),
        version,
        lead: '',
        groups: [],
      };
      if (m?.[2]) next.date = m[2];
      sec = next;
      sections.push(next);
      continue;
    }
    if (!sec || /^# /.test(line)) continue;
    const h3 = /^### (.+)$/.exec(line);
    if (h3) {
      flushTarget();
      const title = h3[1] ?? '';
      const g: ChangelogGroup = {
        id: `${sec.id}-${slugify(title.split(' (')[0] ?? title)}`,
        title,
        html: '',
      };
      group = g;
      sec.groups.push(g);
    } else if (/^- /.test(line)) {
      if (para.length) {
        out.push(`<p>${inline(para.join(' '))}</p>`);
        para = [];
      }
      list ??= [];
      list.push(line.slice(2));
    } else if (line === '') {
      flushBlocks();
    } else if (list && /^\s+/.test(raw)) {
      list[list.length - 1] += ` ${line.trim()}`;
    } else {
      if (list) flushBlocks();
      para.push(line.trim());
    }
  }
  flushTarget();
  return sections;
}
