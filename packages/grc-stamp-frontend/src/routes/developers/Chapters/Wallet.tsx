 
 
import React from 'react';
import { Typography, Box } from '@mui/material';
import { Endpoint } from '@/components/Endpoint/Endpoint';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';

export function Wallet() {
  return (
    <Box id="wallet" sx={{ pb: 4 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Wallet
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          The service wallet is a dedicated Gridcoin address that holds the GRC used
          to pay transaction fees when stamping. These endpoints are useful for
          monitoring dashboards, funding alerts, and confirming that the scraper is
          keeping up with the blockchain.
        </Typography>

        <Typography variant="h6" component="h3" id="wallet-full" sx={{ pt: 2, pb: 1 }}>
          Wallet info
        </Typography>
        <Endpoint method="GET" path="/api/wallet" title="Address, balance, last block" />
        <CodeBlock
          caption="Request"
          language="bash"
          code="curl https://stamp.gridcoin.club/api/wallet"
        />
        <CodeBlock
          caption="Response — 200 OK"
          language="json"
          code={`{
  "data": {
    "id": "S16teVjxKNaptDLFnPwxkjQE3aiHRcgpr5",
    "type": "wallet",
    "attributes": {
      "address": "S16teVjxKNaptDLFnPwxkjQE3aiHRcgpr5",
      "balance": 3001.73952722,
      "block": 3940586,
      "minimumBalance": 0.01,
      "effectiveBalance": 3001.71952722
    },
    "links": { "self": "/wallet/" }
  }
}`}
        />
        <Typography gutterBottom variant="body1" component="p" sx={{ color: 'text.secondary' }}>
          The
          {' '}
          <code>id</code>
          {' '}
          on a wallet resource is the Gridcoin address itself (the same value as
          {' '}
          <code>attributes.address</code>
          ).
          {' '}
          <code>balance</code>
          {' '}
          is returned as a JSON number and
          {' '}
          <code>block</code>
          {' '}
          is the last Gridcoin block the scraper has processed.
        </Typography>
        <Typography gutterBottom variant="body1" component="p" sx={{ color: 'text.secondary' }}>
          <code>minimumBalance</code>
          {' '}
          is the threshold below which the service refuses new stamps with
          {' '}
          <code>406 Not Acceptable</code>
          .
          {' '}
          <code>effectiveBalance</code>
          {' '}
          is
          {' '}
          <code>balance</code>
          {' '}
          minus the GRC already promised to pending stamps that have not yet
          been mined; this is the value the server compares against
          {' '}
          <code>minimumBalance</code>
          {' '}
          when deciding whether to accept the next stamp. Frontends can branch
          their UI on
          {' '}
          <code>effectiveBalance &lt; minimumBalance</code>
          {' '}
          ahead of an attempted submission.
        </Typography>

        <Typography variant="h6" component="h3" id="wallet-balance" sx={{ pt: 3, pb: 1 }}>
          Balance only
        </Typography>
        <Endpoint method="GET" path="/api/wallet/balance" title="Lightweight balance check" />
        <CodeBlock
          caption="Request"
          language="bash"
          code="curl https://stamp.gridcoin.club/api/wallet/balance"
        />
        <CodeBlock
          caption="Response — 200 OK"
          language="json"
          code={`{
  "data": {
    "type": "balance",
    "attributes": {
      "balance": 3001.73952722
    },
    "links": { "self": "/wallet/balance" }
  }
}`}
        />
        <Typography gutterBottom variant="body1" component="p" sx={{ color: 'text.secondary' }}>
          The
          {' '}
          <code>balance</code>
          {' '}
          resource has no
          {' '}
          <code>id</code>
          : it represents the current balance value, not an addressable record.
        </Typography>
      </Box>
    </Box>
  );
}
