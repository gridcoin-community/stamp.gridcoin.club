import React from 'react';
import Head from 'next/head';
import {
  Container, Box, Typography, Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import { PageWrapper } from '../../components/PageWrapper';

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
  return (
    <PageBody>
      <Head>
        <title>Page Not Found</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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
          <Link href="/" passHref>
            <Button variant="contained">Ground control, bring me home.</Button>
          </Link>
        </ErrorContainer>
      </PageWrapper>
    </PageBody>
  );
}
