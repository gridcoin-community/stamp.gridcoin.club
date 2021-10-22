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
      <div>
        Stamp service wallet balance:
        {' '}
        {balance}
        {' '}
        grc
      </div>
      <div>
        Address:
        {' '}
        { process.env.NEXT_PUBLIC_WALLET_ADDRESS }
      </div>
    </>
  );
}

export const Balance = React.memo(BalanceComponent);
