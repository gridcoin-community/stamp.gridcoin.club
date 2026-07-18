import { Typography, Box } from '@mui/material';
import React from 'react';
import { NextMuiLink } from '@/components/NextMuiLink';

export function OpenSource() {
  return (
    <Box id="open-source" sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Open source and licensing
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          The Service&apos;s code is published under the MIT licence
          at
          {' '}
          <NextMuiLink href="https://github.com/gridcoin-community/stamp.gridcoin.club" rel="external noopener" color="primary">github.com/gridcoin-community/stamp.gridcoin.club</NextMuiLink>
          . The MIT licence governs your rights in the source. These
          Terms govern your use of <i>this hosted instance</i> at
          {' '}
          <NextMuiLink href="https://stamp.gridcoin.club" color="primary">stamp.gridcoin.club</NextMuiLink>
          .
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          The on-chain protocol is public. Anyone can run their own
          stamp instance and write conformant payloads, and anyone
          can run a Gridcoin node and index existing ones, with no
          permission from the operator. The timestamp survives even
          if this site does not.
        </Typography>
      </Box>
    </Box>
  );
}
