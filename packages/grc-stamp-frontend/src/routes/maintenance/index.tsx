import { Container, Typography } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import { styled } from '@mui/material/styles';
import { GradientLine } from '@/components/GradientLine';
import { Header } from '@/components/Header/Header';
import { PageWrapper } from '@/components/PageWrapper';

const Centered = styled('div')(() => ({
  width: '100%',
  display: 'flex',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
}));

export function Page() {
  return (
    <>
      <Head>
        <title>Gridcoin blockchain stamping :: Under Maintenance</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <PageWrapper>
        <Header showLinks={false} />
        <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
          <GradientLine />
          <Centered>
            <Typography variant="h4">
              The website is under maintenance.
              {' '}
              <br />
              We will be back soon!
            </Typography>
          </Centered>
        </Container>
      </PageWrapper>
    </>

  );
}
