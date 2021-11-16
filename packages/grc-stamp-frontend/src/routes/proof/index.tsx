import React from 'react';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import Head from 'next/head';
import {
  Container,
  Box,
  List,
  Divider,
} from '@mui/material';
import { StampEntity } from 'entities/StampEntity';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Info } from 'components/Info/Info';
import { PageWrapper } from 'components/PageWrapper';
import { StampBlockchainData } from 'components/Info/StampBlockchainData';

interface Props {
  stamp: StampEntity;
}

export function Page({ stamp }: Props) {
  return (
    <>
      <Head>
        <title>
          Gridcoin blockchain stamping :: Proof for
          {' '}
          {stamp.hash}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <PageWrapper>
        <Header />
        <Container maxWidth="md" sx={{ flexGrow: 1 }}>
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
