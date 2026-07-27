import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Header } from '@/components/Header/Header';
import { Seo, SITE_NAME, SITE_URL } from '@/components/Seo';
import { Footer } from '@/components/Footer/Footer';
import { GradientLine } from '@/components/GradientLine';
import { PageWrapper } from '@/components/PageWrapper';
import { ScrollTopFab } from '@/components/ScrollTopFab/ScrollTopFab';
import { NextMuiLink } from '@/components/NextMuiLink';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';
import { Contents } from './Contents';

const NPM_URL = 'https://www.npmjs.com/package/grc-stamp-mcp';
const REPO_URL = 'https://github.com/gridcoin-community/stamp.gridcoin.club/tree/master/packages/grc-stamp-mcp';
const HOSTED_URL = 'https://stamp.gridcoin.club/mcp';
const DESCRIPTION = 'An MCP server that lets AI agents timestamp documents on the Gridcoin blockchain. The file is hashed locally; only the SHA-256 leaves the machine.';

interface Tool {
  name: string;
  body: string;
}

const tools: Tool[] = [
  {
    name: 'stamp_document',
    body: 'Hash a document and anchor it on-chain. Give it a precomputed sha256, some text, or (running locally) the path to a file. It returns a public proof-page URL right away; the downloadable certificate follows once the stamp confirms.',
  },
  {
    name: 'check_stamp',
    body: 'Look a stamp up by hash or id. Once it is confirmed on-chain the tool hands back the block, transaction id, UTC timestamp, the proof page, the PDF certificate, and an explorer link.',
  },
  {
    name: 'get_wallet_status',
    body: 'Report whether the service is funded and can accept new stamps. Handy for an agent to check before it tries to stamp anything.',
  },
];

