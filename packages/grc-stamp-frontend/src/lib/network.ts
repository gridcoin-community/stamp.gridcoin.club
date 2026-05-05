export type Network = 'mainnet' | 'testnet';

const RAW = process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet';

export const NETWORK: Network = RAW === 'testnet' ? 'testnet' : 'mainnet';

export const IS_TESTNET = NETWORK === 'testnet';

export const IS_MAINNET = NETWORK === 'mainnet';

// URL of the *other* network's deployment, supplied by env at deploy
// time. Empty string means "not configured" — the footer cross-link
// hides itself rather than guessing a domain.
export const SISTER_NETWORK_URL = process.env.NEXT_PUBLIC_SISTER_URL ?? '';

export const SISTER_NETWORK_LABEL = IS_TESTNET ? 'Mainnet' : 'Testnet';
