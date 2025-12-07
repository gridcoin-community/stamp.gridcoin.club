export type ThemeMode = 'light' | 'dark';

export const DEFAULT_THEME: ThemeMode = 'light';

export function saveTheme(theme: ThemeMode) {
  document.cookie = `theme=${theme}; path=/; max-age=31536000`;
}

export function getThemeFromCookie(): ThemeMode {
  if (typeof document === 'undefined') {
    return DEFAULT_THEME;
  }
  const match = document.cookie.match(/theme=(dark|light)/);
  if (match) {
    const theme = match[1];
    if (theme === 'light' || theme === 'dark') {
      return theme as ThemeMode;
    }
  }
  return DEFAULT_THEME;
}

export function toggleTheme(current: ThemeMode): void {
  const newTheme = current === 'light' ? 'dark' : 'light';
  saveTheme(newTheme);
}
