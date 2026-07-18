import React from 'react';
import { Box, Typography } from '@mui/material';
import { NextMuiLink } from '@/components/NextMuiLink';

export function HowItWorks() {
  return (
    <Box
      component="section"
      sx={(theme) => ({
        pt: 4,
        pb: 8,
        width: '100%',
        maxWidth: theme.spacing(130),
        mx: 'auto',
      })}
    >
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, pb: 1 }}>
        How it works
      </Typography>
      <Box component="ol" sx={{ pl: 3, m: 0, mb: 2 }}>
        <Typography component="li" variant="body1" gutterBottom>
          Drop a file above. Your browser computes its SHA-256 hash locally, so
          the document itself never leaves your device.
        </Typography>
        <Typography component="li" variant="body1" gutterBottom>
          The hash is written to the Gridcoin blockchain and timestamped. Once it
          is in a block, it stays there for good.
        </Typography>
        <Typography component="li" variant="body1" gutterBottom>
          You get a permanent proof URL you can share. It shows the hash and the
          time it was recorded.
        </Typography>
      </Box>

      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, pt: 3, pb: 1 }}>
        Questions
      </Typography>

      <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600, pt: 2, pb: 0.5 }}>
        Does my file get uploaded?
      </Typography>
      <Typography gutterBottom variant="body1" component="p">
        No. Only the SHA-256 hash is sent. The file stays in your browser, so we
        never see its contents, its name, or its size.
      </Typography>

      <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600, pt: 2, pb: 0.5 }}>
        What happens if this site disappears?
      </Typography>
      <Typography gutterBottom variant="body1" component="p">
        Your proof lives on the Gridcoin blockchain, not on our servers. Anyone
        can check a hash against the chain independently, so the timestamp
        survives even if stamp.gridcoin.club does not.
      </Typography>

      <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600, pt: 2, pb: 0.5 }}>
        How can I check this myself?
      </Typography>
      <Typography gutterBottom variant="body1" component="p">
        Re-hash your file and look the stamp up on a block explorer. The hash
        sits inside the transaction and the block&apos;s time is the proof.
        {' '}
        <NextMuiLink href="/about#verify-a-stamp">Step-by-step guide</NextMuiLink>
        .
      </Typography>
    </Box>
  );
}
