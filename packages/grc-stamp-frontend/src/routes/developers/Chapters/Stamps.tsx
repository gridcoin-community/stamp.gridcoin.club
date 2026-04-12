 
 
 
import React from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Alert,
  AlertTitle,
} from '@mui/material';
import { NextMuiLink } from '@/components/NextMuiLink';
import { Endpoint } from '@/components/Endpoint/Endpoint';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';

export function Stamps() {
  return (
    <Box id="stamps" sx={{ pb: 4 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Stamps
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          A stamp is a SHA-256 hash that has been (or is about to be) embedded in a
          Gridcoin transaction via
          {' '}
          <code>OP_RETURN</code>
          . Once the transaction is confirmed, the stamp becomes a permanent,
          publicly verifiable proof that the hash existed at a specific block height.
        </Typography>
        <Alert severity="info" variant="outlined" sx={{ my: 2 }}>
          <AlertTitle>
            About the numeric <code>id</code>
          </AlertTitle>
          The numeric <code>id</code> returned in every stamp response is a local
          auto-increment key from this particular server&apos;s database. It is
          <strong> not</strong> stored on the Gridcoin blockchain, it is
          <strong> not</strong> portable between stamp server instances, and the same
          hash stamped through a different server will almost certainly have a
          different <code>id</code>. Treat it as an opaque handle for talking to
          <em> this </em>
          server only. The durable, universal identifier for any stamp is its
          SHA-256 <code>hash</code> — use
          {' '}
          <NextMuiLink href="#hashes" color="primary">
            GET /api/hashes/:hash
          </NextMuiLink>
          {' '}
          whenever you need to look a stamp up in a portable way.
        </Alert>

        <Typography variant="h6" component="h3" id="stamps-list" sx={{ pt: 2, pb: 1 }}>
          List stamps
        </Typography>
        <Endpoint method="GET" path="/api/stamps" title="Paginated list" />
        <Typography gutterBottom variant="body1" component="p">
          Returns a JSON:API collection. Supports all conventions described in the
          {' '}
          <NextMuiLink href="#conventions" color="primary">JSON:API Conventions</NextMuiLink>
          {' '}
          section.
        </Typography>
        <CodeBlock
          caption="Request"
          language="bash"
          code="curl -g 'https://stamp.gridcoin.club/api/stamps?page[size]=2&sort=-id'"
        />
        <CodeBlock
          caption="Response — 200 OK"
          language="json"
          code={`{
  "meta": { "count": 2379 },
  "data": [
    {
      "id": "2379",
      "type": "stamps",
      "attributes": {
        "protocol": "0.0.1",
        "type": "sha256",
        "hash": "c8a6a89efcea21b1c3b9181110053694cd8fc204ca37a03e5f304b533ee659a6",
        "block": 3940142,
        "tx": "56886c5134ace2589d8cd0d49a61c8b6f6ca9e7135636bf76956537a9602a222",
        "rawTransaction": "6a265ea1ed000001c8a6a89efcea21b1c3b9181110053694cd8fc204ca37a03e5f304b533ee659a6",
        "time": 1775877184,
        "createdAt": "2026-04-11T03:12:06.000Z",
        "updatedAt": "2026-04-11T03:13:59.000Z"
      },
      "links": { "self": "/stamps/2379" }
    },
    {
      "id": "2378",
      "type": "stamps",
      "attributes": {
        "protocol": "0.0.1",
        "type": "sha256",
        "hash": "d1aa7e3b2caf3e6b7b25d0e8f02d1190178e466f78894cda55126e1928ecf0ae",
        "block": 3939884,
        "tx": "f26a9b4c5ec18401fa607820c4edfc21553173129cfa8ba16d6dec101f7792c7",
        "rawTransaction": "6a265ea1ed000001d1aa7e3b2caf3e6b7b25d0e8f02d1190178e466f78894cda55126e1928ecf0ae",
        "time": 1775855712,
        "createdAt": "2026-04-10T21:09:32.000Z",
        "updatedAt": "2026-04-10T21:16:02.000Z"
      },
      "links": { "self": "/stamps/2378" }
    }
  ]
}`}
        />

        <Typography variant="h6" component="h3" id="stamps-get" sx={{ pt: 3, pb: 1 }}>
          Get a stamp by ID
        </Typography>
        <Endpoint method="GET" path="/api/stamps/:id" title="Single resource" />
        <Typography gutterBottom variant="body1" component="p">
          The
          {' '}
          <code>id</code>
          {' '}
          is the internal auto-incrementing identifier returned by the list endpoint
          or by
          {' '}
          <code>POST /api/stamps</code>
          . To look up by hash instead, use
          {' '}
          <NextMuiLink href="#hashes" color="primary">/api/hashes/:hash</NextMuiLink>
          .
        </Typography>
        <CodeBlock
          caption="Request"
          language="bash"
          code="curl https://stamp.gridcoin.club/api/stamps/3"
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
          A stamp that has not yet been mined into a block returns
          {' '}
          <code>null</code>
          {' '}
          for
          {' '}
          <code>block</code>
          ,
          {' '}
          <code>tx</code>
          ,
          {' '}
          <code>rawTransaction</code>
          , and
          {' '}
          <code>time</code>
          . Unknown ids return
          {' '}
          <code>404 Not Found</code>
          {' '}
          with the standard error envelope.
        </Typography>

        <Typography variant="h6" component="h3" id="stamps-create" sx={{ pt: 3, pb: 1 }}>
          Create a stamp
        </Typography>
        <Endpoint method="POST" path="/api/stamps" title="Create a new stamp" />
        <Typography gutterBottom variant="body1" component="p">
          Submit a SHA-256 hash to be queued for stamping. The server batches queued
          hashes and embeds up to two at a time in a single
          {' '}
          <code>OP_RETURN</code>
          {' '}
          transaction, which is broadcast to the Gridcoin network.
        </Typography>
        <Typography variant="subtitle2" component="h4" sx={{ pt: 1, pb: 0.5 }}>
          Request body
        </Typography>
        <List dense>
          <ListItem disableGutters>
            <ListItemText
              primary={<><code>data.attributes.hash</code> — required</>}
              secondary={<>Exactly 64 hex characters matching <code>/^[a-fA-F0-9]{'{64}'}$/</code> — lower- or upper-case both work. The SHA-256 digest of the document you want to stamp.</>}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={<><code>data.attributes.hashType</code> — optional</>}
              secondary={<>Only <code>&quot;sha256&quot;</code> is currently accepted. Defaults to <code>&quot;sha256&quot;</code>.</>}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={<><code>data.attributes.protocol</code> — optional</>}
              secondary={<>Stamping protocol version. Only <code>&quot;0.0.1&quot;</code> is currently accepted. Defaults to <code>&quot;0.0.1&quot;</code>.</>}
            />
          </ListItem>
        </List>
        <CodeBlock
          caption="Request"
          language="bash"
          code={`curl -X POST 'https://stamp.gridcoin.club/api/stamps' \\
  -H 'Content-Type: application/vnd.api+json' \\
  -d '{
    "data": {
      "type": "stamps",
      "attributes": {
        "hash": "5f334f14161952476adde3fbd843f93f647d47a0d7e30eb5d1635fb7569a2503"
      }
    }
  }'`}
        />
        <CodeBlock
          caption="Response — 200 OK (hash already stamped)"
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
          For a brand-new hash the response is the same shape with
          {' '}
          <code>block</code>
          ,
          {' '}
          <code>tx</code>
          ,
          {' '}
          <code>rawTransaction</code>
          , and
          {' '}
          <code>time</code>
          {' '}
          set to
          {' '}
          <code>null</code>
          {' '}
          until the scraper confirms the transaction on-chain.
        </Typography>
        <Typography variant="subtitle2" component="h4" sx={{ pt: 1, pb: 0.5 }}>
          Status codes
        </Typography>
        <List dense>
          <ListItem disableGutters>
            <ListItemText
              primary="201 Created"
              secondary="A new stamp was queued. The attributes for block / tx / rawTransaction / time are null until the transaction is mined."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="200 OK"
              secondary="The hash was already stamped. The existing record is returned instead of creating a duplicate."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="400 Bad Request"
              secondary="Validation failed — most commonly an incorrect hash length or an unsupported hashType."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="406 Not Acceptable"
              secondary="The service wallet is below the minimum balance and cannot broadcast new stamping transactions."
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
