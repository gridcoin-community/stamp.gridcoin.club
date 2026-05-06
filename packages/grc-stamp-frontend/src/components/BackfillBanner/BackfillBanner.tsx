import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Container from '@mui/material/Container';
import { useIndexerStatus } from '@/lib/indexerStatusContext';

// Effective catch-up rate the backend hits in practice — drives the
// rough ETA shown in the banner. With the batched-getBlocksBatch
// scraper (one RPC pulls up to 1000 blocks; back-to-back loop while
// behind), real-world throughput is ~10k blocks/min on a co-located
// wallet. Round down for honest under-promising; users find a
// "20 minutes" that finishes in 18 better than a "4 hours" that
// finishes in 20.
const CATCH_UP_BLOCKS_PER_MIN = 10000;

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
  const { status } = useIndexerStatus();

  if (!status?.isBackfilling) return null;

  const eta = formatEta(status.lag);

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 2 }}>
      <Alert
        severity="info"
        sx={{
          border: 2,
          borderColor: 'info.main',
          borderRadius: 2,
          boxShadow: 2,
          '& .MuiAlert-icon': { fontSize: 28 },
        }}
      >
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
  );
}
