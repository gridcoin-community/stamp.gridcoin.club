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
    expect(wallet.minimumBalance).toBeUndefined();
    expect(wallet.effectiveBalance).toBeUndefined();
  });

  it('should set and get address correctly', () => {
    wallet.address = mockAddress;
    expect(wallet.address).toBe(mockAddress);
  });

  it('should set and get balance correctly', () => {
    wallet.balance = mockBalance;
    expect(wallet.balance).toBe(mockBalance);
  });

  it('should set and get minimumBalance correctly', () => {
    wallet.minimumBalance = 1;
    expect(wallet.minimumBalance).toBe(1);
  });

  it('should set and get effectiveBalance correctly', () => {
    wallet.effectiveBalance = 99.5;
    expect(wallet.effectiveBalance).toBe(99.5);
  });
});
