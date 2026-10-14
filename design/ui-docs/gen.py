# Builds the static mocks: index.html (day), night.html, drawer.html (phone drawer open, needs ?open hook via popover in screenshot)
NAV=[("Getting started",["Install from a tag","Astro usage","Bare imports"]),
 ("Foundations",["Colour","Type","Spacing","Motion tokens"]),
 ("Components",["lm-card","lm-chip","lm-more","lm-motion-toggle","lm-pause","lm-shot","lm-avatar","lm-globe","lm-flight-plan"]),
 ("Illustrations",["SVG kit"]),("Changelog",["0.2.0"])]
def slug(s): return s.lower().replace(" ","-").replace(".","")
def nav():
  o=""
  for g,items in NAV:
    o+=f'<div class="nav-group"><p class="nav-label">{g}</p><ul class="nav-list">'
    for i in items:
      cur=' aria-current="page"' if i=="lm-card" else ""
      o+=f'<li><a href="./{slug(g)}/{slug(i)}/"{cur}>{i}</a></li>'
    o+="</ul></div>"
  return o
ICON_COPY='<svg class="idle" viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M11 3.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'
ICON_OK='<svg class="ok" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
def btn(target,cls="",label="Copy"):
  return f'<button class="copy {cls}" type="button" data-copy="{target}" aria-label="Copy {target.split("-")[0].upper()} snippet">{ICON_COPY}{ICON_OK}<span class="idle-t">{label}</span></button>'
HTML_SNIP='<span class="p">&lt;</span><span class="t">lm-card</span> <span class="a">tone</span><span class="p">=</span><span class="s">"marigold"</span> <span class="a">tilt</span><span class="p">&gt;</span>\n  <span class="p">&lt;</span><span class="t">h3</span> <span class="a">slot</span><span class="p">=</span><span class="s">"title"</span><span class="p">&gt;</span>Lisbon, 06:40<span class="p">&lt;/</span><span class="t">h3</span><span class="p">&gt;</span>\n  <span class="p">&lt;</span><span class="t">p</span><span class="p">&gt;</span>Window seat, wheels up.<span class="p">&lt;/</span><span class="t">p</span><span class="p">&gt;</span>\n<span class="p">&lt;/</span><span class="t">lm-card</span><span class="p">&gt;</span>'
CSS_SNIP='<span class="c">/* override per card, both modes */</span>\n<span class="t">lm-card</span> <span class="p">{</span>\n  <span class="a">--lm-card-tilt</span><span class="p">:</span> <span class="s">-1.5deg</span><span class="p">;</span>\n  <span class="a">--lm-card-shadow</span><span class="p">:</span> <span class="f">var</span><span class="p">(</span><span class="a">--lm-shadow-card</span><span class="p">);</span>\n<span class="p">}</span>'
def page(mode, drawer=False):
  m=' data-mode="night"' if mode=="night" else ""
  return f'''<!doctype html>
<html lang="en"{m}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>lm-card · @luismatute/ui</title>
<link rel="stylesheet" href="./docs-shell.css">
<script type="module" src="./copy.js"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="head">
  <button class="menu" type="button" popovertarget="drawer" aria-label="Open navigation"><svg viewBox="0 0 22 22" aria-hidden="true"><path d="M3 6h16M3 11h16M3 16h10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg></button>
  <a class="brand" href="./">luismatute<b>/ui</b></a><span class="ver">v0.2.0</span>
  <button class="search" type="button" aria-label="Search docs"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="7.5" cy="7.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 12l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="label">Search docs</span><kbd>/</kbd></button>
</header>
<div id="drawer" class="drawer" popover>
  <div class="drawer-top"><span class="brand">luismatute<b>/ui</b></span><button class="menu" type="button" popovertarget="drawer" popovertargetaction="hide" aria-label="Close navigation"><svg viewBox="0 0 22 22" aria-hidden="true"><path d="M5 5l12 12M17 5L5 17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg></button></div>
  <nav aria-label="Docs (drawer)">{nav()}</nav>
</div>
<div class="shell">
  <aside class="side"><nav aria-label="Docs">{nav()}</nav></aside>
  <main id="main" class="main"><article class="prose">
    <p class="crumb">Components / lm-card</p>
    <h1>lm-card</h1>
    <p class="lede">A paper ticket with a hard ink shadow. Holds a title slot, body copy and an optional stamp.</p>
    <h2 id="usage">Usage <a class="anchor" href="#usage" aria-label="Link to Usage">#</a></h2>
    <p>Import once from the pinned tag, then drop the element in any page. It inherits <code>--lm-ink</code> and <code>--lm-paper</code> from the mode.</p>
    <div class="code"><div class="code-bar"><span class="code-lang">HTML</span><span class="code-file">card.html</span>{btn("html-snip")}</div><pre id="html-snip"><code>{HTML_SNIP}</code></pre></div>
    <h2 id="custom-properties">CSS custom properties <a class="anchor" href="#custom-properties" aria-label="Link to CSS custom properties">#</a></h2>
    <div class="code"><div class="code-bar"><span class="code-lang">CSS</span><span class="code-file">site.css</span>{btn("css-snip")}</div><pre id="css-snip"><code>{CSS_SNIP}</code></pre></div>
    <h3 id="copy-states">Copy button states</h3>
    <div class="states">
      <div class="state"><span>Idle</span>{btn("s1")}</div>
      <div class="state"><span>Hover</span>{btn("s2","is-hover")}</div>
      <div class="state"><span>Focus</span>{btn("s3","is-focus")}</div>
      <div class="state"><span>Copied</span>{btn("s4","is-copied","Copied")}</div>
    </div>
    <p id="copy-live" class="sr" aria-live="polite"></p>
    <nav class="pager" aria-label="Pager"><a href="./foundations/motion-tokens/"><small>Previous</small><strong>Motion tokens</strong></a><a class="next" href="./components/lm-chip/"><small>Next</small><strong>lm-chip</strong></a></nav>
  </article></main>
  <aside class="toc" aria-label="On this page"><p>On this page</p><ul><li><a href="#usage" aria-current="true">Usage</a></li><li><a href="#custom-properties">CSS custom properties</a></li><li><a href="#copy-states">Copy button states</a></li></ul></aside>
</div>
</body>
</html>
'''
open("index.html","w").write(page("day"))
open("night.html","w").write(page("night"))
