 
 
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

const ACTION_REPO_URL = 'https://github.com/gridcat/gridcoin-stamp-action';
const DESCRIPTION = 'A GitHub Action that hashes every release artifact locally and timestamps the hashes on the Gridcoin blockchain, without any file leaving CI.';

interface Feature {
  title: string;
  body: string;
}

const features: Feature[] = [
  {
    title: 'Byte-stable source archives',
    body: 'GitHub\'s auto-generated "Source code" downloads are regenerated on every click and their hashes have drifted silently in the past. In January 2023, a server-side git upgrade broke checksum pinning across Homebrew, Bazel and Go modules. The action sidesteps that by fetching each archive once, re-uploading it under a dedicated -stamped name, and stamping the uploaded copy. Uploaded assets are immutable CDN blobs, so the bytes you attested to are the bytes everyone downloads later.',
  },
  {
    title: 'Reproducible commit proof',
    body: 'Every run emits a tiny .stamp.txt manifest containing the repository, tag, commit SHA, and tree SHA. Anyone with a clone can regenerate it line-for-line and recompute the hash with sha256sum. No archive download, no trusted third party, no long-term dependency on GitHub being nice.',
  },
  {
    title: 'Refuses to attest to a mutated tag',
    body: 'Git tags can be force-pushed. The action reads the manifest from the previous run, compares the pinned commit against whatever the tag currently resolves to, and aborts with a clear error on mismatch. You never end up with a release whose stamped artifacts disagree about which commit they represent.',
  },
  {
    title: 'Verification stays local',
    body: 'To verify a stamped release, the recipient drops the file onto stamp.gridcoin.club. The SHA-256 is computed client-side in the browser and only the 64-character hash is ever sent. Nothing about the file contents leaves the verifier\'s machine.',
  },
  {
    title: 'Idempotent reruns',
    body: 'Re-running the workflow on the same release reuses existing -stamped assets rather than re-downloading or overwriting them, picks up from any partial failure (e.g. zip uploaded but tar.gz missing), and rewrites the release body only if the table would actually change.',
  },
  {
    title: 'Anchored on a chain that rewards real science',
    body: 'Gridcoin rewards participants in BOINC volunteer computing: protein folding, pulsar searches, climate modelling, cancer research. Timestamps live on a ledger that exists to support actual research, not to burn electricity on empty hashes.',
  },
];

