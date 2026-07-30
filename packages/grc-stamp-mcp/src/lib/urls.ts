import type { Config } from '../config.ts';

// Builders for the human-facing URLs that make this server distinct from every
// competing timestamping MCP: a public proof page and a downloadable notary PDF
// certificate, both free. These are FRONTEND routes (served by the stamp web
// app), not the JSON:API — see grc-stamp-frontend/src/pages/proof/[hash]/.

/** Public, live-updating proof page for a hash. Always valid once a stamp exists. */
export function proofUrl(config: Config, hash: string): string {
  return `${config.webUrl}/proof/${hash}`;
}

/**
 * Downloadable PDF certificate for a hash. NOTE: the frontend renders this only
 * once the stamp is confirmed on-chain — before confirmation the route 404s —
 * so callers should present it as "available once confirmed".
 */
export function certificateUrl(config: Config, hash: string): string {
  return `${config.webUrl}/proof/${hash}/certificate.pdf`;
}

/** Explorer transaction URL, or undefined if there is no txid yet. */
export function txUrl(config: Config, tx: string | null | undefined): string | undefined {
  if (!tx) return undefined;
  return config.explorerTxUrl.replace('[data]', tx);
}
