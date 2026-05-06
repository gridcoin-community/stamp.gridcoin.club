import { MINIMUM, MIN_FEE } from '../constants';

// One stamp transaction batches up to two stamps (StampService.process),
// so each pair of pending stamps consumes one tx fee + dust output.
// `pendingCount + 1` reserves room for the stamp the caller is about to
// create — see StampsController.createStamp for the full check.
export function computePendingCost(pendingCount: number): number {
  const costPerTx = MINIMUM + MIN_FEE;
  return Math.ceil((pendingCount + 1) / 2) * costPerTx;
}
