import { Address } from 'gridcoin-rpc/dist/types';
import { Wallet } from './Wallet';

describe('Wallet', () => {
  let wallet: Wallet;
  const mockAddress: Address = 'S6pr4GJKqvwPSh9hQCvTGfSfwsxvqDxVQy';
  const mockBalance = 100.50;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it('should initialize with undefined properties', () => {
    expect(wallet.address).toBeUndefined();
    expect(wallet.balance).toBeUndefined();
  });

  it('should set and get address correctly', () => {
    wallet.address = mockAddress;
    expect(wallet.address).toBe(mockAddress);
  });

  it('should set and get balance correctly', () => {
    wallet.balance = mockBalance;
    expect(wallet.balance).toBe(mockBalance);
  });
});
