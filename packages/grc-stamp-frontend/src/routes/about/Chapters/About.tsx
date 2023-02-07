/* eslint-disable max-len */
import { Typography, Box, Link } from '@mui/material';
import React from 'react';

function ChapterAbout() {
  return (
    <Box pb={3}>
      <Typography variant="h4" component="h3" pb={2} id="about-the-service">
        About the Service
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          This service provides a straightforward implementation of the Proof of Existence concept on the Gridcoin blockchain.
          You can securely and anonymously store proof of the existence of any of your documents (e.g. images, videos, documents, binaries)
          in the decentralized ledger without revealing the actual content of the document.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>
            We do not store any of your data (with the exception of the document&apos;s hash).
            Your documents are not uploaded to our database or stored on the blockchain, and they never leave your device.
          </b>
          The document&apos;s SHA-256 hash is calculated client-side, in your browser, to ensure the security of your data.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          We also prioritize privacy and do not use any tracking pixels.
          The only exception is
          {' '}
          <Link href="https://github.com/plausible/analytics" rel="nofollow">Plausible</Link>
          {' '}
          , which is considered a privacy-friendly alternative to Google Analytics.
        </Typography>
      </Box>
    </Box>
  );
}

export const About = React.memo(ChapterAbout);
