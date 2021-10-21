import React from 'react';
import { Box, Typography } from '@mui/material';
import { StampIcon } from 'icons/StampIcon';

function InstructionsComponent() {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box mr={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <StampIcon />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography component="h1" variant="h4" mb={3}>
            Notarize documents in Gridcoin blockchain
          </Typography>
          <Typography variant="body1" gutterBottom>
            Timestamping of documents can allow a public verification of the issue history
            which is permanently recorded to the public blockchain.
            There is absolutely no method of potential malicious modification at a later stage.
          </Typography>
          <Typography variant="body1" gutterBottom>
            In order to notarize the document or check the proof of existence
            {' '}
            just drop the target file down below and follow the instructions.
          </Typography>
          <Typography variant="body1" gutterBottom>
            The service is provided free of charge.
          </Typography>
        </Box>
      </Box>
      <br />
    </>
  );
}

export const Instructions = React.memo(InstructionsComponent);
