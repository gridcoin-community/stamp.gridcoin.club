import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useInterval, useSSEEvent } from '@/hooks';
import { WalletEntity } from '@/entities/WalletEntity';
import { WalletRepository } from '@/repositories/WalletRepository';
import { ProcessBlockEvent } from '@/types';

const walletRepository = new WalletRepository();

export function BalanceComponent() {
  const [walletData, setWalletData] = useState<WalletEntity>();
  const [blockHeight, setBlockHeight] = useState<number>(0);

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

  useSSEEvent('processBlock', (event: ProcessBlockEvent['data']) => {
    setBlockHeight(event.block);
  });

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
          {process.env.NEXT_PUBLIC_WALLET_ADDRESS}
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption">
          Current block height:
          {' '}
          {blockHeight || walletData?.block || 'N/A'}
        </Typography>
      </Box>
    </>
  );
}

export const Balance = React.memo(BalanceComponent);
