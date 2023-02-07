/* eslint-disable max-len */
import { Typography, Box } from '@mui/material';
import React from 'react';

function ChapterCosts() {
  return (
    <Box pb={3} id="costs">
      <Typography variant="h4" component="h3" pb={2}>
        Costs
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          As of the time of writing, the cost of a stamp transaction is low, consisting of a small burned amount
          (
          <b>0.00000001</b>
          {' '}
          grc or one
          {' '}
          <b>Halford</b>
          ) and a transaction fee (approximately
          {' '}
          <b>0.05 grc</b>
          ). The average cost is around
          {' '}
          <b>0.06</b>
          {' '}
          grc per proof.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>The service is currently offered for free</b>
          , but this may change in the future if demand is high.
          Currently, the low cost and level of donations suggest that the service will remain free for the foreseeable future.
        </Typography>
      </Box>
    </Box>
  );
}

export const Costs = React.memo(ChapterCosts);
