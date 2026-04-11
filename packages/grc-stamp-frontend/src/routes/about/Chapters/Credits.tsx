import { Typography, Box } from '@mui/material';
import React from 'react';

export function Credits() {
  return (
    <Box pb={2} id="credits">
      <Typography variant="h4" component="h2" pb={2}>
        Credits
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          credits
        </Typography>
      </Box>
    </Box>
  );
}
