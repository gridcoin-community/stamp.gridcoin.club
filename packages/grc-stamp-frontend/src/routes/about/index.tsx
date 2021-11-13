import React from 'react';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import Head from 'next/head';
import {
  Container, Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { PageWrapper } from '../../components/PageWrapper';
import { Contents } from './Contents';
import {
  // Credits,
  About,
  Costs,
  ProofOfExistence,
  // Protocol,
} from './Chapters';

export function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            <Grid item sm={3} sx={{ display: isMobile ? 'none' : 'flex' }}>
              <Contents />
            </Grid>
            <Grid item sm={9}>
              <ProofOfExistence />
              <About />
              {/* <Protocol /> */}
              <Costs />
              {/* <Credits /> */}
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </PageWrapper>
    </>
  );
}