export function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Seo
        title={`${SITE_NAME} :: GitHub Action`}
        description={DESCRIPTION}
        path="/developers/github-action"
        ogType="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Gridcoin Blockchain Timestamp Action',
          description: DESCRIPTION,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'GitHub Actions runner',
          url: `${SITE_URL}/developers/github-action`,
          softwareHelp: ACTION_REPO_URL,
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
                Gridcoin Stamp — GitHub Action
              </Typography>
              <Typography gutterBottom variant="body1" component="p">
                Publish a release on GitHub and the action runs automatically: every
                asset gets a SHA-256 timestamped on the Gridcoin blockchain, and the
                release notes pick up a verification row per file.
              </Typography>

              <Box id="overview" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Overview
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    When a GitHub release is published, the action collects the
                    artifacts attached to it, hashes each one locally on the runner,
                    submits the hashes to
                    {' '}
                    <NextMuiLink href="/" color="primary">stamp.gridcoin.club</NextMuiLink>
                    , and writes a &ldquo;Blockchain Timestamps&rdquo; table into the
                    release body with a verification link per file. The file contents
                    never leave your CI environment. Only the 64-character hash does.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<GitHubIcon />}
                      endIcon={<OpenInNewIcon />}
                      component="a"
                      href={ACTION_REPO_URL}
                      target="_blank"
                      rel="noreferrer nofollow"
                    >
                      View on GitHub
                    </Button>
                  </Stack>
                </Box>
              </Box>

              <Box id="why" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Why timestamp a release?
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    A GitHub release is a mutable object. Tags can be force-pushed,
                    auto-generated source archives can drift byte-wise between
                    downloads, release notes can be rewritten, and the whole release
                    can be deleted by anyone with write access. None of that changes
                    the fact that at one specific moment you intended a particular
                    set of bytes to represent a given version. After the fact,
                    proving that intent in a way other people can independently check
                    is surprisingly hard.
                  </Typography>
                  <Typography gutterBottom variant="body1" component="p">
                    Timestamping each release asset against a public blockchain pins
                    a cryptographic fingerprint to an immutable ledger. Anyone
                    (downstream packagers, compliance auditors, a distant forensic
                    investigator) can later hash the file they have in hand and
                    confirm that those exact bytes existed under your release&apos;s
                    name on the day you published. It&apos;s the same idea that
                    notaries have been selling for centuries, minus the notary.
                  </Typography>
                  <Typography gutterBottom variant="body1" component="p">
                    The interesting question is how to timestamp in a way that
                    survives every edge case release tooling quietly walks into.
                    That is what this action is for.
                  </Typography>
                </Box>
              </Box>

              <Box id="highlights" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Design notes
                </Typography>
                <Box component="article">
                  {features.map((feature) => (
                    <Box key={feature.title} sx={{ pb: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ pb: 0.5 }}>
                        {feature.title}
                      </Typography>
                      <Typography gutterBottom variant="body1" component="p">
                        {feature.body}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box id="quick-start" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Drop-in workflow
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    Add a single workflow file to your repository. It fires whenever
                    you publish a release through the GitHub UI or via any release
                    automation that reaches the
                    {' '}
                    <code>release: published</code>
                    {' '}
                    event, including semantic-release, goreleaser, and manual clicks.
                  </Typography>
                  <CodeBlock
                    caption=".github/workflows/stamp.yml"
                    language="yaml"
                    code={`name: Stamp Release
on:
  release:
    types: [published]

jobs:
  stamp:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: gridcat/gridcoin-stamp-action@v1
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}`}
                  />
                  <Typography gutterBottom variant="body1" component="p">
                    The
                    {' '}
                    <code>contents: write</code>
                    {' '}
                    permission is required because the action uploads assets back to
                    the release and edits the release body. Everything else
                    (source-archive re-upload, manifest generation, idempotent
                    reruns) is on by default.
                  </Typography>
                </Box>
              </Box>

              <Box id="confirmation" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Wait for confirmation
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    By default the action submits the hashes and returns immediately.
                    The blockchain typically confirms within 2–5 minutes, and the
                    verification URLs start resolving some time after the workflow
                    completes. If you&apos;d rather have the workflow block until
                    every stamp is confirmed on-chain, flip
                    {' '}
                    <code>wait-for-confirmation</code>
                    {' '}
                    on:
                  </Typography>
                  <CodeBlock
                    caption="Wait for confirmation"
                    language="yaml"
                    code={`- uses: gridcat/gridcoin-stamp-action@v1
  with:
    github-token: \${{ secrets.GITHUB_TOKEN }}
    wait-for-confirmation: true
    poll-timeout: 600`}
                  />
                </Box>
              </Box>

              <Box id="verify" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Verifying a release later
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    The easy path: pull the
                    {' '}
                    <code>…-stamped.zip</code>
                    {' '}
                    or
                    {' '}
                    <code>…-stamped.tar.gz</code>
                    {' '}
                    asset from the release page and drop it onto
                    {' '}
                    <NextMuiLink href="/" color="primary">stamp.gridcoin.club</NextMuiLink>
                    . The hash is computed in the browser, looked up against the
                    blockchain, and rendered as a proof page. The file itself never
                    leaves the verifier&apos;s machine.
                  </Typography>
                  <Typography gutterBottom variant="body1" component="p">
                    The terminal path: compare the SHA-256 of any downloaded asset
                    against the corresponding row in the release body, or regenerate
                    the proof manifest from git state and confirm its hash matches
                    the row for
                    {' '}
                    <code>&lt;tag&gt;.stamp.txt</code>
                    . Both routes are covered step-by-step in the
                    {' '}
                    <NextMuiLink
                      href={`${ACTION_REPO_URL}#verifying-a-stamp`}
                      rel="noreferrer nofollow"
                      target="_blank"
                      color="primary"
                    >
                      repository README
                    </NextMuiLink>
                    .
                  </Typography>
                </Box>
              </Box>

              <Box id="learn-more" sx={{ pb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
                  Learn more
                </Typography>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    The full list of inputs, outputs, rerun semantics, tag-mutation
                    recovery, and CircleCI + semantic-release integration notes lives
                    in the
                    {' '}
                    <NextMuiLink
                      href={ACTION_REPO_URL}
                      rel="noreferrer nofollow"
                      target="_blank"
                      color="primary"
                    >
                      GitHub repository
                    </NextMuiLink>
                    . Issues, pull requests, and feedback are all welcome. The project
                    is young and the ecosystem it serves is small, so feedback
                    genuinely shapes where it goes next.
                  </Typography>
                  <Typography gutterBottom variant="body1" component="p">
                    If you build anything on top of it, or if the stamp table on one
                    of your releases caught someone&apos;s attention, I&apos;d love
                    to hear about it.
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
