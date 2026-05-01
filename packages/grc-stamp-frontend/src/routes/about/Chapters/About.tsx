 
import { Typography, Box } from '@mui/material';
import React from 'react';
import { NextMuiLink } from '@/components/NextMuiLink';

export function About() {
  return (
    <Box sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" id="about-the-service" sx={{ pb: 2 }}>
        About the Service
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          This service is a straightforward implementation of the Proof of Existence concept on the Gridcoin blockchain.
          You can securely and anonymously prove the existence of any document (images, videos, documents, binaries)
          in the decentralized ledger without revealing the actual content of the document.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>
            We do not store any of your data, except for the document&apos;s hash.
            Your documents are not uploaded to our database or stored on the blockchain, and they never leave your device.
          </b>
          The hash is calculated in your browser, so the file itself never leaves your device.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          We don&apos;t use tracking pixels. The only exception is
          {' '}
          <NextMuiLink href="https://github.com/plausible/analytics" rel="nofollow" color="primary">Plausible</NextMuiLink>
          , a privacy-friendly alternative to Google Analytics.
        </Typography>
      </Box>
    </Box>
  );
}
