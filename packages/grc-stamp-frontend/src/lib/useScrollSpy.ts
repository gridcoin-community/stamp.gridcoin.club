import { useEffect, useState } from 'react';

/**
 * Tracks which anchor section is currently "active" in the viewport by
 * reading the top offset of each target element on scroll. Ids must be in
 * document order — the hook relies on that for cheap linear scans.
 */
export function useScrollSpy(ids: string[], offset = 120): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  // Join for the effect dep so inlined `entries={[…]}` call sites don't thrash the listener.
  const idsKey = ids.join('|');

  useEffect(() => {
    if (typeof window === 'undefined' || ids.length === 0) {
      return undefined;
    }

    let frame = 0;

    const compute = () => {
      frame = 0;
      let current: string | null = null;
      for (let i = 0; i < ids.length; i += 1) {
        const el = document.getElementById(ids[i]);
        if (!el) {
           
          continue;
        }
        const { top } = el.getBoundingClientRect();
        if (top - offset <= 0) {
          current = ids[i];
        } else {
          break;
        }
      }
      // Near page bottom, lock to the last id so the final section highlights.
      // Skip on pages that don't actually scroll — otherwise the last id wins at t=0.
      const { scrollHeight } = document.documentElement;
      const viewportHeight = window.innerHeight;
      if (scrollHeight > viewportHeight + 4
        && viewportHeight + window.scrollY >= scrollHeight - 4) {
        current = ids[ids.length - 1];
      }
      setActive(current ?? ids[0] ?? null);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, offset]);

  return active;
}
