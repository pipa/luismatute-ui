---
title: Card
description: Sample component page with props, a demo snippet, and accessibility notes.
---

Sample component page for `lm-card`. The unique token `sandals-stop-card` is indexed by Pagefind.

## Live demo

```html
<lm-card variant="stop">
  <h2>Front-end developer, Sandals Resorts</h2>
  <p>sandals-stop-card</p>
</lm-card>
```

## Props

| Attribute | Type | Notes |
| --- | --- | --- |
| `variant` | `pass` or `stop` | Visual treatment of the card. |

## Accessibility

The card is a sectioning container. Give it a heading. Honour `prefers-reduced-motion` for any motion inside it.

### CSS variables

```css
lm-card {
  background: var(--lm-color-paper);
  color: var(--lm-color-ink);
}
```
