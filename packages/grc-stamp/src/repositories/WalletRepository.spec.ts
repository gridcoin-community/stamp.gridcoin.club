import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from 'vitest';
import { WalletRepositoryClass } from './WalletRepository';

describe('WalletRepository', () => {
  let repository: WalletRepositoryClass;
  const mockAddress = 'S6pr4GJKqvwPSh9hQCvTGfSfwsxvqDxVQy';
  const mockBalance = 100.50;
  const mockRpc = {
    getAddressesByLabel: vi.fn(),
    setLabel: vi.fn(),
    getNewAddress: vi.fn(),
    getAccountAddress: vi.fn(),
    getBalance: vi.fn(),
  };
  const rpcError = (code: number) => Object.assign(new Error(`RPC ${code}`), { code });

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new WalletRepositoryClass(mockRpc as any);
  });

  describe('getAddress', () => {
    it('should return the address under the grc-stamp label', async () => {
      mockRpc.getAddressesByLabel.mockResolvedValue({ [mockAddress]: { purpose: 'receive' } });

      const result = await repository.getAddress();

      expect(result).toBe(mockAddress);
      expect(mockRpc.getAddressesByLabel).toHaveBeenCalledWith('grc-stamp');
      expect(mockRpc.getAccountAddress).not.toHaveBeenCalled();
    });

    it('should pick the same address every time when the label has several', async () => {
      mockRpc.getAddressesByLabel.mockResolvedValue({
        SzzzAddress: { purpose: 'receive' },
        SaaaAddress: { purpose: 'receive' },
      });

      expect(await repository.getAddress()).toBe('SaaaAddress');
    });

    it('should fall back to the accounts RPC on wallets without labels', async () => {
      // Error case
      mockRpc.getAddressesByLabel.mockRejectedValue(rpcError(-32601));
      mockRpc.getAccountAddress.mockResolvedValue(mockAddress);

      const result = await repository.getAddress();

      expect(result).toBe(mockAddress);
      expect(mockRpc.getAccountAddress).toHaveBeenCalledWith('');
      expect(mockRpc.getNewAddress).not.toHaveBeenCalled();
    });

    it('should mint and label an address when the label is empty', async () => {
      // Error case
      mockRpc.getAddressesByLabel.mockRejectedValue(rpcError(-11));
      mockRpc.getNewAddress.mockResolvedValue(mockAddress);
      mockRpc.setLabel.mockResolvedValue(null);

      const result = await repository.getAddress();

      expect(result).toBe(mockAddress);
      expect(mockRpc.setLabel).toHaveBeenCalledWith(mockAddress, 'grc-stamp');
      expect(mockRpc.getAccountAddress).not.toHaveBeenCalled();
    });

    it('should resolve once for concurrent and repeated callers', async () => {
      // Error case
      mockRpc.getAddressesByLabel.mockRejectedValue(rpcError(-11));
      mockRpc.getNewAddress.mockResolvedValue(mockAddress);

      await Promise.all([repository.getAddress(), repository.getAddress()]);
      await repository.getAddress();

      expect(mockRpc.getNewAddress).toHaveBeenCalledTimes(1);
      expect(mockRpc.getAddressesByLabel).toHaveBeenCalledTimes(1);
    });

    it('should throw other RPC errors and retry on the next call', async () => {
      // Error case
      mockRpc.getAddressesByLabel
        .mockRejectedValueOnce(new Error('RPC Error'))
        .mockResolvedValueOnce({ [mockAddress]: { purpose: 'receive' } });

      await expect(repository.getAddress()).rejects.toThrow('RPC Error');
      expect(mockRpc.getNewAddress).not.toHaveBeenCalled();

      expect(await repository.getAddress()).toBe(mockAddress);
    });
  });

  describe('getBalance', () => {
    it('should return wallet balance', async () => {
      mockRpc.getBalance.mockResolvedValue(mockBalance);

      const result = await repository.getBalance();

      expect(result).toBe(mockBalance);
      expect(mockRpc.getBalance).toHaveBeenCalled();
    });

    it('should throw error when RPC fails', async () => {
      const error = new Error('RPC Error');
      mockRpc.getBalance.mockRejectedValue(error);

      await expect(repository.getBalance()).rejects.toThrow('RPC Error');
    });

    it('should return cached balance on subsequent calls within TTL', async () => {
      mockRpc.getBalance.mockResolvedValue(mockBalance);

      await repository.getBalance();
      await repository.getBalance();
      await repository.getBalance();

      expect(mockRpc.getBalance).toHaveBeenCalledTimes(1);
    });

    it('should coalesce concurrent calls into a single RPC request', async () => {
      mockRpc.getBalance.mockResolvedValue(mockBalance);

      const results = await Promise.all([
        repository.getBalance(),
        repository.getBalance(),
        repository.getBalance(),
      ]);

      expect(results).toEqual([mockBalance, mockBalance, mockBalance]);
      expect(mockRpc.getBalance).toHaveBeenCalledTimes(1);
    });

    it('should refetch after cache expires', async () => {
      mockRpc.getBalance
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(50);

      const first = await repository.getBalance();

      // Expire the cache by backdating the fetch timestamp
      (repository as any).balanceFetchedAt = 0;

      const second = await repository.getBalance();

      expect(first).toBe(100);
      expect(second).toBe(50);
      expect(mockRpc.getBalance).toHaveBeenCalledTimes(2);
    });

    it('should force a fresh RPC call after resetCache()', async () => {
      mockRpc.getBalance
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(50);

      await repository.getBalance();
      repository.resetCache();
      const second = await repository.getBalance();

      expect(second).toBe(50);
      expect(mockRpc.getBalance).toHaveBeenCalledTimes(2);
    });

    it('should allow retry after a failed RPC call', async () => {
      const error = new Error('RPC Error');
      mockRpc.getBalance
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(mockBalance);

      await expect(repository.getBalance()).rejects.toThrow('RPC Error');

      const result = await repository.getBalance();
      expect(result).toBe(mockBalance);
    });
  });

  describe('getWalletInfo', () => {
    it('should return wallet info with address and balance', async () => {
      mockRpc.getAddressesByLabel.mockResolvedValue({ [mockAddress]: { purpose: 'receive' } });
      mockRpc.getBalance.mockResolvedValue(mockBalance);

      const result = await repository.getWalletInfo();

      expect(result.address).toBe(mockAddress);
      expect(result.balance).toBe(mockBalance);
      expect(mockRpc.getBalance).toHaveBeenCalled();
    });

    it('should throw error when any RPC call fails', async () => {
      const error = new Error('RPC Error');
      mockRpc.getAddressesByLabel.mockResolvedValue({ [mockAddress]: { purpose: 'receive' } });
      mockRpc.getBalance.mockRejectedValue(error);

      await expect(repository.getWalletInfo()).rejects.toThrow('RPC Error');
    });
  });
});
