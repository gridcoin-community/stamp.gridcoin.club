import { Box, Typography } from '@mui/material';
import { WalletEntity } from 'entities/WalletEntity';
import React, { useState, useEffect } from 'react';
import { WalletRepository } from 'repositories/WalletRepository';
import { useInterval } from 'hooks';

const walletRepository = new WalletRepository();

export function BalanceComponent() {
  const [walletData, setWalletData] = useState<WalletEntity>();

  const fetchWalletInfo = async () => {
    const walletEntity = await walletRepository.getWalletData();
    if (walletEntity) {
      setWalletData(walletEntity);
    }
  };

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  useInterval(() => {
    fetchWalletInfo();
  }, 90000);

  return (
    <>
      <Box>
        <Typography variant="caption">
          Stamp service wallet balance:
          {' '}
          {walletData?.balance}
          {' '}
          grc
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption">
          Address:
          {' '}
          { process.env.NEXT_PUBLIC_WALLET_ADDRESS }
        </Typography>
      </Box>
    </>
  );
}

export const Balance = React.memo(BalanceComponent);
