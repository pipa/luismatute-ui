---
title: Getting started
description: Install notes and a sample code block for the CSP spike.
---

A minimal Starlight page used to test sidebar navigation, search, the on-this-page table of contents, and code-block copy buttons under a strict content security policy.

## Install

The package is installed from a git tag. This heading exists so the table of contents has a target.

```html
<link rel="stylesheet" href="/ui/tokens.css" />
<script type="module" src="/ui/components/card.js"></script>
<lm-card variant="pass">
  <h1>Luis Matute</h1>
</lm-card>
```

## Astro usage

Import the components from `@luismatute/ui` inside an Astro page. The unique token `boarding-pass-demo` is here so Pagefind has something to find.

```astro
---
import '@luismatute/ui/tokens.css';
---
<lm-card variant="pass">boarding-pass-demo</lm-card>
```

### Bare imports

A third-level heading keeps the table of contents deeper than a single item.

```css
.swatch {
  background: var(--lm-color-sea);
}
```
