const meta = document.querySelector('meta[name="color-scheme"]');
const system = matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  return localStorage.getItem('theme') ?? (system.matches ? 'dark' : 'light');
}

function toggleTheme() {
  const theme = currentTheme() === 'dark' ? 'light' : 'dark';
  const followsSystem = theme === (system.matches ? 'dark' : 'light');

  if (followsSystem) localStorage.removeItem('theme');
  else localStorage.setItem('theme', theme);

  applyTheme();
}

function applyTheme() {
  meta.content = localStorage.getItem('theme') ?? 'light dark';
}

document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

addEventListener('storage', applyTheme);
