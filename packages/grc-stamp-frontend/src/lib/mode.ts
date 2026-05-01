export type ThemeMode = 'light' | 'dark';

export const DEFAULT_THEME: ThemeMode = 'light';

// Resolve the cookie `domain` attribute so the theme preference is
// shared across the apex (gridcoin.club) and every *.gridcoin.club
// subdomain. Returning `null` means "scope to the current host only" —
// used for localhost / IP-only / non-club hosts where browsers reject
// a cookie whose domain isn't a registrable suffix of the current host.
function sharedCookieDomain(): string | null {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname;
  if (host === 'gridcoin.club' || host.endsWith('.gridcoin.club')) {
    return '.gridcoin.club';
  }
  return null;
}

// MIGRATION (added 2026-05-01): expire any host-only `theme` cookie left over
// from the pre-shared-domain code. Without this, the older host-only cookie
// keeps shadowing the shared one (RFC 6265 §5.4 sorts by creation time;
// `cookie.parse` keeps the first occurrence), locking the subdomain to
// whatever value it was last set to. A no-op once the legacy cookie is gone,
// which is why it's safe to call eagerly on mount.
// TODO(remove after 2026-08-01): once the 3-month window has passed most
// active users will have self-healed; drop this helper and its caller in
// `_app.tsx`. The `domain` guard in `saveTheme` can stay.
export function cleanupLegacyThemeCookie(): void {
  if (typeof document === 'undefined') return;
  if (!sharedCookieDomain()) return;
  document.cookie = 'theme=; path=/; max-age=0; samesite=lax';
}

export function saveTheme(theme: ThemeMode) {
  const domain = sharedCookieDomain();
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  if (domain) {
    cleanupLegacyThemeCookie();
  }
  const parts = [
    `theme=${theme}`,
    'path=/',
    'max-age=31536000',
    'samesite=lax',
  ];
  if (domain) parts.push(`domain=${domain}`);
  if (isSecure) parts.push('secure');
  document.cookie = parts.join('; ');
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
