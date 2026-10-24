#!/usr/bin/env python3
"""Rebuild fonts/*.woff2 from the upstream OFL sources (google/fonts).

Usage: python3 scripts/build-fonts.py [--src DIR]   (needs fonttools + brotli)

Sources are downloaded from google/fonts at a pinned commit, instanced to the
axis ranges we ship, and subset to the code points in UNICODES (Basic Latin,
Latin-1 Supplement, Latin Extended-A, general punctuation, euro, arrows, TM).
The pinned axis values were matched glyph-for-glyph against the v0.1 files so
ASCII rendering does not change. See fonts/README.md.
"""
import argparse, io, os, urllib.parse, urllib.request
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

GF = "https://raw.githubusercontent.com/google/fonts/e7db6ca603fd4862010383ff17ffd6cc4ffac1c0/ofl/"
UNICODES = "U+0020-007E,U+00A0-017F,U+2010-2027,U+2030-203A,U+20AC,U+2190-2193,U+2122"

# out file, upstream path, axis limits (None = static), GSUB features kept (+ kern)
FACES = [
    ("BricolageGrotesque-Display.woff2", "bricolagegrotesque/BricolageGrotesque[opsz,wdth,wght].ttf",
     {"opsz": 96, "wght": (600, 800), "wdth": (75, 100)}, "case,locl,pnum,tnum"),
    ("BricolageGrotesque-Text.woff2", "bricolagegrotesque/BricolageGrotesque[opsz,wdth,wght].ttf",
     {"opsz": 14, "wdth": 100, "wght": (400, 700)}, "case,locl,pnum,tnum"),
    ("Caveat-SemiBold.woff2", "caveat/Caveat[wght].ttf", {"wght": 600}, ""),
    ("IBMPlexMono-Regular.woff2", "ibmplexmono/IBMPlexMono-Regular.ttf", None,
     "aalt,dnom,frac,numr,ordn,salt,sinf,ss01,ss02,ss03,ss04,ss05,sups,zero"),
    ("IBMPlexMono-Medium.woff2", "ibmplexmono/IBMPlexMono-Medium.ttf", None,
     "aalt,dnom,frac,numr,ordn,salt,sinf,ss01,ss02,ss03,ss04,ss05,sups,zero"),
    ("IBMPlexMono-SemiBold.woff2", "ibmplexmono/IBMPlexMono-SemiBold.ttf", None,
     "aalt,dnom,frac,numr,ordn,salt,sinf,ss01,ss02,ss03,ss04,ss05,sups,zero"),
    ("Anybody-var.woff2", "anybody/Anybody[wdth,wght].ttf",
     {"wdth": (75, 150), "wght": (500, 900)}, "aalt,case,ccmp,dnom,frac,liga,locl,numr,ordn,pnum,ss01,sups,tnum,zero"),
    ("BigShouldersStencil-var.woff2", "bigshouldersstencil/BigShouldersStencil[opsz,wght].ttf",
     {"opsz": 72, "wght": (600, 900)}, "aalt,c2sc,case,dlig,dnom,frac,liga,locl,numr,ordn,salt,sinf,smcp,ss01,subs,sups"),
    ("Fraunces-var.woff2", "fraunces/Fraunces[SOFT,WONK,opsz,wght].ttf",
     {"SOFT": 100, "WONK": 0, "opsz": (9, 144), "wght": (300, 800)}, "case,liga,rvrn,ss01"),
    ("Fraunces-Italic-var.woff2", "fraunces/Fraunces-Italic[SOFT,WONK,opsz,wght].ttf",
     {"SOFT": 100, "WONK": 0, "opsz": (9, 144), "wght": (300, 800)}, "case,liga,rvrn,ss01"),
]

