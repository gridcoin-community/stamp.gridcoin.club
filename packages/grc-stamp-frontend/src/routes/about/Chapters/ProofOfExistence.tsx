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
          The Proof of Existence is all about recording and proving that certain data existed at the given time.
          To maintain PoE the only timestamp and signature associated with the entity are required to prove in front of the authorized viewers that a particular entity was created at a particular time.
          Blockchain technology gets very handy for this purpose. As proof gets stored on the public ledger, it is public and can never be modified or removed.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Common usecases:
          <ul>
            <li>
              <b>Proof of ownership.</b>
              <br />
              The owner of the data can prove the ownership of the data without revealing actual data.
            </li>
            <li>
              <b>Data timestamping.</b>
              <br />
              You can prove that certain data existed and a given time without a need of a central authority.
            </li>
            <li>
              <b>Checking for data integrity.</b>
              <br />
              The slightest change in the document (even one bit is enough) will result in generating a completely different file hash.
              So if you create a stamp of your data and then re-check it later, you can be sure that data wasn&apos;t changed.
            </li>
          </ul>
        </Typography>
      </Box>
    </Box>
  );
}

export const ProofOfExistence = React.memo(ChapterProofOfExistence);
