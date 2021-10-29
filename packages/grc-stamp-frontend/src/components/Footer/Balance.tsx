import { Box, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

export function BalanceComponent() {
  const [balance, setBalance] = useState(0);

  const fetchBalance = async () => {
    const res: any = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallet/balance`);
    setBalance(res.data?.data?.attributes?.balance || 0);
  };

  useEffect(() => {
    fetchBalance();
  });

  return (
    <>
      <Box>
        <Typography variant="caption">
          Stamp service wallet balance:
          {' '}
          {balance}
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
