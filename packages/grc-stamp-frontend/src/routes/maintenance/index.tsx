import { Container, Typography } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import { Seo, SITE_NAME } from '@/components/Seo';
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
      <Seo
        title={`${SITE_NAME} :: Under Maintenance`}
        description="The website is currently under maintenance. We will be back soon."
        path="/"
        noindex
      />
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
