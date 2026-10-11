const THEME_KEY = 'lm.ui.theme';
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const RESULTS = [
  {
    title: 'lm-card',
    url: './index.html',
    crumb: '/ui/components/card/',
    excerpt: 'Boarding-pass and stop cards with hard ink shadows.',
  },
  {
    title: 'Colour tokens',
    url: './home.html#tokens',
    crumb: '/ui/tokens/colour/',
    excerpt: 'Ink, paper, marigold and the rest of the Wheels up palette.',
  },
  {
    title: 'Install from a git tag',
    url: './home.html#install',
    crumb: '/ui/getting-started/install/',
    excerpt: 'Pin @luismatute/ui from GitHub and import tokens.css.',
  },
];

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $$(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function live(message) {
  const region = $('#docs-live');
  if (!region) return;
  region.textContent = '';
  window.setTimeout(() => {
    region.textContent = message;
  }, 20);
}

function visibleFocusables(root) {
  return $$(FOCUSABLE, root).filter(
    (el) => !el.hasAttribute('hidden') && el.offsetParent !== null,
  );
}

function trapFocus(root, event) {
  if (event.key !== 'Tab') return;
  const items = visibleFocusables(root);
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function readTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // storage blocked
  }
  return 'auto';
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // storage blocked
    }
  } else {
    root.removeAttribute('data-theme');
    try {
      localStorage.removeItem(THEME_KEY);
    } catch {
      // storage blocked
    }
  }
  for (const button of $$('[data-theme-set]')) {
    button.setAttribute(
      'aria-pressed',
      String(button.getAttribute('data-theme-set') === theme),
    );
  }
}

function initTheme() {
  applyTheme(readTheme());
  for (const button of $$('[data-theme-set]')) {
    button.addEventListener('click', () => {
      applyTheme(button.getAttribute('data-theme-set') ?? 'auto');
    });
  }
}

function initKbdHint() {
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  if (mac) return;
  for (const kbd of $$('.docs-kbd')) {
    kbd.textContent = 'Ctrl+K';
  }
}

function initDrawer() {
  const nav = $('#docs-nav');
  const menu = $('[data-drawer-open]');
  const close = $('[data-drawer-close]');
  const backdrop = $('[data-drawer-backdrop]');
  if (!nav || !menu) return;

  let last = null;

  const isPhone = () => window.matchMedia('(max-width: 767px)').matches;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (backdrop) backdrop.hidden = !open;
    document.body.classList.toggle('docs-lock', open);
    if (!isPhone()) return;
    nav.setAttribute('aria-hidden', String(!open));
    if (open) {
      last = document.activeElement;
      (close ?? visibleFocusables(nav)[0])?.focus();
    } else {
      last?.focus();
    }
  };

  menu.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });
  close?.addEventListener('click', () => setOpen(false));
  backdrop?.addEventListener('click', () => setOpen(false));
  nav.addEventListener('keydown', (event) => {
    if (!nav.classList.contains('is-open') || !isPhone()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    trapFocus(nav, event);
  });

  const sync = () => {
    if (isPhone()) {
      if (!nav.classList.contains('is-open')) {
        nav.setAttribute('aria-hidden', 'true');
      }
    } else {
      nav.removeAttribute('aria-hidden');
      nav.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      if (backdrop) backdrop.hidden = true;
      document.body.classList.remove('docs-lock');
    }
  };
  sync();
  window.addEventListener('resize', sync);
}

function initSearch() {
  const dialog = $('#docs-search');
  const panel = dialog ? $('.docs-search-panel', dialog) : null;
  const input = dialog ? $('.docs-search-input', dialog) : null;
  const list = dialog ? $('[data-search-results]', dialog) : null;
  const empty = dialog ? $('[data-search-empty]', dialog) : null;
  if (!dialog || !panel || !input || !list || !empty) return;

  let last = null;
  let active = -1;

  const items = () => $$('[role="option"]', list);

  const highlight = (index) => {
    const opts = items();
    active = index;
    for (const [i, opt] of opts.entries()) {
      const on = i === index;
      opt.classList.toggle('is-active', on);
      opt.setAttribute('aria-selected', String(on));
    }
    opts[index]?.scrollIntoView({ block: 'nearest' });
  };

  const render = (query) => {
    const q = query.trim().toLowerCase();
    list.replaceChildren();
    active = -1;
    if (!q) {
      empty.hidden = true;
      list.hidden = true;
      return;
    }
    const hits = RESULTS.filter((row) =>
      `${row.title} ${row.excerpt} ${row.crumb}`.toLowerCase().includes(q),
    );
    if (hits.length === 0) {
      empty.hidden = false;
      list.hidden = true;
      return;
    }
    empty.hidden = true;
    list.hidden = false;
    for (const row of hits) {
      const opt = document.createElement('a');
      opt.className = 'docs-search-hit';
      opt.href = row.url;
      opt.setAttribute('role', 'option');
      opt.setAttribute('aria-selected', 'false');
      opt.innerHTML = `<span class="docs-search-title"></span><span class="docs-search-excerpt"></span><span class="docs-search-crumb"></span>`;
      $('.docs-search-title', opt).textContent = row.title;
      $('.docs-search-excerpt', opt).textContent = row.excerpt;
      $('.docs-search-crumb', opt).textContent = row.crumb;
      list.append(opt);
    }
    highlight(0);
  };

  const open = () => {
    last = document.activeElement;
    dialog.hidden = false;
    document.body.classList.add('docs-lock');
    input.value = '';
    render('');
    input.focus();
  };

  const close = () => {
    dialog.hidden = true;
    document.body.classList.remove('docs-lock');
    last?.focus();
  };

  for (const btn of $$('[data-search-open]')) {
    btn.addEventListener('click', open);
  }
  $('[data-search-close]', dialog)?.addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const opts = items();
    if (event.key === 'ArrowDown' && opts.length) {
      event.preventDefault();
      highlight(Math.min(opts.length - 1, active + 1));
    } else if (event.key === 'ArrowUp' && opts.length) {
      event.preventDefault();
      highlight(Math.max(0, active - 1));
    } else if (event.key === 'Enter' && opts[active]) {
      event.preventDefault();
      opts[active].click();
    } else {
      trapFocus(panel, event);
    }
  });
  input.addEventListener('input', () => render(input.value));

  document.addEventListener('keydown', (event) => {
    const meta = event.metaKey || event.ctrlKey;
    if (meta && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog.hidden) open();
      else close();
    }
  });

  window.__docsSearch = { open, close, render };
}

