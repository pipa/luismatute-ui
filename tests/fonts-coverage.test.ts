import { readdirSync, readFileSync } from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';

// Every shipped face must cover Basic Latin, Latin-1 Supplement, Latin Extended-A
// and the punctuation the copy uses (issue #15). Rebuild with scripts/build-fonts.py.
const range = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);
const REQUIRED = [
  ...range(0x20, 0x7e),
  ...range(0xa0, 0xff).filter((c) => c !== 0xad), // soft hyphen is never drawn
  ...range(0x100, 0x17f),
  ...[...'€‘’“”–—…'].map((c) => c.codePointAt(0) as number),
];
// Letters the upstream OFL sources do not draw at all. Keep this list short and
// only shrink it: a new gap in a rebuilt face fails the test.
const UPSTREAM_GAPS: Record<string, string> = {
  'BricolageGrotesque-Display.woff2': '¤ĤĥĴĵĸĿŀŉŢţŦŧſ',
  'BricolageGrotesque-Text.woff2': '¤ĤĥĴĵĸĿŀŉŢţŦŧſ',
  'Caveat-SemiBold.woff2': 'ſ',
  'Anybody-var.woff2': 'ŉſ',
  'BigShouldersStencil-var.woff2': 'Ĳĳŉſ',
  'Fraunces-var.woff2': 'ŉſ',
  'Fraunces-Italic-var.woff2': 'ŉſ',
};

function base128(buf: Buffer, pos: { p: number }): number {
  let v = 0;
  for (let i = 0; i < 5; i++) {
    const b = buf[pos.p++] as number;
    v = v * 128 + (b & 0x7f);
    if (!(b & 0x80)) return v;
  }
  throw new Error('bad UIntBase128');
}

/** Code points in a WOFF2 file's cmap (formats 4 and 12). */
function woff2Cmap(file: Buffer): Set<number> {
  if (file.toString('latin1', 0, 4) !== 'wOF2') throw new Error('not woff2');
  const numTables = file.readUInt16BE(12);
  const pos = { p: 48 };
  let offset = 0;
  let cmap: [number, number] | undefined;
  for (let i = 0; i < numTables; i++) {
    const flags = file[pos.p++] as number;
    const tagIdx = flags & 0x3f;
    if (tagIdx === 0x3f) pos.p += 4;
    const orig = base128(file, pos);
    const version = flags >> 6;
    const transformed =
      tagIdx === 10 || tagIdx === 11 ? version === 0 : version !== 0;
    const len = transformed ? base128(file, pos) : orig;
    if (tagIdx === 0) cmap = [offset, orig];
    offset += len;
  }
  if (!cmap) throw new Error('no cmap');
  const data = brotliDecompressSync(
    file.subarray(pos.p, pos.p + file.readUInt32BE(20)),
  );
  const t = data.subarray(cmap[0], cmap[0] + cmap[1]);
  const out = new Set<number>();
  const n = t.readUInt16BE(2);
  for (let i = 0; i < n; i++) {
    const sub = t.subarray(t.readUInt32BE(4 + i * 8 + 4));
    const format = sub.readUInt16BE(0);
    if (format === 12) {
      const groups = sub.readUInt32BE(12);
      for (let g = 0; g < groups; g++) {
        const s = sub.readUInt32BE(16 + g * 12);
        const e = sub.readUInt32BE(20 + g * 12);
        for (let c = s; c <= e; c++) out.add(c);
      }
    } else if (format === 4) {
      const segs = sub.readUInt16BE(6) / 2;
      for (let s = 0; s < segs; s++) {
        const end = sub.readUInt16BE(14 + s * 2);
        const start = sub.readUInt16BE(16 + segs * 2 + s * 2);
        const delta = sub.readInt16BE(16 + segs * 4 + s * 2);
        const roOff = 16 + segs * 6 + s * 2;
        const ro = sub.readUInt16BE(roOff);
        for (let c = start; c <= end && c !== 0xffff; c++) {
          const gid =
            ro === 0
              ? (c + delta) & 0xffff
              : sub.readUInt16BE(roOff + ro + (c - start) * 2);
          if (gid !== 0) out.add(c);
        }
      }
    }
  }
  return out;
}

const faces = readdirSync('fonts').filter((f) => f.endsWith('.woff2'));

describe('font subsets (issue #15)', () => {
  it('ships all ten faces', () => {
    expect(faces).toHaveLength(10);
  });
  for (const face of faces) {
    it(`${face} covers Latin-1, Latin Extended-A and copy punctuation`, () => {
      const cmap = woff2Cmap(readFileSync(`fonts/${face}`));
      const gaps = new Set(
        [...(UPSTREAM_GAPS[face] ?? '')].map((c) => c.codePointAt(0)),
      );
      const missing = REQUIRED.filter((c) => !cmap.has(c) && !gaps.has(c)).map(
        (c) => String.fromCodePoint(c),
      );
      expect(missing.join('')).toBe('');
      const stale = [...gaps]
        .filter((c) => cmap.has(c as number))
        .map((c) => String.fromCodePoint(c as number));
      expect(stale.join(''), 'remove covered letters from UPSTREAM_GAPS').toBe(
        '',
      );
    });
  }
});
