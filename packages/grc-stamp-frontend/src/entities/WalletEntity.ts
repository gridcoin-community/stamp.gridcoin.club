export interface WalletRawData {
  address: string;
  balance: number;
}

export class WalletEntity {
  public address: string;

  public balance: number;

  public constructor(data: WalletRawData) {
    this.address = data.address;
    this.balance = data.balance;
  }
}
