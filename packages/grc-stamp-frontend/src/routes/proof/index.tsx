import React from 'react';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import Head from 'next/head';
import {
  Container,
  Box,
  List,
  Divider,
  Typography,
} from '@mui/material';
import { StampEntity } from 'entities/StampEntity';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Info } from 'components/Info/Info';
import { PageWrapper } from 'components/PageWrapper';
import { StampBlockchainData } from 'components/Info/StampBlockchainData';
import { styled } from '@mui/material/styles';

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
          <Message gutterBottom variant="body1">
            This document&apos;s digest was successfully embedded in the Gridcoin blockchain.
            <br />
            It is now permanently certified and proven to exist since the transaction was confirmed.
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
