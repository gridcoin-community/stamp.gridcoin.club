/* eslint-disable max-len */
import { Typography, Box } from '@mui/material';
import React from 'react';

function ChapterProofOfExistence() {
  return (
    <Box pb={3} id="proof-of-existence">
      <Typography variant="h4" component="h3" pb={2}>
        Proof of Existence
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          The Proof of Existence is all about recording and proving that a certain data existed at the given time.
          To maintaint PoE the only timestamp and signature associated with the entity are required to prove in front of the autorrized viewers that a particular entity was created at particular time.
          The blockchain technology gets very handy for this purpose. As proof gets stored on the publich ledger, it is public and can never be modified or removed.
        </Typography>
        {/* <Typography gutterBottom variant="body1" component="p">
          Who needs the Proof of Existence as a service?
        </Typography> */}
      </Box>
    </Box>
  );
}

export const ProofOfExistence = React.memo(ChapterProofOfExistence);
