import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import {
  getThemeFromCookie,
  saveTheme,
  toggleTheme,
  DEFAULT_THEME,
} from '@/lib/mode';

describe('mode', () => {
  let cookieValue: string;

  beforeEach(() => {
    cookieValue = '';
    vi.stubGlobal('document', {
      get cookie() { return cookieValue; },
      set cookie(val: string) { cookieValue = val; },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getThemeFromCookie', () => {
    it('should return light when cookie is theme=light', () => {
      cookieValue = 'theme=light; other=value';
      expect(getThemeFromCookie()).toBe('light');
    });

    it('should return dark when cookie is theme=dark', () => {
      cookieValue = 'something=else; theme=dark';
      expect(getThemeFromCookie()).toBe('dark');
    });

    it('should return default theme when no theme cookie exists', () => {
      cookieValue = 'other=value';
      expect(getThemeFromCookie()).toBe(DEFAULT_THEME);
    });

    it('should return default theme when cookie is empty', () => {
      cookieValue = '';
      expect(getThemeFromCookie()).toBe(DEFAULT_THEME);
    });
  });

  describe('saveTheme', () => {
    it('should set cookie with theme value and max-age', () => {
      saveTheme('dark');
      expect(cookieValue).toBe('theme=dark; path=/; max-age=31536000');
    });
  });

  describe('toggleTheme', () => {
    it('should save dark when current is light', () => {
      toggleTheme('light');
      expect(cookieValue).toContain('theme=dark');
    });

    it('should save light when current is dark', () => {
      toggleTheme('dark');
      expect(cookieValue).toContain('theme=light');
    });
  });

  describe('DEFAULT_THEME', () => {
    it('should be light', () => {
      expect(DEFAULT_THEME).toBe('light');
    });
  });
});
