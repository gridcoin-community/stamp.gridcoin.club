import Identicon from 'identicon.js';

export type IdenticonFormat = 'png' | 'svg';

/**
 * Builds a deterministic identicon for a SHA-256 hash and returns it as a
 * data URL ready to drop into an <img src>. Output format defaults to PNG
 * for MUI consumption; pass 'svg' when the consumer renders through Satori
 * (next/og), which can't decode identicon.js's 8-bit colormap PNGs.
 */
export function identiconDataUrl(
  hash: string,
  size = 40,
  format: IdenticonFormat = 'png',
): string {
  const payload = new Identicon(hash, { size, format }).toString();
  const mime = format === 'svg' ? 'image/svg+xml' : 'image/png';
  return `data:${mime};base64,${payload}`;
}
