(() => {
  const KEY = 'lm.ui.theme';
  try {
    const theme = localStorage.getItem(KEY);
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch {
    // localStorage can throw when storage is blocked
  }
})();
