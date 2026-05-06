/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const isTestnet = process.env.NEXT_PUBLIC_NETWORK === 'testnet';

// Production CSP. Kept off in dev because Next's HMR loader needs
// `unsafe-eval` and inline bootstrap scripts that would noisily fail the
// policy. Allowances:
//  - 'unsafe-inline' on script-src: required by the JSON-LD block in
//    `Seo.tsx` (which already escapes `</` to neutralize </script>) and by
//    Next's hydration shims. Replace with per-request nonces if/when the
//    JSON-LD path moves behind a nonce.
//  - 'unsafe-inline' on style-src: emotion injects runtime <style> tags
//    server- and client-side; it doesn't expose a nonce hook on the v11
//    cache used here.
//  - https://daj.pw: the Plausible analytics script.
//  - data:, blob: on img-src: identicon data URLs and Next's image runtime.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://daj.pw",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://daj.pw",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

module.exports = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  // The `@/*` alias is resolved via `tsconfig.json` paths, which both
  // Turbopack and Next's webpack config pick up automatically — no manual
  // alias plumbing needed here.
  async headers() {
    const baseHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    if (isProd) {
      baseHeaders.push({ key: 'Content-Security-Policy', value: csp });
    }
    if (isTestnet) {
      // Belt-and-braces: meta robots + robots.txt cover HTML, but PDFs,
      // OG PNGs, and JSON responses don't render <head>. The X-Robots-Tag
      // header is honored by Google + Bing for any content type.
      baseHeaders.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' });
    }
    return [
      {
        // Apply security headers to everything except Next's internal
        // asset paths (`/_next/*`). Next serves its own assets with
        // managed Content-Type headers; strict `nosniff` on dev-time
        // internal files like `_clientMiddlewareManifest.js` causes
        // the browser to block them due to Content-Type mismatches.
        source: '/((?!_next/).*)',
        headers: baseHeaders,
      },
    ];
  },
};
