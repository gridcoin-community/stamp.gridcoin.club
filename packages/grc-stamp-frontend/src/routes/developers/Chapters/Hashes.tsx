/* eslint-disable max-len */
import React from 'react';
import { Typography, Box } from '@mui/material';
import { Endpoint } from '@/components/Endpoint/Endpoint';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';

export function Hashes() {
  return (
    <Box pb={4} id="hashes">
      <Typography variant="h4" component="h2" pb={2}>
        Hashes
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          Look up a stamp by its SHA-256 hash instead of its internal id. If the same
          hash has been stamped more than once (for example, by different callers),
          the endpoint returns the earliest record — the one with the smallest time.
        </Typography>
        <Endpoint method="GET" path="/api/hashes/:hash" title="Lookup by hash" />
        <CodeBlock
          caption="Request"
          language="bash"
          code="curl https://stamp.gridcoin.club/api/hashes/5f334f14161952476adde3fbd843f93f647d47a0d7e30eb5d1635fb7569a2503"
        />
        <CodeBlock
          caption="Response — 200 OK"
          language="json"
          code={`{
  "data": {
    "id": "3",
    "type": "stamps",
    "attributes": {
      "protocol": "0.0.1",
      "type": "sha256",
      "hash": "5f334f14161952476adde3fbd843f93f647d47a0d7e30eb5d1635fb7569a2503",
      "block": 2394434,
      "tx": "a9a30f84d23a98b7d90c4581bbe94bbbfc40e05167656e2fe16c8deda5fa08ce",
      "rawTransaction": "6a265ea1ed0000015f334f14161952476adde3fbd843f93f647d47a0d7e30eb5d1635fb7569a2503",
      "time": 1634822384,
      "createdAt": "2021-10-21T13:18:45.000Z",
      "updatedAt": "2021-10-21T13:19:52.000Z"
    },
    "links": { "self": "/stamps/3" }
  }
}`}
        />
        <Typography gutterBottom variant="body1" component="p" sx={{ color: 'text.secondary' }}>
          Returns
          {' '}
          <code>404 Not Found</code>
          {' '}
          if the hash has never been stamped by this service. The lookup is
          case-insensitive — upper- and lower-case hex both resolve to the same
          record.
        </Typography>
      </Box>
    </Box>
  );
}
