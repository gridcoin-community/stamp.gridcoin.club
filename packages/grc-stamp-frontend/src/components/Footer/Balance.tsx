import { Box, Typography } from '@mui/material';
import { WalletEntity } from 'entities/WalletEntity';
import React, { useState, useEffect } from 'react';
import { WalletRepository } from 'repositories/WalletRepository';

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
          { walletData?.address }
        </Typography>
      </Box>
    </>
  );
}

export const Balance = React.memo(BalanceComponent);
