import React from 'react';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import Head from 'next/head';
import { Container } from '@mui/material';
import { PageWrapper } from '../../components/PageWrapper';

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
