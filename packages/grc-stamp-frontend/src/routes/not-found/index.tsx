import React from 'react';
import {
  Container, Box, Typography, Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import { Seo } from '@/components/Seo';
import { PageWrapper } from '@/components/PageWrapper';
import { plausibleClass, track } from '@/lib/track';

const PageBody = styled(Box)(() => ({
  backgroundImage: 'url(/il-background-error-page.svg)',
  backgroundSize: 'cover',
}));

const NotFoundError = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(5),
}));

const ErrorContainer = styled(Container)(() => ({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
}));

export function NotFound() {
  // A bad /proof/<hash> link lands here too; mask the hash out of the prop.
  React.useEffect(() => {
    track('404', { path: document.location.pathname.replace(/[0-9a-f]{64}/gi, ':hash') });
  }, []);

  return (
    <PageBody>
      <Seo
        title="Page Not Found"
        description="The page you were looking for does not exist."
        path="/404"
        noindex
      />
      <PageWrapper>
        <ErrorContainer maxWidth="xl">
          <Image
            src="/ic-error.svg"
            width={244}
            height={310}
            alt="Major Tom"
          />
          <NotFoundError variant="h4" color="inherit">
            This page has been eaten by Major Tom!
          </NotFoundError>
          <Link href="/" passHref className={plausibleClass('CTA Click', { cta: '404 Home' })}>
            <Button variant="contained">Ground control, bring me home.</Button>
          </Link>
        </ErrorContainer>
      </PageWrapper>
    </PageBody>
  );
}
