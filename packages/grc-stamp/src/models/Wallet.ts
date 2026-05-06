import { Address } from 'gridcoin-rpc/dist/types';

export class Wallet {
  public balance!: number;

  public address!: Address;

  public block!: number;

  // Threshold below which the service refuses new stamps with 406. Mirrors
  // config.MINIMUM_WALLET_AMOUNT — exposed so the frontend can branch its
  // UI ahead of an attempted submission instead of relying on the modal.
  public minimumBalance!: number;

  // balance minus the GRC the wallet has already promised to pending
  // stamps (each pair of pendings costs MINIMUM + MIN_FEE). This is the
  // number StampsController compares to minimumBalance for the 406 check.
  public effectiveBalance!: number;
}