# Bricolage upstream has no circumflex/breve on these letters. We add them as
# composites (base + upstream combining mark). Mark offset and its variation
# deltas = same-base reference + (mark on A) - (reference mark on A), so the
# mark sits where the font's own A-accents put it, at every axis location.
# (codepoint, base, mark, ref on same base, A with target mark, A with ref mark)
BRICOLAGE_COMPOSITES = [
    (0x0108, "C", "uni0302", "Cacute", "Acircumflex", "Aacute"),
    (0x0109, "c", "uni0302", "cacute", "acircumflex", "aacute"),
    (0x011C, "G", "uni0302", "Gbreve", "Acircumflex", "Abreve"),
    (0x011D, "g", "uni0302", "gbreve", "acircumflex", "abreve"),
    (0x015C, "S", "uni0302", "Sacute", "Acircumflex", "Aacute"),
    (0x015D, "s", "uni0302", "sacute", "acircumflex", "aacute"),
    (0x0114, "E", "uni0306", "Eacute", "Abreve", "Aacute"),
    (0x0115, "e", "uni0306", "eacute", "abreve", "aacute"),
    (0x014E, "O", "uni0306", "Oacute", "Abreve", "Aacute"),
    (0x014F, "o", "uni0306", "oacute", "abreve", "aacute"),
    (0x012C, "I", "uni0306", "Iacute", "Abreve", "Aacute"),
    (0x012D, "dotlessi", "uni0306", "iacute", "abreve", "aacute"),
]

def add_composites(f, recipes):
    import copy
    from fontTools.ttLib.tables.TupleVariation import TupleVariation
    glyf, gvar, hmtx = f["glyf"], f["gvar"].variations, f["hmtx"]
    def key(v):
        return tuple(sorted(v.axes.items()))
    def pts(v):
        return [c if c is not None else (0, 0) for c in v.coordinates]
    order = f.getGlyphOrder()
    for cp, base, mark, r1, r2, r3 in recipes:
        name = "uni%04X" % cp
        g1, g2, g3 = glyf[r1], glyf[r2], glyf[r3]
        assert [c.glyphName for c in g1.components] == [base, g3.components[1].glyphName]
        assert [c.glyphName for c in g2.components] == [g3.components[0].glyphName, mark]
        new = copy.deepcopy(g1)
        new.components[1].glyphName = mark
        new.components[1].x = g1.components[1].x + g2.components[1].x - g3.components[1].x
        new.components[1].y = g1.components[1].y + g2.components[1].y - g3.components[1].y
        v1, v2, v3 = ({key(v): pts(v) for v in gvar[r]} for r in (r1, r2, r3))
        assert v1.keys() == v2.keys() == v3.keys()
        tvs = []
        for v in gvar[r1]:
            k = key(v); a, b, c = v1[k], v2[k], v3[k]
            coords = list(a)
            coords[1] = (a[1][0] + b[1][0] - c[1][0], a[1][1] + b[1][1] - c[1][1])
            tvs.append(TupleVariation(dict(v.axes), coords))
        order.append(name)
        glyf.glyphs[name] = new
        glyf.glyphOrder = order
        gvar[name] = tvs
        hmtx.metrics[name] = hmtx.metrics[r1]
        if "GDEF" in f and f["GDEF"].table.GlyphClassDef:
            f["GDEF"].table.GlyphClassDef.classDefs[name] = 1
        for t in f["cmap"].tables:
            if t.isUnicode():
                t.cmap[cp] = name
    f.setGlyphOrder(order)
    buf = io.BytesIO(); f.save(buf); buf.seek(0)
    return TTFont(buf, lazy=False)

def fetch(path, src):
    local = os.path.join(src, os.path.basename(path))
    if not os.path.exists(local):
        urllib.request.urlretrieve(GF + urllib.parse.quote(path), local)
    return local

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default="/tmp/luismatute-ui-font-src")
    ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "..", "fonts"))
    a = ap.parse_args()
    os.makedirs(a.src, exist_ok=True)
    for out, path, limits, feats in FACES:
        f = TTFont(fetch(path, a.src), lazy=False)
        if path.startswith("bricolagegrotesque/"):
            f = add_composites(f, BRICOLAGE_COMPOSITES)
        if limits:
            f = instancer.instantiateVariableFont(f, limits, updateFontNames=False)
            buf = io.BytesIO(); f.save(buf); buf.seek(0)  # round-trip: some gvars are sparse
            f = TTFont(buf, lazy=False)
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = [x for x in feats.split(",") if x] + ["kern"]
        opts.name_IDs = ["*"]
        opts.notdef_outline = True
        opts.hinting = True
        s = subset.Subsetter(opts)
        s.populate(unicodes=subset.parse_unicodes(UNICODES))
        s.subset(f)
        dst = os.path.join(a.out, out)
        f.flavor = "woff2"
        f.recalcTimestamp = False  # reproducible bytes
        f.save(dst)
        print(f"{out}: {os.path.getsize(dst)} bytes")

if __name__ == "__main__":
    main()
