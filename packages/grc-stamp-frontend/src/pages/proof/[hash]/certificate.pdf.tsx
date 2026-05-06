import React from 'react';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import sharp from 'sharp';
import QRCode from 'qrcode';
import { renderToBuffer } from '@react-pdf/renderer';
import type { GetServerSideProps } from 'next';
import type { ServerResponse } from 'node:http';
import { StampRepository } from '@/repositories/StampsRepository';
import { Certificate } from '@/components/Certificate/Certificate';
import { txUrl } from '@/lib/explorerLinks';
import { SITE_NAME, SITE_URL } from '@/components/Seo';
import { identiconPngDataUrl } from '@/lib/serverImage';
import { CACHE_CONTROL_DAY } from '@/lib/httpCache';
import { writeError, writeServerError } from '@/lib/ssrError';
import { IS_TESTNET } from '@/lib/network';

// Bumped when the certificate template changes shape so that on-disk caches
// from the prior template are not served for new requests. Old files become
// orphans and can be reaped manually.
//   v1 → v2: per-network logo file + testnet header badge
const CACHE_TEMPLATE_VERSION = 'v2';

const CACHE_DIR = process.env.PDF_CACHE_DIR
  || path.join(process.cwd(), '.cache/pdf');

// Per-network logo. Mainnet uses the purple variant, testnet the orange
// one — same artwork, gradient stops and wordmark fill swapped for each
// theme so the certificate header matches the in-app logo per network.
const LOGO_PATH = path.join(
  process.cwd(),
  `public/ic-logo-desktop-${IS_TESTNET ? 'testnet' : 'mainnet'}.svg`,
);

const stampRepository = new StampRepository();

function deriveHost(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).host;
  } catch {
    return undefined;
  }
}

const SITE_HOST = deriveHost(SITE_URL) ?? 'localhost';
const PROTOCOL_DOC_URL = `${SITE_URL}/about#protocol-overview`;

let logoPromise: Promise<string | null> | null = null;

async function loadLogo(): Promise<string | null> {
  try {
    const svg = await fs.readFile(LOGO_PATH);
    const png = await sharp(svg)
      .resize({ width: 600, fit: 'inside' })
      .png({ palette: false })
      .toBuffer();
    return `data:image/png;base64,${png.toString('base64')}`;
  } catch {
    return null;
  }
}

function getLogo(): Promise<string | null> {
  if (!logoPromise) {
    logoPromise = loadLogo().catch((err) => {
      logoPromise = null;
      throw err;
    });
  }
  return logoPromise;
}

async function qrPngDataUrl(text: string, size: number): Promise<string> {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 0,
    errorCorrectionLevel: 'M',
  });
}

function cachePath(hash: string): string {
  return path.join(CACHE_DIR, `${hash}.${CACHE_TEMPLATE_VERSION}.pdf`);
}

async function readCache(hash: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(cachePath(hash));
  } catch {
    return null;
  }
}

async function writeCache(hash: string, buffer: Buffer): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(cachePath(hash), buffer);
  } catch (e) {
    console.warn('[pdf] cache write failed:', e);
  }
}

// Manual ISO-slice rather than date-fns `format` because `format` runs in the
// server's local timezone; the certificate must show UTC unambiguously.
function formatUtc(unixSeconds: number): string {
  const iso = new Date(unixSeconds * 1000).toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)} UTC`;
}

type RenderResult =
  | { status: 'pending' }
  | { status: 'notFound' }
  | { status: 'ok'; buffer: Buffer };

async function renderPdf(hash: string): Promise<RenderResult> {
  const stamp = await stampRepository.findStampByHash(hash, true).catch(() => null);
  if (!stamp) return { status: 'notFound' };
  if (!stamp.isFinished() || !stamp.tx || !stamp.block || !stamp.time) {
    return { status: 'pending' };
  }

  const proofUrl = `${SITE_URL}/proof/${hash}`;

  const [identiconPng, qrPng, logoPng] = await Promise.all([
    identiconPngDataUrl(hash, 256),
    qrPngDataUrl(proofUrl, 256),
    getLogo(),
  ]);

  const buffer = await renderToBuffer(
    <Certificate
      hash={hash}
      block={stamp.block}
      tx={stamp.tx}
      formattedTime={formatUtc(stamp.time)}
      identiconPng={identiconPng}
      qrPng={qrPng}
      logoPng={logoPng}
      proofUrl={proofUrl}
      explorerHost={deriveHost(txUrl(stamp.tx))}
      protocol={stamp.protocol || '0.0.1'}
      siteName={SITE_NAME}
      siteUrl={SITE_URL}
      siteHost={SITE_HOST}
      protocolDocUrl={PROTOCOL_DOC_URL}
      isTestnet={IS_TESTNET}
    />,
  );

  await writeCache(hash, buffer);
  return { status: 'ok', buffer };
}

function setPdfHeaders(res: ServerResponse, hash: string, cacheStatus: 'HIT' | 'MISS'): void {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Cache-Control', CACHE_CONTROL_DAY);
  res.setHeader(
    'Content-Disposition',
    `inline; filename="gridcoin-stamp-${hash.slice(0, 12)}.pdf"`,
  );
  res.setHeader('X-Pdf-Cache', cacheStatus);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { res } = context;
  try {
    const raw = Array.isArray(context.params?.hash)
      ? context.params?.hash[0]
      : context.params?.hash;
    const hash = (raw ?? '').toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(hash)) {
      writeError(res, 400, 'Invalid hash');
      return { props: {} };
    }

    const cached = await readCache(hash);
    if (cached) {
      setPdfHeaders(res, hash, 'HIT');
      res.write(cached);
      res.end();
      return { props: {} };
    }

    const result = await renderPdf(hash);
    if (result.status === 'pending') {
      writeError(
        res,
        404,
        'Certificate available once the stamp is confirmed on-chain. Reload in a few minutes.',
      );
      return { props: {} };
    }
    if (result.status === 'notFound') {
      writeError(res, 404, 'Stamp not found.');
      return { props: {} };
    }

    setPdfHeaders(res, hash, 'MISS');
    res.write(result.buffer);
    res.end();
    return { props: {} };
  } catch (err) {
    writeServerError(res, '[pdf] render failed:', 'PDF render failed', err);
    return { props: {} };
  }
};

export default function CertificatePdfPage() {
  return null;
}
