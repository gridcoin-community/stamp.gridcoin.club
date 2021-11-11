/* eslint-disable max-len */
import { Typography, Box } from '@mui/material';
import React from 'react';

function ChapterProtocol() {
  return (
    <Box pb={3}>
      <Typography variant="h4" component="h3" pb={2}>
        Protocol
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          <b>The service is provided free of charge, </b>
          although this could be reconsidered in the future if demand will be high.
          But considering the low price, demand, and amount of donations at the moment of writing this article, the service is ready to remain free for years.
        </Typography>
      </Box>
    </Box>
  );
}

export const Protocol = React.memo(ChapterProtocol);
