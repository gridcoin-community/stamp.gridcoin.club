import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { SvgIconComponent } from '@mui/icons-material';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { Header } from '@/components/Header/Header';
import { Seo, SITE_NAME } from '@/components/Seo';
import { Footer } from '@/components/Footer/Footer';
import { GradientLine } from '@/components/GradientLine';
import { PageWrapper } from '@/components/PageWrapper';
import { ScrollTopFab } from '@/components/ScrollTopFab/ScrollTopFab';
import { NextMuiLink } from '@/components/NextMuiLink';
import { IS_TESTNET } from '@/lib/network';
import { plausibleClass } from '@/lib/track';
import { Contents } from './Contents';
import { versus } from './versus';

// Competitor facts were checked against each service's own site and docs.
// Bump LAST_CHECKED whenever they are re-verified. Competitors are named in
// plain text on purpose: this page never links out to them.
const LAST_CHECKED = 'November 2026';
const DESCRIPTION = 'Gridcoin Stamp compared with OpenTimestamps, OriginStamp, FreeTSA and Proof of Existence: price, anchor, speed, what you have to keep, and how to verify.';

const SERVICES = ['Gridcoin Stamp', 'OpenTimestamps', 'OriginStamp', 'FreeTSA', 'Proof of Existence'];
const MARK = IS_TESTNET ? '/ic-favicon-testnet.svg' : '/ic-favicon-mainnet.svg';

// good = check mark, meh = muted dash, null = plain text (no verdict)
type Tone = 'good' | 'meh' | null;

interface Row {
  label: string;
  icon: SvgIconComponent;
  values: string[];
  tones?: Tone[];
  // per-cell chain marks: files in /public/chains, or 'key' for a signing key
  marks?: Mark[][];
}

type Mark = 'gridcoin' | 'bitcoin' | 'ethereum' | 'key';

const rows: Row[] = [
  {
    label: 'Price',
    icon: PaymentsOutlinedIcon,
    tones: ['good', 'good', 'meh', 'good', 'meh'],
    values: ['Free, no account', 'Free, no account', 'Commercial, price on request', 'Free', 'Paid per document, in bitcoin'],
  },
  {
    label: 'Anchored in',
    icon: LinkOutlinedIcon,
    marks: [['gridcoin'], ['bitcoin'], ['bitcoin', 'ethereum'], ['key'], ['bitcoin']],
    values: ['Gridcoin blockchain', 'Bitcoin', 'Bitcoin and Ethereum', 'One authority\'s signing key (RFC 3161)', 'Bitcoin'],
  },
  {
    label: 'Sent to the service',
    icon: LockOutlinedIcon,
    tones: ['good', 'good', 'good', 'good', 'good'],
    values: ['Only the SHA-256 hash', 'Only the hash', 'Only the hash', 'Only the hash', 'Only the hash'],
  },
  {
    label: 'Time until final',
    icon: TimerOutlinedIcon,
    tones: ['good', 'meh', 'meh', 'good', 'meh'],
    values: ['Usually a few minutes', 'A few hours', 'Up to 24 hours', 'Instant', 'After the payment confirms'],
  },
  {
    label: 'Keep besides the file',
    icon: Inventory2OutlinedIcon,
    tones: ['good', 'meh', 'meh', 'meh', 'good'],
    values: ['Nothing', 'The .ots proof file', 'The certificate or raw proof', 'The .tsr token and the authority\'s certificates', 'Nothing'],
  },
  {
    label: 'Check without the service',
    icon: VerifiedOutlinedIcon,
    tones: ['good', 'good', 'good', 'good', 'good'],
    values: ['Any Gridcoin block explorer', 'A Bitcoin node', 'Bitcoin or Ethereum explorer and the Merkle path', 'OpenSSL and the saved certificates', 'Any Bitcoin block explorer'],
  },
  {
    label: 'Developer tools',
    icon: CodeOutlinedIcon,
    values: ['REST API, GitHub Action, MCP server', 'CLI and libraries', 'REST API with key', 'HTTP with OpenSSL or curl', 'Small REST API'],
  },
];

const H2 = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
    {children}
  </Typography>
);

function ToneIcon({ tone }: { tone: Tone }) {
  if (tone === 'good') {
    return <CheckCircleOutlineIcon fontSize="small" color="success" sx={{ mr: 1, flexShrink: 0 }} />;
  }
  if (tone === 'meh') {
    return <RemoveCircleOutlineIcon fontSize="small" sx={{ mr: 1, flexShrink: 0, color: 'text.disabled' }} />;
  }
  return null;
}

function Marks({ marks }: { marks?: Mark[] }) {
  if (!marks?.length) return null;
  return (
    <Box sx={{ display: 'flex', gap: 0.5, mr: 1, flexShrink: 0 }}>
      {marks.map((m) => (m === 'key' ? (
        <VpnKeyOutlinedIcon key={m} fontSize="small" sx={{ color: 'text.secondary' }} />
      ) : (
        <Box key={m} component="img" src={`/chains/${m}.svg`} alt="" sx={{ width: 20, height: 20 }} />
      )))}
    </Box>
  );
}

