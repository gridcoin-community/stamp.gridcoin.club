import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Container,
  Box,
  Button,
  List,
  Divider,
  Typography,
  CircularProgress,
  Badge,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { styled } from '@mui/material/styles';
import { identiconDataUrl } from '@/lib/identicon';
import { Seo, SITE_NAME } from '@/components/Seo';
import { StampEntity } from '@/entities/StampEntity';
import { Info } from '@/components/Info/Info';
import { PageWrapper } from '@/components/PageWrapper';
import { StampBlockchainData } from '@/components/Info/StampBlockchainData';
import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { StampRepository } from '@/repositories/StampsRepository';
import { useInterval, useSSEEvent } from '@/hooks';

const Message = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'justify',
  },
}));

const IdenticonWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(3, 0, 2),
}));

const IdenticonImg = styled('img')(({ theme }) => ({
  width: 160,
  height: 160,
  borderRadius: 16,
  imageRendering: 'pixelated',
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
}));

const StatusBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    width: 44,
    height: 44,
    borderRadius: '50%',
    padding: 0,
    border: `3px solid ${theme.palette.background.default}`,
    backgroundColor: theme.palette.background.paper,
  },
}));

const ConfirmedBadgeIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: 44,
  color: theme.palette.success.main,
}));

const PendingBadgeSpinner = styled(CircularProgress)(() => ({
  width: '34px !important',
  height: '34px !important',
}));

interface Props {
  stamp: StampEntity;
}

const stampRepository = new StampRepository();

export function Page({ stamp: initialStamp }: Props) {
  const [stamp, setStamp] = useState<StampEntity>(initialStamp);
  const hash = stamp.hash ?? '';
  const isPending = !stamp.isFinished();

  // Rendered during SSR so the favicon ships in the initial HTML.
  const identiconSrc = useMemo(
    () => (hash ? identiconDataUrl(hash, 120) : undefined),
    [hash],
  );

  const refresh = useCallback(async () => {
    if (!hash) return;
    const fresh = await stampRepository.findStampByHash(hash);
    if (fresh) {
      setStamp(fresh);
    }
  }, [hash]);

  // Bridge the SSR → CSR gap: the stamp may have confirmed on chain between
  // the server render and the client hydration, so pull a fresh copy on mount.
  useEffect(() => {
    if (isPending) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live updates while pending. SSE fires within ~1s of confirmation; the
  // 30s poll is the Cloudflare-buffering backstop. Both go fully idle once
  // the stamp confirms.
  useSSEEvent('transactionFound', () => {
    if (isPending) refresh();
  });
  useSSEEvent('stampSubmitted', () => {
    if (isPending) refresh();
  });
  useInterval(refresh, isPending ? 30_000 : null);

  const title = isPending
    ? `${SITE_NAME} :: Pending proof of ${hash}`
    : `${SITE_NAME} :: Proof of ${hash}`;
  const description = isPending
    ? `This hash is queued for stamping on the Gridcoin blockchain (${hash}). This page will update automatically when the transaction is confirmed.`
    : `This document's digest has been permanently certified in the Gridcoin blockchain with hash ${hash}.`;

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={`/proof/${hash}`}
        noindex={isPending}
        iconDataUrl={identiconSrc}
        ogImagePath={`/og/${hash}`}
        jsonLd={
          isPending
            ? undefined
            : {
              '@context': 'https://schema.org',
              '@type': 'DigitalDocument',
              name: `Blockchain Proof of ${hash}`,
              description: 'Document digest permanently certified on Gridcoin blockchain.',
              identifier: hash,
              ...(stamp.time ? { dateCreated: new Date(stamp.time * 1000).toISOString() } : {}),
            }
        }
      />
      <PageWrapper>
        <Header />
        <Container maxWidth="md" sx={{ flexGrow: 1 }}>
          <Typography
            component="h1"
            variant="h5"
            gutterBottom
            sx={{ overflowWrap: 'anywhere', textAlign: 'center' }}
          >
            {isPending ? 'Pending proof of ' : 'Proof of '}
            {hash}
          </Typography>
          {identiconSrc && (
            <IdenticonWrapper>
              <StatusBadge
                overlap="rectangular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                  isPending ? (
                    <PendingBadgeSpinner color="primary" thickness={5} />
                  ) : (
                    <ConfirmedBadgeIcon />
                  )
                }
              >
                <IdenticonImg
                  src={identiconSrc}
                  alt={`Visual fingerprint of ${hash}`}
                />
              </StatusBadge>
            </IdenticonWrapper>
          )}
          {isPending ? (
            <>
              <Message gutterBottom variant="body1">
                This hash has been queued for stamping and is waiting for
                confirmation on the Gridcoin blockchain.
                <br />
                This page will update automatically once the transaction is
                confirmed, usually within a few minutes.
              </Message>
              <List>
                <Info title="Hash" value={hash} />
              </List>
            </>
          ) : (
            <>
              <Message gutterBottom variant="body1">
                This document&apos;s digest is embedded in the Gridcoin blockchain.
                <br />
                It is permanently certified and proven to have existed since the transaction was confirmed.
              </Message>
              <List>
                <Info
                  title="Hash"
                  value={hash}
                />
                <Divider variant="fullWidth" component="li" />
                <StampBlockchainData stamp={stamp} />
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  component="a"
                  href={`/proof/${hash}/certificate.pdf`}
                  target="_blank"
                  rel="noopener"
                  variant="contained"
                  color="primary"
                  startIcon={<PictureAsPdfIcon />}
                  className="plausible-event-name=Download+Certificate+PDF"
                >
                  Download certificate
                </Button>
              </Box>
            </>
          )}
        </Container>
        <Footer />
      </PageWrapper>
    </>
  );
}
