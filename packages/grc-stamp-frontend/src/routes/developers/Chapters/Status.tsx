 
import React from 'react';
import { Typography, Box } from '@mui/material';
import { Endpoint } from '@/components/Endpoint/Endpoint';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';

export function Status() {
  return (
    <Box id="status" sx={{ pb: 4 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Status
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          Returns the service name, version, and whether the stamping service is
          currently in maintenance mode. A cheap call. Use it for health checks.
        </Typography>
        <Endpoint method="GET" path="/api/status" title="Service health" />
        <CodeBlock
          caption="Request"
          language="bash"
          code="curl https://stamp.gridcoin.club/api/status"
        />
        <CodeBlock
          caption="Response — 200 OK"
          language="json"
          code={`{
  "data": {
    "type": "status",
    "attributes": {
      "name": "grc-stamp",
      "version": "1.2.1",
      "maintenance": false
    }
  }
}`}
        />
        <Typography gutterBottom variant="body1" component="p" sx={{ color: 'text.secondary' }}>
          The
          {' '}
          <code>status</code>
          {' '}
          resource has no
          {' '}
          <code>id</code>
          : it represents the service as a whole.
        </Typography>
        <Typography gutterBottom variant="body1" component="p" sx={{ color: 'text.secondary' }}>
          When
          {' '}
          <code>maintenance</code>
          {' '}
          is
          {' '}
          <code>true</code>
          , new stamps cannot be created; read endpoints remain available.
        </Typography>
      </Box>
    </Box>
  );
}