export function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const ours = alpha(theme.palette.primary.main, 0.1);
  const sticky = {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    bgcolor: 'background.paper',
  } as const;

  return (
    <>
      <Seo
        title={`Timestamping services compared :: ${SITE_NAME}`}
        description={DESCRIPTION}
        path="/compare"
        ogType="article"
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
                Document timestamping services compared
              </Typography>

              <Box id="summary" sx={{ pb: 4 }}>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    Gridcoin Stamp is a free blockchain timestamping service. Your browser
                    hashes the file, the hash goes into a Gridcoin transaction, and the proof
                    is final in a few minutes. You only need to keep the original
                    file. It has run continuously for over five years.
                  </Typography>
                  <Typography gutterBottom variant="body1" component="p">
                    OpenTimestamps is the free choice for Bitcoin anchoring if you can wait
                    a few hours and keep a proof file. OriginStamp suits businesses that want
                    a paid, supported product. FreeTSA is the free choice when a workflow
                    requires the RFC 3161 format. Proof of Existence anchors to Bitcoin for
                    a per-document fee.
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ color: 'text.secondary' }}>
                    Last checked:
                    {' '}
                    {LAST_CHECKED}
                    .
                  </Typography>
                </Box>
              </Box>

              <Box id="table" sx={{ pb: 4 }}>
                <H2>Side by side</H2>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small" aria-label="Timestamping services compared">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={sticky} />
                        {SERVICES.map((name, i) => (
                          <TableCell
                            key={name}
                            component="th"
                            scope="col"
                            sx={{
                              fontWeight: 700,
                              minWidth: 140,
                              ...(i === 0 && { bgcolor: ours, color: 'primary.main' }),
                            }}
                          >
                            {i === 0 ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box component="img" src={MARK} alt="" sx={{ width: 22, height: 22 }} />
                                {name}
                              </Box>
                            ) : name}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.label}>
                          <TableCell component="th" scope="row" sx={{ ...sticky, fontWeight: 700, minWidth: 150 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <row.icon fontSize="small" color="primary" />
                              {row.label}
                            </Box>
                          </TableCell>
                          {row.values.map((value, i) => (
                            <TableCell key={SERVICES[i]} sx={i === 0 ? { bgcolor: ours } : undefined}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ToneIcon tone={row.tones?.[i] ?? null} />
                                <Marks marks={row.marks?.[i]} />
                                {value}
                              </Box>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {versus.map((v) => (
                <Box key={v.id} id={v.id} sx={{ pb: 4 }}>
                  <H2>{`Gridcoin Stamp vs ${v.name}`}</H2>
                  <Grid container spacing={2} component="article">
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
                          <ThumbUpOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          <Typography variant="h6" component="h3">
                            {`Where ${v.name} is stronger`}
                          </Typography>
                        </Box>
                        <Typography variant="body1" component="p">
                          {v.theirs}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2.5, height: '100%', borderColor: 'primary.main', bgcolor: ours,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
                          <Box component="img" src={MARK} alt="" sx={{ width: 20, height: 20 }} />
                          <Typography variant="h6" component="h3">
                            Where Gridcoin Stamp is stronger
                          </Typography>
                        </Box>
                        <Typography variant="body1" component="p">
                          {v.ours}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Box id="pick-something-else" sx={{ pb: 4 }}>
                <H2>When to pick something else</H2>
                <Box component="article">
                  <Typography gutterBottom variant="body1" component="p">
                    Gridcoin is a proof-of-stake chain that has run since 2014, longer than
                    Ethereum, but it is much smaller than Bitcoin.
                    If you want the proof to rest on the largest proof-of-work chain, use
                    OpenTimestamps. If a process or a tool specifically asks for an RFC 3161
                    token, use a timestamp authority such as FreeTSA. If you need a signed contract
                    and someone to call when things break, a commercial provider fits better.
                  </Typography>
                  <Typography gutterBottom variant="body1" component="p">
                    For everything else (manuscripts, artwork, research data, contracts,
                    software releases) Gridcoin Stamp gives a public, permanent proof in
                    minutes at no cost.
                    {' '}
                    <NextMuiLink href="/" color="primary" className={plausibleClass('CTA Click', { cta: 'Compare Stamp' })}>Stamp a file</NextMuiLink>
                    , read
                    {' '}
                    <NextMuiLink href="/about#verify-a-stamp" color="primary" className={plausibleClass('CTA Click', { cta: 'Compare Verify' })}>how to verify a stamp</NextMuiLink>
                    , or automate it with the
                    {' '}
                    <NextMuiLink href="/developers" color="primary" className={plausibleClass('CTA Click', { cta: 'Compare API' })}>API</NextMuiLink>
                    , the
                    {' '}
                    <NextMuiLink href="/developers/github-action" color="primary" className={plausibleClass('CTA Click', { cta: 'Compare GitHub Action' })}>GitHub Action</NextMuiLink>
                    {' '}
                    or the
                    {' '}
                    <NextMuiLink href="/developers/mcp" color="primary" className={plausibleClass('CTA Click', { cta: 'Compare MCP' })}>MCP server</NextMuiLink>
                    .
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
