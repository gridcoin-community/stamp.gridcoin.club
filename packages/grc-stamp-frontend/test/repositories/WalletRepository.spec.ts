import { describe, it, expect, vi, type MockedObject } from 'vitest';
import axios from 'axios';
import { WalletEntity } from '@/entities/WalletEntity';
import { WalletRepository } from '@/repositories/WalletRepository';
import { walletMock } from './mocks';

vi.mock('axios');
const mockedAxios = axios as MockedObject<typeof axios>;

describe('WalletRepository', () => {
  it('Should get wallet infor and transform it to the entity', async () => {
    mockedAxios.get.mockResolvedValue({
      data: walletMock,
    });

    const repo = new WalletRepository();
    const entity = await repo.getWalletData() as WalletEntity;
    expect(entity.address).toBe(walletMock.data.attributes.address);
    expect(entity.balance).toBe(walletMock.data.attributes.balance);
  });
});
