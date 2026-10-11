const select = document.querySelector('#theme');
const stored = localStorage.getItem('custom-theme');
if (stored === 'light' || stored === 'dark') {
  document.documentElement.dataset.theme = stored;
  if (select) select.value = stored;
}
select?.addEventListener('change', () => {
  const theme = select.value === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('custom-theme', theme);
});
