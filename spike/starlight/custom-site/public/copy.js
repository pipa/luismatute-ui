document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const id = button.getAttribute('data-copy');
    const node = id ? document.getElementById(id) : null;
    const text = node?.textContent ?? '';
    await navigator.clipboard.writeText(text);
    const status = button.parentElement?.querySelector('[data-copy-status]');
    if (status instanceof HTMLElement) status.hidden = false;
  });
});
