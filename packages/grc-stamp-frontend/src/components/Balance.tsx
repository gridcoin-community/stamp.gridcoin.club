import axios from 'axios';
import React, { useState, useEffect } from 'react';

export function BalanceComponent() {
  const [balance, setBalance] = useState(0);

  const fetchBalance = async () => {
    const res: any = await axios.get(`${process.env.API_URL}/wallet/balance`);
    setBalance(res.data?.data?.attributes?.balance || 0);
  };

  useEffect(() => {
    fetchBalance();
  });

  return (
    <div>
      Balance:
      {' '}
      {balance}
    </div>
  );
}

export const Balance = React.memo(BalanceComponent);