export function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Seo
        title={`${SITE_NAME} :: MCP Server for AI agents`}
        description={DESCRIPTION}
        path="/developers/mcp"
        ogType="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Gridcoin Stamp MCP Server',
          description: DESCRIPTION,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any (Node.js 22+)',
          url: `${SITE_URL}/developers/mcp`,
          softwareHelp: REPO_URL,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          author: { '@type': 'Person', name: '@gridcat' },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
          },
        }}
      />
      <PageWrapper>
        <Header />
        <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
          <GradientLine />
          <Grid container spacing={3}>
            <Grid
              size={{ sm: 3, xs: 12 }}
              sx={{ display: isMobile ? 'none' : 'flex' }}
            >
              <Contents />
            </Grid>
            <Grid size={{ sm: 9, xs: 12 }}>
              <Typography component="h1" variant="h4" sx={{ pb: 2 }}>
                Gridcoin Stamp: MCP Server
              </Typography>
              <Typography gutterBottom variant="body1" component="p">
                Give an AI agent the ability to timestamp a document on the Gridcoin
                blockchain. The agent hashes the file, the hash is anchored on-chain,
                and the file itself never moves. It talks the
                {' '}
                <NextMuiLink
                  href="https://modelcontextprotocol.io"
                  rel="noreferrer nofollow"
                  target="_blank"
                  color="primary"
                >
                  Model Context Protocol
                </NextMuiLink>
                , so anything that speaks MCP can use it.
              </Typography>

              <Box id="overview" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Overview
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    The server is a thin wrapper over the same public API that powers
                    {' '}
                    <NextMuiLink href="/" color="primary">stamp.gridcoin.club</NextMuiLink>
                    . It exposes three tools an agent can call: one to stamp a document,
                    one to check a stamp and fetch its proof, and one to see whether the
                    service is funded. No account, no API key, no payment. A SHA-256 is
                    computed on your machine and only the 64-character hash is ever sent.
                  </Typography>
                  <Typography gutterBottom variant="body1" component="p">
                    Two ways to run it: as a local process your agent launches over
                    stdio, or as a hosted endpoint your agent connects to over HTTP.
                    Both expose the same tools.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<GitHubIcon />}
                      endIcon={<OpenInNewIcon />}
                      component="a"
                      href={REPO_URL}
                      target="_blank"
                      rel="noreferrer nofollow"
                    >
                      Source
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<OpenInNewIcon />}
                      component="a"
                      href={NPM_URL}
                      target="_blank"
                      rel="noreferrer nofollow"
                    >
                      npm
                    </Button>
                  </Stack>
                </Box>
              </Box>

              <Box id="tools" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Tools
                </Typography>
                <Box component="article">
                  {tools.map((tool) => (
                    <Box key={tool.name} sx={{ pb: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ pb: 0.5 }}>
                        <code>{tool.name}</code>
                      </Typography>
                      <Typography gutterBottom variant="body1" component="p">
                        {tool.body}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box id="local" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Local setup
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    Most desktop agents (Claude Desktop, Cursor, Windsurf, VS Code, Zed)
                    launch MCP servers locally. Add one entry to your client&apos;s MCP
                    config and it runs on demand with
                    {' '}
                    <code>npx</code>
                    , no global install:
                  </Typography>
                  <CodeBlock
                    caption="mcp config"
                    language="json"
                    code={`{
  "mcpServers": {
    "gridcoin-stamp": {
      "command": "npx",
      "args": ["-y", "grc-stamp-mcp"]
    }
  }
}`}
                  />
                  <Typography gutterBottom variant="body1" component="p">
                    Running locally, the server can also hash a file straight off your
                    disk: point
                    {' '}
                    <code>stamp_document</code>
                    {' '}
                    at an absolute path and it reads and hashes the file on your machine,
                    sending only the digest. To stamp against the test network instead,
                    add
                    {' '}
                    <code>{'"env": { "NETWORK": "testnet" }'}</code>
                    .
                  </Typography>
                </Box>
              </Box>

              <Box id="hosted" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Hosted endpoint
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    Agents that connect to remote servers rather than launching them
                    (ChatGPT, for one) can use the hosted endpoint over HTTP. Point the
                    client at the URL:
                  </Typography>
                  <CodeBlock
                    caption="remote mcp config"
                    language="json"
                    code={`{
  "mcpServers": {
    "gridcoin-stamp": {
      "url": "${HOSTED_URL}"
    }
  }
}`}
                  />
                  <Typography gutterBottom variant="body1" component="p">
                    The hosted server cannot see your disk, so it accepts only a
                    precomputed
                    {' '}
                    <code>sha256</code>
                    {' '}
                    or inline
                    {' '}
                    <code>text</code>
                    ; the local-file path is a local-only convenience. Everything else
                    behaves the same.
                  </Typography>
                </Box>
              </Box>

              <Box id="privacy" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Privacy and cost
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    The service is free. Stamping burns a trivial amount of GRC from a
                    shared service wallet, not from you, which is deliberate: the point
                    is to put the Gridcoin chain to work notarizing things. To keep that
                    subsidy sane the hosted endpoint caps how many stamps it accepts per
                    minute and pauses if the wallet ever runs low. Reads
                    (checking a stamp, checking wallet status) are never limited.
                  </Typography>
                  <Typography gutterBottom variant="body1" component="p">
                    Privacy is the whole design. Your document is hashed where it lives,
                    on your machine or in your CI, and only the SHA-256 travels. There is
                    nothing to upload and nothing on-chain but a 64-character fingerprint.
                  </Typography>
                </Box>
              </Box>

              <Box id="proof" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Proof and certificates
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    Every stamp gets a public proof page at
                    {' '}
                    <code>/proof/&lt;hash&gt;</code>
                    , and once it is confirmed on-chain a downloadable PDF certificate at
                    {' '}
                    <code>/proof/&lt;hash&gt;/certificate.pdf</code>
                    . The certificate carries the hash, the block and transaction, the
                    UTC timestamp, and a QR code back to the proof page. The tools return
                    both URLs, so an agent can hand a human something to open and keep,
                    not just a transaction id.
                  </Typography>
                  <Typography gutterBottom variant="body1" component="p">
                    The certificate appears a few minutes after stamping, when the
                    transaction is mined. Until then
                    {' '}
                    <code>check_stamp</code>
                    {' '}
                    reports the stamp as pending and returns the proof page only.
                  </Typography>
                </Box>
              </Box>

              <Box id="learn-more" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Learn more
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    Full configuration, the exact tool schemas, and how to run the server
                    yourself live in the
                    {' '}
                    <NextMuiLink
                      href={REPO_URL}
                      rel="noreferrer nofollow"
                      target="_blank"
                      color="primary"
                    >
                      package README
                    </NextMuiLink>
                    . If you wire it into something, I&apos;d genuinely like to hear what
                    you built.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </PageWrapper>
      <ScrollTopFab />
    </>
  );
}
