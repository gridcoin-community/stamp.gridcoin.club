import { WalletRepositoryClass } from './WalletRepository';

describe('WalletRepository', () => {
  let repository: WalletRepositoryClass;
  const mockAddress = 'S6pr4GJKqvwPSh9hQCvTGfSfwsxvqDxVQy';
  const mockBalance = 100.50;
  const mockRpc = {
    getAccountAddress: jest.fn(),
    getBalance: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new WalletRepositoryClass(mockRpc as any);
  });

  describe('getAddress', () => {
    it('should return wallet address', async () => {
      mockRpc.getAccountAddress.mockResolvedValue(mockAddress);

      const result = await repository.getAddress();

      expect(result).toBe(mockAddress);
      expect(mockRpc.getAccountAddress).toHaveBeenCalledWith('');
    });

    it('should throw error when RPC fails', async () => {
      const error = new Error('RPC Error');
      mockRpc.getAccountAddress.mockRejectedValue(error);

      await expect(repository.getAddress()).rejects.toThrow('RPC Error');
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
  });

  describe('getWalletInfo', () => {
    it('should return wallet info with address and balance', async () => {
      mockRpc.getAccountAddress.mockResolvedValue(mockAddress);
      mockRpc.getBalance.mockResolvedValue(mockBalance);

      const result = await repository.getWalletInfo();

      expect(result.address).toBe(mockAddress);
      expect(result.balance).toBe(mockBalance);
      expect(mockRpc.getAccountAddress).toHaveBeenCalledWith('');
      expect(mockRpc.getBalance).toHaveBeenCalled();
    });

    it('should throw error when any RPC call fails', async () => {
      const error = new Error('RPC Error');
      mockRpc.getAccountAddress.mockResolvedValue(mockAddress);
      mockRpc.getBalance.mockRejectedValue(error);

      await expect(repository.getWalletInfo()).rejects.toThrow('RPC Error');
    });
  });
});
