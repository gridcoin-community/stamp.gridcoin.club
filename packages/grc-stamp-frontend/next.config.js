/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  // The `@/*` alias is resolved via `tsconfig.json` paths, which both
  // Turbopack and Next's webpack config pick up automatically — no manual
  // alias plumbing needed here.
  async headers() {
    return [
      {
        // Apply security headers to everything except Next's internal
        // asset paths (`/_next/*`). Next serves its own assets with
        // managed Content-Type headers; strict `nosniff` on dev-time
        // internal files like `_clientMiddlewareManifest.js` causes
        // the browser to block them due to Content-Type mismatches.
        source: '/((?!_next/).*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
