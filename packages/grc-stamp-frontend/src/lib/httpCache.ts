/**
 * Cache-Control value for derived assets that are functionally immutable for
 * a given key but cheap to regenerate: serve from cache for a day, then fall
 * back to stale-while-revalidate for a week. Used by routes that produce
 * per-stamp artifacts (OG images, PDF certificates).
 */
export const CACHE_CONTROL_DAY = 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800';
