import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Container from '@mui/material/Container';
import { useWallet } from '@/lib/walletContext';

export function LowFundsBanner() {
  const { wallet } = useWallet();

  if (!wallet?.isLowFunds) return null;

  const address = process.env.NEXT_PUBLIC_WALLET_ADDRESS;

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 2 }}>
      <Alert
        severity="warning"
        sx={{
          border: 2,
          borderColor: 'warning.main',
          borderRadius: 2,
          boxShadow: 2,
          '& .MuiAlert-icon': { fontSize: 28 },
        }}
      >
        <AlertTitle>We&apos;ve run out of gridcoins</AlertTitle>
        Verifications still work. Drop a file and we&apos;ll tell you if
        {' '}
        it&apos;s already been stamped. New stamps are paused for now: the
        {' '}
        wallet balance
        {` (${wallet.balance} GRC)`}
        {' '}
        is below what each transaction needs to cover its fee.
        {address && (
          <>
            {' '}
            If you can chip in, any amount sent to
            {' '}
            <strong>{address}</strong>
            {' '}
            goes right back into stamping more documents for everyone.
          </>
        )}
      </Alert>
    </Container>
  );
}
