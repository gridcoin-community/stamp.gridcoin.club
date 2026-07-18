import React from 'react';
import {
  Container,
  useMediaQuery,
  useTheme,
  Grid,
  Typography,
} from '@mui/material';
import { Header } from '@/components/Header/Header';
import { Seo, SITE_NAME, SITE_URL } from '@/components/Seo';
import { Footer } from '@/components/Footer/Footer';
import { GradientLine } from '@/components/GradientLine';
import { ScrollTopFab } from '@/components/ScrollTopFab/ScrollTopFab';
import { PageWrapper } from '../../components/PageWrapper';
import { Contents } from './Contents';
import {
  Acceptance,
  Service,
  WhatItProves,
  AcceptableUse,
  Privacy,
  OpenSource,
  Disclaimer,
  Liability,
  General,
} from './Chapters';

export function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Seo
        title={`${SITE_NAME} :: Terms`}
        description={`Terms of Service for ${SITE_NAME}: what a stamp proves and doesn’t, acceptable use, privacy, disclaimers, and liability.`}
        path="/terms"
        ogType="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `Terms of Service · ${SITE_NAME}`,
          description: `Terms of Service for ${SITE_NAME}.`,
          author: { '@type': 'Person', name: '@gridcat' },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
          },
        }}
      />
      <PageWrapper>
        <Header />
        <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
          <GradientLine />
          <Grid container spacing={3}>
            <Grid size={{ sm: 3, xs: 12 }} sx={{ display: isMobile ? 'none' : 'flex' }}>
              <Contents />
            </Grid>
            <Grid size={{ sm: 9, xs: 12 }}>
              <Typography component="h1" variant="h4" sx={{ pb: 2 }}>
                Terms of Service
              </Typography>
              <Typography gutterBottom variant="body1" component="p">
                The rules of the road for using
                {' '}
                {SITE_NAME}
                . Plain-English where it can be, legalese where it
                has to be.
              </Typography>
              <Acceptance />
              <Service />
              <WhatItProves />
              <AcceptableUse />
              <Privacy />
              <OpenSource />
              <Disclaimer />
              <Liability />
              <General />
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </PageWrapper>
      <ScrollTopFab />
    </>
  );
}
