/* eslint-disable max-len */
import React from 'react';
import { Typography, Box } from '@mui/material';

export function Disclaimer() {
  return (
    <Box pb={4} id="disclaimer">
      <Typography variant="h4" component="h2" pb={2}>
        Disclaimer
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p" sx={{ color: 'text.secondary' }}>
          This API is provided as-is, without any warranty of any kind, express or
          implied. We make no guarantees about availability, correctness, durability,
          or fitness for a particular purpose. To the maximum extent permitted by
          applicable law, the operators of this service shall not be liable for any
          direct, indirect, incidental, consequential, or any other damages arising
          from the use — or inability to use — this API. By calling these endpoints
          you accept full responsibility for how you integrate and rely on them.
        </Typography>
      </Box>
    </Box>
  );
}
