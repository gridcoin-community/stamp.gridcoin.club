/* eslint-disable max-len */
import { Typography, Box } from '@mui/material';
import React from 'react';

function ChapterCosts() {
  return (
    <Box pb={3}>
      <Typography variant="h4" component="h3" pb={2}>
        Costs
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          At the moment of writing this article, the cost of the stamp transaction is relatively low.
          It consists of the amount to burned plus transaction fees.
          The amount to be burn is
          {' '}
          <b>0.00000001</b>
          {' '}
          grc, plus a fee (may vary, it depends on the transaction size and network load) is approximately
          {' '}
          <b>0.001</b>
          {' '}
          grc. So the average price is about
          {' '}
          <b>0.002</b>
          {' '}
          grc per proof.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>The service is provided free of charge, </b>
          although this could be reconsidered in the future if demand will be high.
          But considering the low price, demand, and amount of donations at the moment of writing this article, the service is ready to remain free for years.
        </Typography>
      </Box>
    </Box>
  );
}

export const Costs = React.memo(ChapterCosts);
