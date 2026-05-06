import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { useInterval } from '@/hooks';
import { WalletEntity, WalletRawData } from '@/entities/WalletEntity';
import { WalletRepository } from '@/repositories/WalletRepository';

// Chain blocks arrive ~90s apart, so anything finer just burns RPC.
const POLL_INTERVAL_MS = 90_000;

interface WalletContextValue {
  wallet: WalletEntity | null;
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue>({
  wallet: null,
  refresh: () => Promise.resolve(),
});

const repository = new WalletRepository();

function isSameWallet(a: WalletEntity | null, b: WalletEntity | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.balance === b.balance
    && a.address === b.address
    && a.block === b.block
    && a.minimumBalance === b.minimumBalance
    && a.effectiveBalance === b.effectiveBalance;
}

interface ProviderProps {
  children: React.ReactNode;
  // Plain JSON shape (not the class) so the SSR boundary can serialize
  // it through pageProps without a class-instance round-trip.
  initialWallet?: WalletRawData | null;
}

export function WalletProvider({ children, initialWallet = null }: ProviderProps) {
  const [wallet, setWallet] = useState<WalletEntity | null>(
    initialWallet ? new WalletEntity(initialWallet) : null,
  );
  const seededRef = useRef(initialWallet !== null);

  const refresh = useCallback(async () => {
    try {
      const entity = await repository.getWalletData();
      // Skip the setState when the fields haven't changed — otherwise
      // every poll re-creates the entity instance and re-renders every
      // consumer for free.
      if (entity) setWallet((prev) => (isSameWallet(prev, entity) ? prev : entity));
    } catch {
      // Swallow — the banner just doesn't update this tick.
    }
  }, []);

  useEffect(() => {
    if (!seededRef.current) refresh();
  }, [refresh]);

  useInterval(() => {
    refresh();
  }, POLL_INTERVAL_MS);

  const value = useMemo<WalletContextValue>(
    () => ({ wallet, refresh }),
    [wallet, refresh],
  );

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  return useContext(WalletContext);
}
