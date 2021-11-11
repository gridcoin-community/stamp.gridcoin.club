/* eslint-disable max-len */
import { Typography, Box } from '@mui/material';
import React from 'react';

function ChapterAbout() {
  return (
    <Box pb={3}>
      <Typography variant="h4" component="h3" pb={2}>
        About the service
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          This service is intended to provide simple implementation of the Proof of Existence method on the Gridcoin blockchain.
          You can anonymously and securely store the proof of existence of any of your documents (images, videos, documents, binaries...) in the distributed ledger.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>We DO NOT store your documents neither in our database nor in the blockchain. Furthemore, your documents are NOT uploaded to the server.</b>
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          We do not use any of tracking pixels, the only analytics we use is
          {' '}
          <a href="https://github.com/plausible/analytics" rel="nofollow">Plausible</a>
          {' '}
          which claims to be  privacy-friendly web analytics alternative to Google Analytics.
        </Typography>
      </Box>
    </Box>
  );
}

export const About = React.memo(ChapterAbout);
