/**
 * Tiny wrapper around Plausible's custom-events API. Plausible exposes
 * a global `window.plausible(event, { props })` function once the
 * script (loaded in _app.tsx) has hydrated. We don't want any caller
 * to crash if the script is blocked, deferred, or simply absent in
 * dev — `track()` no-ops in that case.
 *
 * Privacy: only pass low-cardinality string/number props. Never log
 * user search queries, full hashes, or anything PII-like — Plausible
 * stores the props verbatim and we want to keep this site cookieless
 * and unprofiling-friendly.
 */
type PlausibleFn = (event: string, opts?: { props?: Record<string, string | number | boolean> }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn & { q?: unknown[] };
  }
}

export function track(event: string, props?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  const fn = window.plausible;
  if (typeof fn !== 'function') return;
  try {
    fn(event, props ? { props } : undefined);
  } catch {
    /* swallow — analytics must never break the page */
  }
}

/**
 * Class names for Plausible's tagged events. A link or button carrying
 * `plausible-event-name=Nav+Click plausible-event-item=About` fires
 * "Nav Click" { item: "About" } when clicked, with no JS handler, so it
 * also works for links that leave the page. Spaces become '+'; empty
 * props are dropped. Same privacy rule as `track()`.
 */
export function plausibleClass(event: string, props: Record<string, string> = {}): string {
  const enc = (s: string) => s.replace(/\s+/g, '+');
  const out = [`plausible-event-name=${enc(event)}`];
  for (const [key, value] of Object.entries(props)) {
    if (value) out.push(`plausible-event-${key}=${enc(value)}`);
  }
  return out.join(' ');
}

/**
 * onClick/onAuxClick for a link whose URL must not reach Plausible because
 * it holds a hash, tx id or email. Sends `event` with `props` only, then
 * stops the click before Plausible's document listener, which would
 * otherwise add its own outbound/download event carrying the full URL.
 * Navigation is untouched (no preventDefault).
 */
export function trackLinkPrivately(event: string, props?: Record<string, string>) {
  const handler = (e: { type: string; button: number; stopPropagation: () => void }) => {
    if (e.type === 'auxclick' && e.button !== 1) return;
    track(event, props);
    e.stopPropagation();
  };
  return { onClick: handler, onAuxClick: handler };
}
