/* eslint-disable max-len */
import { Typography, Box } from '@mui/material';
import React from 'react';

function ChapterProofOfExistence() {
  return (
    <Box pb={3}>
      <Typography variant="h4" component="h3" pb={2} id="proof-of-existence">
        Proof of Existence
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          Proof of Existence is a method of verifying and recording that specific data existed at a certain time.
          To establish proof, a timestamp and signature linked to the entity are needed to demonstrate its creation at a particular time.
          Blockchain technology provides a convenient solution for this purpose, as proof is stored on a public ledger that is transparent, unalterable, and permanent.
        </Typography>
        <Typography gutterBottom variant="body1" component="section">
          Common Use Cases:
          <ul>
            <li>
              <b>Proof of ownership.</b>
              <br />
              The owner of the data can confirm ownership without revealing the actual data.
            </li>
            <li>
              <b>Data timestamping.</b>
              <br />
              You can prove the existence of specific data at a particular time without relying on a central authority.
            </li>
            <li>
              <b>Data Integrity Checking.</b>
              <br />
              If there is even the slightest change in the document (even a single bit), it will result in a different file hash.
              By creating a stamp of your data and verifying it later, you can ensure that the data has not been altered.
            </li>
          </ul>
        </Typography>
      </Box>
    </Box>
  );
}

export const ProofOfExistence = React.memo(ChapterProofOfExistence);
