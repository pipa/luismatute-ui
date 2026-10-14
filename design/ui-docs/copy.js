// Mock-only copy behaviour (external file, CSP-safe). Pixel rebuilds this in the real site.
for (const b of document.querySelectorAll('[data-copy]')) {
  b.addEventListener('click', async () => {
    const src = document.getElementById(b.dataset.copy);
    try { await navigator.clipboard.writeText(src.textContent); } catch {}
    b.setAttribute('data-copied', '');
    b.querySelector('.idle-t').textContent = 'Copied';
    document.getElementById('copy-live').textContent = 'Copied to clipboard';
    setTimeout(() => { b.removeAttribute('data-copied'); b.querySelector('.idle-t').textContent = 'Copy'; }, 2000);
  });
}
