import React from 'react';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import Head from 'next/head';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';

const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(2),

  },
}));

export function Page() {
  return (
    <>
      <Head>
        <title>Gridcoin blockchain stamping :: About</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <PageWrapper>
        <Header />
        <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
          123
        </Container>
        <Footer />
      </PageWrapper>
    </>
  );
}
