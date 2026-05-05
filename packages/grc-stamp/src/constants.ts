export const PROTOCOL = '0.0.1';
// Protocol identity, not a deployment knob: every stamp transaction
// across every Gridcoin network this service indexes is "Sealed" with
// the same OP_RETURN namespace. Hardcoded so the same image scrapes
// the same protocol on mainnet and testnet without diverging.
export const PREFIX = '5ea1ed';
export const MINIMUM = 0.00000001;
export const MIN_FEE = 0.001;
export const OP_RETURN = 'OP_RETURN';
