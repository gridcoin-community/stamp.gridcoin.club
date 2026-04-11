/* eslint-disable max-len */
import React from 'react';
import { Typography, Box } from '@mui/material';

export function Disclaimer() {
  return (
    <Box pb={3} id="disclaimer">
      <Typography variant="h4" component="h2" pb={2}>
        Disclaimer
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          This service is provided as-is, without any warranty of any kind, express or implied.
          This includes the stamping web application, the public API, and the Gridcoin Stamp
          GitHub Action. We make no guarantees about availability, correctness, durability, or
          fitness for a particular purpose.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          To the maximum extent permitted by applicable law, the operators of this service shall
          not be liable for any direct, indirect, incidental, consequential, or any other damages
          arising from the use — or inability to use — any part of it. By using any component
          you accept full responsibility for how you integrate and rely on it.
        </Typography>
      </Box>
    </Box>
  );
}
