import { expect } from 'chai';
import axios from 'axios';
import { WalletEntity } from 'entities/WalletEntity';
import { WalletRepository } from '../../src/repositories/WalletRepository';
import { walletMock } from './mocks';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WalletRepository', () => {
  it('Should get wallet infor and transform it to the entity', async () => {
    mockedAxios.get.mockResolvedValue({
      data: walletMock,
    });

    const repo = new WalletRepository();
    const entity = await repo.getWalletData() as WalletEntity;
    expect(entity.address).to.be.equal(walletMock.data.attributes.address);
    expect(entity.balance).to.be.equal(walletMock.data.attributes.balance);
  });
});
