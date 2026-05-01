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
  // Credits,
  About,
  Costs,
  Disclaimer,
  ProofOfExistence,
  Protocol,
} from './Chapters';

export function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Seo
        title={`${SITE_NAME} :: About`}
        description="How Gridcoin blockchain stamping works, the on-chain protocol it uses, and what it costs to certify a document."
        path="/about"
        ogType="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `About ${SITE_NAME}`,
          description: 'How Proof of Existence works on the Gridcoin blockchain.',
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
                {`About ${SITE_NAME}`}
              </Typography>
              <Typography gutterBottom variant="body1" component="p">
                {`${SITE_NAME} is a free Proof of Existence service. Drop a file into the app: the browser computes its SHA-256 hash and writes that hash to the Gridcoin blockchain. The document itself never leaves your device. This page walks through the idea behind the service, the on-chain protocol it uses, and what it costs to run.`}
              </Typography>
              <ProofOfExistence />
              <About />
              <Protocol />
              <Costs />
              <Disclaimer />
              {/* <Credits /> */}
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </PageWrapper>
      <ScrollTopFab />
    </>
  );
}
