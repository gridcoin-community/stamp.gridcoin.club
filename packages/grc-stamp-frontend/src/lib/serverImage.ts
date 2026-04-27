// Server-only image helpers. Imports Sharp's native bindings — never import
// from a client component or a route that runs in the browser.

import Identicon from 'identicon.js';
import sharp from 'sharp';

/**
 * Rasterizes a SHA-256 hash into an RGBA PNG identicon and returns it as a
 * base64 data URL. Both Satori (next/og) and @react-pdf/renderer reject
 * identicon.js's native 8-bit colormap PNGs; pre-rasterizing through Sharp
 * gives them a clean RGBA PNG they can consume.
 */
export async function identiconPngDataUrl(hash: string, size: number): Promise<string> {
  const svgBase64 = new Identicon(hash, { size, format: 'svg' }).toString();
  const svgBuffer = Buffer.from(svgBase64, 'base64');
  const pngBuffer = await sharp(svgBuffer).png({ palette: false }).toBuffer();
  return `data:image/png;base64,${pngBuffer.toString('base64')}`;
}
