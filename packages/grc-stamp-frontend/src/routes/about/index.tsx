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
      <Seo
        title={`${SITE_NAME} :: About`}
        description="Learn about Gridcoin blockchain stamping, how it works, the protocol behind it, and the costs involved in certifying your documents on the Gridcoin blockchain."
        path="/about"
        ogType="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `About ${SITE_NAME}`,
          description: 'Learn how Proof of Existence works on the Gridcoin blockchain.',
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
              <Typography component="h1" variant="h4" pb={2}>
                {`About ${SITE_NAME}`}
              </Typography>
              <ProofOfExistence />
              <About />
              <Protocol />
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
