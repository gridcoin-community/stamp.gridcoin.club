/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { NextMuiLink } from '@/components/NextMuiLink';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';

export function Overview() {
  return (
    <Box pb={4} id="overview">
      <Typography variant="h4" component="h2" pb={2}>
        Overview
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          The Gridcoin Blockchain Stamping API is a public, read-mostly HTTP service
          that lets you create SHA-256 stamps on the Gridcoin blockchain, look up
          existing stamps, and inspect the service wallet. Responses follow the
          {' '}
          <NextMuiLink
            href="https://jsonapi.org/"
            rel="noreferrer nofollow"
            target="_blank"
            color="primary"
          >
            JSON:API
          </NextMuiLink>
          {' '}
          specification.
        </Typography>
        <List dense sx={{ mb: 2 }}>
          <ListItem disableGutters>
            <ListItemText
              primary="Base URL"
              secondary="https://stamp.gridcoin.club/api"
              secondaryTypographyProps={{ sx: { fontFamily: 'monospace' } }}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="Content-Type"
              secondary="application/vnd.api+json"
              secondaryTypographyProps={{ sx: { fontFamily: 'monospace' } }}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="Authentication"
              secondary="None. All endpoints are public by design."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="CORS"
              secondary="Open to all origins. Safe to call directly from the browser."
            />
          </ListItem>
        </List>
        <Typography gutterBottom variant="body1" component="p">
          The fastest way to confirm the service is reachable is a
          {' '}
          <code>GET /api/status</code>
          {' '}
          call:
        </Typography>
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

        <Typography variant="h6" component="h3" pt={3} pb={1}>
          A note on curl and JSON:API brackets
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          JSON:API query parameters use literal square brackets — for example
          {' '}
          <code>page[size]=10</code>
          {' '}
          or
          {' '}
          <code>filter[block][gt]=0</code>
          . By default
          {' '}
          <code>curl</code>
          {' '}
          interprets
          {' '}
          <code>[…]</code>
          {' '}
          in a URL as a
          {' '}
          <em>URL globbing</em>
          {' '}
          range and fails with
          {' '}
          <code>bad range in URL position …</code>
          . Every example on this page uses the
          {' '}
          <code>-g</code>
          {' '}
          (also spelled
          {' '}
          <code>--globoff</code>
          ) flag to disable that behaviour. If you prefer, you can also URL-encode
          the brackets as
          {' '}
          <code>%5B</code>
          {' '}
          and
          {' '}
          <code>%5D</code>
          , or use the
          {' '}
          <code>-G --data-urlencode</code>
          {' '}
          form — whichever is the most convenient inside your tooling.
        </Typography>
      </Box>
    </Box>
  );
}
