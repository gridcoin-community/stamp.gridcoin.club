export const PROTOCOL = '0.0.1';
// Protocol identity, not a deployment knob: every stamp transaction
// across every Gridcoin network this service indexes is "Sealed" with
// the same OP_RETURN namespace. Hardcoded so the same image scrapes
// the same protocol on mainnet and testnet without diverging.
export const PREFIX = '5ea1ed';
export const MINIMUM = 0.00000001;
export const MIN_FEE = 0.001;
export const OP_RETURN = 'OP_RETURN';

// Lag threshold (in blocks) at which the indexer is considered backfilling
// rather than just trailing the chain by normal cadence. Gridcoin blocks
// arrive ~every 90s, so 10 blocks ≈ 15 min behind — past that it's worth
// telling users their stamps will appear once we catch up.
export const BACKFILL_THRESHOLD_BLOCKS = 10;
