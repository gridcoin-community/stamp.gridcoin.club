import React from 'react';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import Head from 'next/head';
import {
  Container, Grid,
} from '@mui/material';
import { PageWrapper } from '../../components/PageWrapper';
import { Contents } from './Contents';
import { Credits } from './Chapters/Credits';
import { Costs } from './Chapters/Costs';

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
          <Grid container spacing={3}>
            <Grid item sm={3}>
              <Contents />
            </Grid>
            <Grid item sm={9}>
              <Costs />
              <Credits />
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </PageWrapper>
    </>
  );
}
