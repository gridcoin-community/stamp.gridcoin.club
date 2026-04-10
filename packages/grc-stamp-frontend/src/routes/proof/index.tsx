import React from 'react';
import {
  Container,
  Box,
  List,
  Divider,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { styled } from '@mui/material/styles';
import { Seo, SITE_NAME } from '@/components/Seo';
import { StampEntity } from '@/entities/StampEntity';
import { Info } from '@/components/Info/Info';
import { PageWrapper } from '@/components/PageWrapper';
import { StampBlockchainData } from '@/components/Info/StampBlockchainData';
import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';

const Message = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'justify',
  },
}));

interface Props {
  stamp: StampEntity;
}

export function Page({ stamp }: Props) {
  const title = `${SITE_NAME} :: Proof of ${stamp.hash}`;
  const description = `This document's digest has been permanently certified in the Gridcoin blockchain with hash ${stamp.hash}.`;
  return (
    <>
      <Seo
        title={title}
        description={description}
        path={`/proof/${stamp.hash}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'DigitalDocument',
          name: `Blockchain Proof of ${stamp.hash}`,
          description: 'Document digest permanently certified on Gridcoin blockchain.',
          identifier: stamp.hash,
          ...(stamp.time ? { dateCreated: new Date(stamp.time * 1000).toISOString() } : {}),
        }}
      />
      <PageWrapper>
        <Header />
        <Container maxWidth="md" sx={{ flexGrow: 1 }}>
          <Typography component="h1" variant="h5" textAlign="center" gutterBottom>
            {'Proof of '}
            {stamp.hash}
          </Typography>
          <Message gutterBottom variant="body1">
            This document&apos;s digest was successfully embedded in the Gridcoin blockchain.
            <br />
            It is permanently certified and proven to exist since the transaction was confirmed.
          </Message>
          <Box justifyContent="center" display="flex" pt={2}>
            <CheckCircleOutlineIcon sx={{ fontSize: 140 }} color="success" />
          </Box>
          <List>
            <Info
              title="Hash"
              value={stamp.hash}
            />
            <Divider variant="fullWidth" component="li" />
            <StampBlockchainData stamp={stamp} />
          </List>
        </Container>
        <Footer />
      </PageWrapper>
    </>
  );
}
