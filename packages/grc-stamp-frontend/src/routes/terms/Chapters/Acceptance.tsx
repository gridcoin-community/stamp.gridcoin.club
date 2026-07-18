import { Typography, Box } from '@mui/material';
import React from 'react';
import { NextMuiLink } from '@/components/NextMuiLink';

export function Acceptance() {
  return (
    <Box id="acceptance" sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Read this first
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          These Terms cover your use of stamp.gridcoin.club (the
          {' '}
          <b>Service</b>
          {' '}
          from here on). The Service is free, open-source software
          run as a non-commercial public good by
          {' '}
          <NextMuiLink href="https://github.com/gridcat" rel="external noopener" color="primary">@gridcat</NextMuiLink>
          {' '}
          and friends. Source under MIT at
          {' '}
          <NextMuiLink href="https://github.com/gridcoin-community/stamp.gridcoin.club" rel="external noopener" color="primary">github.com/gridcoin-community/stamp.gridcoin.club</NextMuiLink>
          .
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          By using the Service in any way (web, API, the GitHub
          Action, or anything we ship under the same name) you agree
          to these Terms. If you do not agree, do not use the
          Service. Where the law requires capital letters or specific
          phrasing for enforceability we have used them; everywhere
          else we have tried to keep the prose plain.
        </Typography>
      </Box>
    </Box>
  );
}
