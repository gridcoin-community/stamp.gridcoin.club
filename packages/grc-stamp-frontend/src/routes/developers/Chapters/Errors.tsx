 
 
import React from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';

export function Errors() {
  return (
    <Box id="errors" sx={{ pb: 4 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Errors
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          All error responses follow the JSON:API error format: a top-level
          {' '}
          <code>errors</code>
          {' '}
          array containing one or more objects with a numeric
          {' '}
          <code>status</code>
          , a human-readable
          {' '}
          <code>title</code>
          , and an optional
          {' '}
          <code>detail</code>
          .
        </Typography>
        <CodeBlock
          caption="Example — 400 Bad Request"
          language="json"
          code={`{
  "errors": [
    {
      "status": 400,
      "title": "\\"hash\\" length must be at least 64 characters long"
    }
  ]
}`}
        />
        <Typography gutterBottom variant="body1" component="p">
          You can reliably trigger this shape by posting an invalid hash:
        </Typography>
        <CodeBlock
          caption="Reproduce the 400"
          language="bash"
          code={`curl -X POST 'https://stamp.gridcoin.club/api/stamps' \\
  -H 'Content-Type: application/vnd.api+json' \\
  -d '{"data":{"type":"stamps","attributes":{"hash":"not-a-hash"}}}'`}
        />
        <Typography variant="h6" component="h3" sx={{ pt: 2, pb: 1 }}>
          Common status codes
        </Typography>
        <List dense>
          <ListItem disableGutters>
            <ListItemText
              primary="400 Bad Request"
              secondary="Request body or query string failed validation (wrong hash length, unsupported hashType, malformed JSON:API envelope)."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="404 Not Found"
              secondary="No stamp with the requested id or hash."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="406 Not Acceptable"
              secondary="The service wallet does not hold enough GRC to create a new stamp. Try again later."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="500 Internal Server Error"
              secondary="Database, Redis, or Gridcoin RPC failure. Usually transient. Retry after a short delay."
            />
          </ListItem>
        </List>
        <Typography gutterBottom variant="body1" component="p" sx={{ color: 'text.secondary', pt: 2 }}>
          About the 406: the service wallet is currently shared across every caller
          of this public instance, and the operator tops it up as needed. If you
          hit a 406 and don&apos;t want to wait, you can keep the queue moving by
          sending a small amount of GRC to the wallet address returned by
          {' '}
          <code>GET /api/wallet</code>
          . Any GRC you contribute funds stamps for everyone, including you. There
          is no per-sender accounting.
        </Typography>
      </Box>
    </Box>
  );
}
