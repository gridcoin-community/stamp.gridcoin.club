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
import { Endpoint } from '@/components/Endpoint/Endpoint';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';

export function Events() {
  return (
    <Box pb={4} id="events">
      <Typography variant="h4" component="h2" pb={2}>
        Events (Server-Sent Events)
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          A long-lived
          {' '}
          <NextMuiLink
            href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events"
            rel="noreferrer nofollow"
            target="_blank"
            color="primary"
          >
            Server-Sent Events
          </NextMuiLink>
          {' '}
          stream that broadcasts blockchain activity in real time. Connect once and
          your client will receive a fresh event whenever the scraper advances a
          block, finds a stamp transaction, or the server publishes a batch of
          pending stamps.
        </Typography>
        <Endpoint method="GET" path="/api/events" title="SSE stream" />
        <CodeBlock
          caption="Subscribe with curl"
          language="bash"
          code="curl -N https://stamp.gridcoin.club/api/events"
        />
        <Typography gutterBottom variant="body1" component="p">
          In the browser, use
          {' '}
          <code>EventSource</code>
          :
        </Typography>
        <CodeBlock
          caption="Subscribe from JavaScript"
          language="javascript"
          code={`const es = new EventSource('https://stamp.gridcoin.club/api/events');

es.onmessage = (event) => {
  const payload = JSON.parse(event.data);
  switch (payload.type) {
    case 'processBlock':
      console.log('scraper advanced to block', payload.data.block);
      break;
    case 'transactionFound':
      console.log('stamp transaction found for hash', payload.data.hash);
      break;
    case 'stampSubmitted':
      console.log('stamp broadcast', payload.data.hash, 'tx', payload.data.tx);
      break;
  }
};

es.onerror = () => {
  // EventSource reconnects automatically; log for visibility.
  console.warn('SSE connection lost, reconnecting...');
};`}
        />
        <Typography variant="h6" component="h3" pt={2} pb={1}>
          Event types
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Every event is a JSON object with a
          {' '}
          <code>type</code>
          {' '}
          discriminator and a
          {' '}
          <code>data</code>
          {' '}
          payload. The server also emits SSE keep-alive comments every ~15 seconds to
          prevent idle proxies from dropping the connection; your client can ignore
          them.
        </Typography>
        <List dense>
          <ListItem disableGutters>
            <ListItemText
              primary={<code>processBlock</code>}
              secondary="The scraper has finished processing a block. Payload: { block: number }."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={<code>transactionFound</code>}
              secondary="The scraper found an OP_RETURN transaction matching the stamp prefix. Payload: { hash: string }."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={<code>stampSubmitted</code>}
              secondary="The server has broadcast a new stamping transaction. Payload: { hash: string, tx: string }."
            />
          </ListItem>
        </List>
        <CodeBlock
          caption="Example event — processBlock"
          language="json"
          code='{ "type": "processBlock", "data": { "block": 5918234 } }'
        />
        <CodeBlock
          caption="Example event — stampSubmitted"
          language="json"
          code={`{
  "type": "stampSubmitted",
  "data": {
    "hash": "87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7",
    "tx": "5f334f14161952476adde3fbd843f93f647d47a0d7e30eb5d1635fb7569a2503"
  }
}`}
        />
      </Box>
    </Box>
  );
}
