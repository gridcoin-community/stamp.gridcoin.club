/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-console */
import React from 'react';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { ImageResponse } from 'next/og';
import type { GetServerSideProps } from 'next';
import type { ServerResponse } from 'node:http';
import { identiconDataUrl } from '@/lib/identicon';
import { StampRepository } from '@/repositories/StampsRepository';

const WIDTH = 1200;
const HEIGHT = 630;

const CACHE_DIR = process.env.OG_CACHE_DIR
  || path.join(process.cwd(), '.cache/og');

const FONT_DIR = path.join(process.cwd(), 'public/fonts/SFUIText');
const LOGO_PATH = path.join(process.cwd(), 'public/ic-logo-desktop.svg');

const stampRepository = new StampRepository();

interface OgAssets {
  fontRegular: ArrayBuffer;
  fontSemibold: ArrayBuffer;
  logoDataUrl: string | null;
}

// Cache the loading PROMISE, not the resolved value — stops two concurrent
// cold requests from reading the same files twice.
let assetsPromise: Promise<OgAssets> | null = null;

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  const ab = new ArrayBuffer(buf.byteLength);
  new Uint8Array(ab).set(buf);
  return ab;
}

async function loadAssets(): Promise<OgAssets> {
  const [regular, semibold, logo] = await Promise.all([
    fs.readFile(path.join(FONT_DIR, 'SFUIText-Regular.woff')),
    fs.readFile(path.join(FONT_DIR, 'SFUIText-Semibold.woff')),
    fs.readFile(LOGO_PATH, 'utf-8').catch(() => null),
  ]);
  return {
    fontRegular: toArrayBuffer(regular),
    fontSemibold: toArrayBuffer(semibold),
    logoDataUrl: logo
      ? `data:image/svg+xml;base64,${Buffer.from(logo, 'utf-8').toString('base64')}`
      : null,
  };
}

function getAssets(): Promise<OgAssets> {
  if (!assetsPromise) {
    assetsPromise = loadAssets().catch((err) => {
      // Reset on failure so the next request gets a fresh attempt instead of
      // sticking to the poisoned rejection forever.
      assetsPromise = null;
      throw err;
    });
  }
  return assetsPromise;
}

async function readCache(hash: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(CACHE_DIR, `${hash}.png`));
  } catch {
    return null;
  }
}

async function writeCache(hash: string, buffer: Buffer): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(path.join(CACHE_DIR, `${hash}.png`), buffer);
  } catch (e) {
    console.warn('[og] cache write failed:', e);
  }
}

function writeError(res: ServerResponse, status: number, body: string): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.write(body);
  res.end();
}

const labelStyle = {
  fontSize: 16,
  color: '#888',
  fontWeight: 700,
  letterSpacing: '1.5px',
} as const;

const valueStyle = {
  fontSize: 22,
  color: '#1a1a1a',
  fontWeight: 400,
  wordBreak: 'break-all',
  lineHeight: 1.3,
} as const;

type RenderResult =
  | { status: 'notFound' }
  | { status: 'ok'; buffer: Buffer };

async function renderImage(hash: string): Promise<RenderResult> {
  const [stamp, assets] = await Promise.all([
    stampRepository.findStampByHash(hash, true).catch(() => null),
    getAssets(),
  ]);

  // Only render images for fully-confirmed stamps. Pending stamps 404 so
  // social-media crawlers retry after the blockchain lands the transaction
  // rather than caching a "— pending —" placeholder forever.
  if (!stamp || !stamp.isFinished() || !stamp.tx || !stamp.block) {
    return { status: 'notFound' };
  }

  const rows: Array<[string, string]> = [
    ['HASH', hash],
    ['TX', stamp.tx],
    ['BLOCK', String(stamp.block)],
  ];

  const image = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8fafd',
          padding: '64px 72px',
          fontFamily: 'SF',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {assets.logoDataUrl ? (
            <img
              src={assets.logoDataUrl}
              width="250"
              height="80"
              alt=""
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div style={{ fontSize: 42, fontWeight: 700, color: '#732DE2' }}>
              stamp.gridcoin.club
            </div>
          )}
          <div style={{ fontSize: 24, color: '#888', fontWeight: 400 }}>
            Proof of Existence
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            gap: '56px',
            marginTop: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              position: 'relative',
              padding: 16,
              backgroundColor: '#ffffff',
              borderRadius: 32,
              boxShadow: '0 10px 40px rgba(115, 45, 226, 0.18)',
              flexShrink: 0,
            }}
          >
            <img
              src={identiconDataUrl(hash, 240, 'svg')}
              width="240"
              height="240"
              alt=""
              style={{ borderRadius: 20, display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                top: -48,
                right: -48,
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: '#2e7d32',
                border: '6px solid #f8fafd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.35)',
              }}
            >
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: 16,
              minWidth: 0,
            }}
          >
            {rows.map(([label, value]) => (
              <div
                key={label}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div style={labelStyle}>{label}</div>
                <div style={valueStyle}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            color: '#aaa',
          }}
        >
          Gridcoin Blockchain Stamping · privacy-first proof on a public ledger
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: 'SF',
          data: assets.fontRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'SF',
          data: assets.fontSemibold,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );

  const buffer = Buffer.from(await image.arrayBuffer());
  await writeCache(hash, buffer);
  return { status: 'ok', buffer };
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
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/png');
      res.setHeader(
        'Cache-Control',
        'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      );
      res.setHeader('X-Og-Cache', 'HIT');
      res.write(cached);
      res.end();
      return { props: {} };
    }

    const result = await renderImage(hash);
    if (result.status === 'notFound') {
      return { notFound: true };
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Cache-Control',
      'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    );
    res.setHeader('X-Og-Cache', 'MISS');
    res.write(result.buffer);
    res.end();
    return { props: {} };
  } catch (err) {
    const message = err instanceof Error ? err.stack ?? err.message : String(err);
    console.error('[og] render failed:', message);
    writeError(res, 500, `OG image render failed: ${message}`);
    return { props: {} };
  }
};

export default function OgImagePage() {
  return null;
}