async function copyValue(button, value) {
  const idle = button.getAttribute('data-idle') ?? 'Copy';
  try {
    await navigator.clipboard.writeText(value);
    button.classList.remove('is-error');
    button.classList.add('is-copied');
    button.textContent = 'Copied';
    live('Copied');
    window.setTimeout(() => {
      button.classList.remove('is-copied');
      button.textContent = idle;
    }, 1600);
  } catch {
    button.classList.remove('is-copied');
    button.classList.add('is-error');
    button.textContent = 'Could not copy';
    live('Could not copy');
    window.setTimeout(() => {
      button.classList.remove('is-error');
      button.textContent = idle;
    }, 2200);
  }
}

function initCopy() {
  for (const button of $$('[data-copy]')) {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-copy');
      const node = target
        ? document.querySelector(target)
        : button.closest('.docs-code')?.querySelector('code');
      const value =
        button.getAttribute('data-copy-value') ?? node?.textContent ?? '';
      copyValue(button, value.trim());
    });
  }
  for (const chip of $$('[data-token-copy]')) {
    chip.addEventListener('click', () => {
      const value = chip.getAttribute('data-token-copy') ?? '';
      const button = $('.docs-copy', chip) ?? chip;
      copyValue(button, value);
    });
  }
}

function initDemo() {
  for (const demo of $$('.docs-demo')) {
    const surface = $('[data-demo-surface]', demo);
    const motion = $('[data-demo-motion]', demo);
    const stage = $('.docs-demo-stage', demo);
    surface?.addEventListener('click', () => {
      const ink = stage?.getAttribute('data-surface') === 'ink';
      stage?.setAttribute('data-surface', ink ? 'paper' : 'ink');
      surface.setAttribute('aria-pressed', String(!ink));
      const long = surface.querySelector('.docs-demo-long');
      const short = surface.querySelector('.docs-demo-short');
      if (long) long.textContent = ink ? 'Paper ground' : 'Ink ground';
      if (short) short.textContent = ink ? 'Paper' : 'Ink';
      if (!long) surface.textContent = ink ? 'Paper ground' : 'Ink ground';
    });
    motion?.addEventListener('click', () => {
      const on = motion.getAttribute('aria-pressed') === 'true';
      motion.setAttribute('aria-pressed', String(!on));
      stage?.classList.toggle('is-still', !on);
      const long = motion.querySelector('.docs-demo-long');
      const short = motion.querySelector('.docs-demo-short');
      if (long) long.textContent = on ? 'Reduce motion' : 'Motion on';
      if (short) short.textContent = on ? 'Still' : 'Move';
      if (!long) motion.textContent = on ? 'Reduce motion' : 'Motion on';
    });
  }
}

function initToc() {
  const toggle = $('[data-toc-toggle]');
  const panel = $('[data-toc-panel]');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  });
}

function initShots() {
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (!shot) return;
  if (shot === 'search') {
    window.__docsSearch?.open();
    window.__docsSearch?.render('card');
    const input = $('.docs-search-input');
    if (input) input.value = 'card';
  }
  if (shot === 'search-empty') {
    window.__docsSearch?.open();
    window.__docsSearch?.render('zzzz');
    const input = $('.docs-search-input');
    if (input) input.value = 'zzzz';
  }
  if (shot === 'drawer') {
    $('[data-drawer-open]')?.click();
  }
}

initTheme();
initKbdHint();
initDrawer();
initSearch();
initCopy();
initDemo();
initToc();
initShots();
