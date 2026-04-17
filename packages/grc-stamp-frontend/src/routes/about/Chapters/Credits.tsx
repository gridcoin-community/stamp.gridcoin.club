import { Typography, Box } from '@mui/material';
import React from 'react';

export function Credits() {
  return (
    <Box id="credits" sx={{ pb: 2 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
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
