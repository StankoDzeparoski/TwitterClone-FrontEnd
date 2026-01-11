'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // for CSS vars
  root.setAttribute('data-theme', theme);

  // for Tailwind `dark:` utilities
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setMounted(true);

    const stored = (localStorage.getItem('theme') as Theme | null);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initial: Theme = stored ?? (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    applyTheme(initial);
  }, []);

  if (!mounted) return null; // avoid hydration mismatch

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="
        rounded-xl border border-zinc-200 px-3 py-2 text-sm
        hover:bg-zinc-50
        dark:border-zinc-700 dark:hover:bg-zinc-800
      "
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
