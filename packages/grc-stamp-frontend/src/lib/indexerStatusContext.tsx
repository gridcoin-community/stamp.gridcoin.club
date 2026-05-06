import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useSSEEvent } from '@/hooks';
import { IndexerStatusEvent } from '@/types';

interface IndexerStatusContextValue {
  status: IndexerStatusEvent['data'] | null;
}

const IndexerStatusContext = createContext<IndexerStatusContextValue>({ status: null });

interface ProviderProps {
  children: React.ReactNode;
  initialStatus?: IndexerStatusEvent['data'] | null;
}

function isSameStatus(
  a: IndexerStatusEvent['data'] | null,
  b: IndexerStatusEvent['data'] | null,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.startBlock === b.startBlock
    && a.indexerBlock === b.indexerBlock
    && a.chainTip === b.chainTip
    && a.lag === b.lag
    && a.isBackfilling === b.isBackfilling;
}

export function IndexerStatusProvider({ children, initialStatus = null }: ProviderProps) {
  const [status, setStatus] = useState<IndexerStatusEvent['data'] | null>(initialStatus);

  useSSEEvent('indexerStatus', (data: IndexerStatusEvent['data']) => {
    // Skip the setState (and therefore every consumer's re-render)
    // when the snapshot fields haven't actually moved.
    setStatus((prev) => (isSameStatus(prev, data) ? prev : data));
  });

  const value = useMemo<IndexerStatusContextValue>(() => ({ status }), [status]);

  return (
    <IndexerStatusContext.Provider value={value}>
      {children}
    </IndexerStatusContext.Provider>
  );
}

export function useIndexerStatus(): IndexerStatusContextValue {
  return useContext(IndexerStatusContext);
}
