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
import { PageWrapper } from '@/components/PageWrapper';
import { ScrollTopFab } from '@/components/ScrollTopFab/ScrollTopFab';
import { Contents } from './Contents';
// TODO: re-enable <Events /> once Cloudflare stops buffering SSE.
import {
  Overview,
  Conventions,
  Errors,
  Status,
  Stamps,
  Hashes,
  Wallet,
  Disclaimer,
} from './Chapters';

const DESCRIPTION = 'Public JSON:API for the Gridcoin blockchain stamping service — '
  + 'create stamps, look up SHA-256 hashes, query the service wallet, and stream real-time blockchain events.';

export function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Seo
        title={`${SITE_NAME} :: API Reference`}
        description={DESCRIPTION}
        path="/developers"
        ogType="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: `${SITE_NAME} API Reference`,
          description: DESCRIPTION,
          author: { '@type': 'Person', name: '@gridcat' },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
          },
          articleSection: 'API Documentation',
          proficiencyLevel: 'Expert',
        }}
      />
      <PageWrapper>
        <Header />
        <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
          <GradientLine />
          <Grid container spacing={3}>
            <Grid
              size={{ sm: 3, xs: 12 }}
              sx={{ display: isMobile ? 'none' : 'flex' }}
            >
              <Contents />
            </Grid>
            <Grid size={{ sm: 9, xs: 12 }}>
              <Typography component="h1" variant="h4" pb={2}>
                API Reference
              </Typography>
              <Typography gutterBottom variant="body1" component="p">
                A public, auth-free JSON:API for creating and verifying blockchain
                stamps on Gridcoin.
              </Typography>
              <Overview />
              <Conventions />
              <Errors />
              <Status />
              <Stamps />
              <Hashes />
              <Wallet />
              <Disclaimer />
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </PageWrapper>
      <ScrollTopFab />
    </>
  );
}
