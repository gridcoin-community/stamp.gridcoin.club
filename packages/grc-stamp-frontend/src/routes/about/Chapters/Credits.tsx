import { Typography, Box } from '@mui/material';
import React from 'react';

function ChapterCredits() {
  return (
    <Box pb={2}>
      <Typography variant="h4" component="h3" pb={2}>
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

export const Credits = React.memo(ChapterCredits);
