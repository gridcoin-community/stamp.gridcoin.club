import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSSEEvent } from '@/hooks';
import { useWallet } from '@/lib/walletContext';
import { useIndexerStatus } from '@/lib/indexerStatusContext';
import { ProcessBlockEvent } from '@/types';

export function BalanceComponent() {
  const { wallet: walletData } = useWallet();
  const { status: indexerStatus } = useIndexerStatus();
  const [blockHeight, setBlockHeight] = useState<number>(0);

  useSSEEvent('processBlock', (event: ProcessBlockEvent['data']) => {
    setBlockHeight(event.block);
  });

  // The indexer block ticks once per processed block via the
  // `processBlock` SSE — that's the live ticker the user sees move.
  // `indexerStatus` only fires at the start/end of each scrape cycle
  // (~once a minute), so it's the right source for the chain tip
  // (which doesn't tick faster than that anyway) but the wrong source
  // for the indexer head — using it there freezes the number between
  // ticks.
  const indexerBlock = blockHeight || indexerStatus?.indexerBlock || 0;
  const chainTip = indexerStatus?.chainTip || 0;
  const isBackfilling = indexerStatus?.isBackfilling ?? false;
  // Progress is measured against the indexer's start block, not chain
  // genesis — START_BLOCK is the protocol's first relevant block, so
  // anything below it is uninteresting and should not count toward
  // "done". Without this offset, an indexer starting at 1.58M with a
  // chain tip at 1.58M reads ~99.9% before it has parsed a single
  // block of actual work.
  const startBlock = indexerStatus?.startBlock ?? 0;
  const span = chainTip - startBlock;
  const done = Math.max(0, indexerBlock - startBlock);
  const pctDone = isBackfilling && span > 0
    ? Math.min(100, Math.floor((done / span) * 100))
    : null;

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
        <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums' }}>
          Current block height:
          {' '}
          {indexerBlock || chainTip ? (
            isBackfilling ? (
              <>
                {indexerBlock.toLocaleString()}
                {' / '}
                {chainTip.toLocaleString()}
                {pctDone !== null && (
                  <>
                    {' '}
                    (
                    {pctDone}
                    %)
                  </>
                )}
              </>
            ) : (
              (indexerBlock || chainTip).toLocaleString()
            )
          ) : 'N/A'}
        </Typography>
      </Box>
    </>
  );
}

export const Balance = React.memo(BalanceComponent);
