export interface WalletRawData {
  address: string;
  balance: number;
  block: number;
}

export class WalletEntity {
  public address: string;

  public balance: number;

  public block: number;

  public constructor(data: WalletRawData) {
    this.address = data.address;
    this.balance = data.balance;
    this.block = data.block || 0;
  }
}
