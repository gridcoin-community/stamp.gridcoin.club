 
import { Typography, Box } from '@mui/material';
import React from 'react';

export function Costs() {
  return (
    <Box id="costs" sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Costs
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          A stamp transaction is cheap. It consists of a small burned amount
          (
          <b>0.00000001</b>
          {' '}
          GRC, or one
          {' '}
          <b>Halford</b>
          ) and a transaction fee of about
          {' '}
          <b>0.05 GRC</b>
          . The average cost works out to around
          {' '}
          <b>0.06 GRC</b>
          {' '}
          per proof.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>The service is free</b>
          , though that may change if demand grows. The low per-stamp cost and
          ongoing donations cover the running expenses, so it should stay free
          for a while yet.
        </Typography>
      </Box>
    </Box>
  );
}
