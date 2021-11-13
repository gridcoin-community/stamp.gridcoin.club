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
          This service is intended to provide a simple implementation of the Proof of Existence method on the Gridcoin blockchain.
          You can anonymously and securely store the proof of the existence of any of your documents (images, videos, documents, binaries...) in the distributed ledger.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>We DO NOT store any of your data (except the document hash of course). We store your documents neither in our database nor in the blockchain. Furthermore, your documents are NOT uploaded to the server. </b>
          The document is required to calculate sha256 of it, these calculations are done in the browser (on the client-side) only.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          We do not use any of the tracking pixels, the only exception is
          {' '}
          <Link href="https://github.com/plausible/analytics" rel="nofollow">Plausible</Link>
          {' '}
          which claims to be the privacy-friendly web analytics alternative to Google Analytics.
        </Typography>
      </Box>
    </Box>
  );
}

export const About = React.memo(ChapterAbout);
