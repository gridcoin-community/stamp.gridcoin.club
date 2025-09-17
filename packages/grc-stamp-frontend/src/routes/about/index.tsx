import React from 'react';
import Head from 'next/head';
import {
  Container,
  Grid2,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { GradientLine } from '@/components/GradientLine';
import { PageWrapper } from '../../components/PageWrapper';
import { Contents } from './Contents';
import {
  // Credits,
  About,
  Costs,
  ProofOfExistence,
  Protocol,
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
          <GradientLine />
          <Grid2 container spacing={3}>
            <Grid2 size={{ sm: 3, xs: 12 }} sx={{ display: isMobile ? 'none' : 'flex' }}>
              <Contents />
            </Grid2>
            <Grid2 size={{ sm: 9, xs: 12 }}>
              <ProofOfExistence />
              <About />
              <Protocol />
              <Costs />
              {/* <Credits /> */}
            </Grid2>
          </Grid2>
        </Container>
        <Footer />
      </PageWrapper>
    </>
  );
}
