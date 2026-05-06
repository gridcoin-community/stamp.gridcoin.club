import { useCallback, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useSSEEvent } from '@/hooks';
import { IndexerStatusEvent } from '@/types';

// Effective catch-up rate the backend hits in practice — drives the
// rough ETA shown in the banner. The scraper drains BLOCK_GROUPS=1500
// per minute while the chain advances ~40 blocks/min, so net is ~1460
// blocks/min. Round down for honest under-promising.
const CATCH_UP_BLOCKS_PER_MIN = 1000;

function formatEta(lag: number): string | null {
  if (lag <= 0) return null;
  const minutes = Math.ceil(lag / CATCH_UP_BLOCKS_PER_MIN);
  if (minutes < 2) return 'about a minute';
  if (minutes < 60) return `about ${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `about ${hours} hour${hours === 1 ? '' : 's'}`;
  const days = Math.round(hours / 24);
  return `about ${days} day${days === 1 ? '' : 's'}`;
}

export function BackfillBanner() {
  const [status, setStatus] = useState<IndexerStatusEvent['data'] | null>(null);

  useSSEEvent(
    'indexerStatus',
    useCallback((data: IndexerStatusEvent['data']) => {
      setStatus(data);
    }, []),
  );

  if (!status?.isBackfilling) return null;

  const eta = formatEta(status.lag);

  return (
    <Box sx={{ width: '100%' }}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Alert severity="info" variant="outlined">
          <AlertTitle>Re-indexing in progress</AlertTitle>
          New stamps you submit are recorded immediately and the
          {' '}
          on-chain transaction is published right away. The confirmation
          {' '}
          shown here will appear once the indexer catches up — currently
          {' '}
          <strong>{status.lag.toLocaleString()}</strong>
          {' '}
          blocks behind
          {eta ? `, ${eta} to go` : ''}
          .
        </Alert>
      </Container>
    </Box>
  );
}
