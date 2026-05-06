export interface WalletRawData {
  address: string;
  balance: number;
  block: number;
  // Optional so a stale backend (deployed before the low-funds banner)
  // doesn't blow up the parsing — both fields default to 0/undefined.
  minimumBalance?: number;
  effectiveBalance?: number;
}

export class WalletEntity {
  public address: string;

  public balance: number;

  public block: number;

  public minimumBalance?: number;

  public effectiveBalance?: number;

  public constructor(data: WalletRawData) {
    this.address = data.address;
    this.balance = data.balance;
    this.block = data.block || 0;
    this.minimumBalance = data.minimumBalance;
    this.effectiveBalance = data.effectiveBalance;
  }

  // True only when both fields are present AND effective drops below the
  // threshold. Missing fields → undefined → treat as "not low" so we
  // never block stamping on a transient parse miss; the 406 fallback
  // still catches actual failures.
  public get isLowFunds(): boolean {
    if (this.minimumBalance === undefined || this.effectiveBalance === undefined) {
      return false;
    }
    return this.effectiveBalance < this.minimumBalance;
  }
}
