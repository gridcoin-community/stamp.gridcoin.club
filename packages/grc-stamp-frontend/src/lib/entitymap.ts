import { SITE_URL, SITE_NAME } from '@/components/Seo';

// EntityMap v1.0 (https://entitymap.org/spec/v1.0) — an entity-first index
// of what this site knows, for AI systems / retrieval pipelines. Served at
// /entitymap.json (machine) and /entitymap.html (human/crawler). Both views
// are built from the single source below so they can never drift.
//
// Compliance notes baked in here:
// - every chunk.publisher equals root publisher.name (we derive both from
//   SITE_NAME) — the spec requires an exact, case-sensitive match
// - the six Tier-3 interpretive predicates (IMPROVES, DEGRADES, LEADS_TO,
//   SUITED_FOR, TARGETS, ACHIEVES) MUST carry a `confidence` — the ones we
//   use are hand-authored, so `confidence: 'declared'`
// - chunk text is extractive (≤ 600 chars) and lifted from the referenced
//   public page; sourceUrls all resolve.
//
// `GENERATED` is the content-authored date, not a per-request clock — bump
// it when the entities below change so the timestamp stays honest.
export const GENERATED = '2026-07-20T00:00:00Z';

export interface Chunk {
  chunkId: string;
  text: string;
  sourceUrl: string;
  pageTitle: string;
  publisher: string;
  contentType?: 'definition' | 'evidence' | 'example' | 'statistic' | 'procedure';
}

export interface Relation {
  predicate: string;
  targetName: string;
  targetId?: string;
  targetUri?: string;
  confidence?: 'declared' | 'inferred';
}

export interface Entity {
  entityId: string;
  '@type': string;
  name: string;
  description: string;
  alternateName?: string;
  sameAs?: string;
  relations?: Relation[];
  hasChunks: Chunk[];
}

export interface EntityMap {
  version: '1.0';
  schema: 'https://entitymap.org/spec/v1.0';
  publisher: { name: string; url: string };
  generated: string;
  entities: Entity[];
}

// Page titles mirror what Seo.tsx renders on mainnet (SITE_NAME, then a
// " :: <section>" suffix). entitymap is mainnet-only, so no [testnet] prefix.
const TITLE_HOME = SITE_NAME;
const TITLE_ABOUT = `${SITE_NAME} :: About`;
const TITLE_API = `${SITE_NAME} :: API Reference`;
const TITLE_ACTION = `${SITE_NAME} :: GitHub Action for CI/CD`;

const entities: Entity[] = [
  {
    entityId: 'stamping-service',
    '@type': 'Service',
    name: SITE_NAME,
    description:
      'A free Proof of Existence service that permanently certifies documents on the Gridcoin blockchain. Files never leave the browser — only their SHA-256 hash is stored on-chain.',
    relations: [
      { predicate: 'ENABLES', targetId: 'proof-of-existence', targetName: 'Proof of Existence' },
      { predicate: 'DEPENDS_ON', targetId: 'gridcoin', targetName: 'Gridcoin' },
      { predicate: 'INCLUDES', targetId: 'stamping-api', targetName: 'Stamping API' },
      {
        predicate: 'RELATES_TO',
        targetId: 'gridcoin-stamp-action',
        targetName: 'Gridcoin Stamp GitHub Action',
      },
      {
        predicate: 'SUITED_FOR',
        targetName: 'Long-term document timestamping and proof of ownership',
        confidence: 'declared',
      },
    ],
    hasChunks: [
      {
        chunkId: 'stamping-service-1',
        text: 'Gridcoin Blockchain Stamping is a free Proof of Existence service. Users drop a file in the browser, a SHA-256 hash is computed client-side, and the hash is embedded in a Gridcoin blockchain transaction using OP_RETURN. The file never uploads. Once confirmed, the proof is permanent and publicly verifiable.',
        sourceUrl: `${SITE_URL}/`,
        pageTitle: TITLE_HOME,
        publisher: SITE_NAME,
        contentType: 'definition',
      },
      {
        chunkId: 'stamping-service-2',
        text: 'Documents are never uploaded — only the SHA-256 hash is transmitted. No user accounts or personal data are collected, no tracking pixels are used, and the service is also available via a Tor onion service.',
        sourceUrl: `${SITE_URL}/about`,
        pageTitle: TITLE_ABOUT,
        publisher: SITE_NAME,
        contentType: 'evidence',
      },
    ],
  },
  {
    entityId: 'proof-of-existence',
    '@type': 'Concept',
    name: 'Proof of Existence',
    description:
      'A technique that uses an immutable public blockchain to prove that a specific piece of data existed at a certain point in time. Once embedded and confirmed, the data cannot be altered or removed.',
    relations: [
      { predicate: 'DEPENDS_ON', targetId: 'gridcoin', targetName: 'Gridcoin' },
      { predicate: 'REQUIRES', targetId: 'sha-256', targetName: 'SHA-256' },
      {
        predicate: 'SUITED_FOR',
        targetName: 'Proof of ownership, data timestamping, and data-integrity verification',
        confidence: 'declared',
      },
    ],
    hasChunks: [
      {
        chunkId: 'proof-of-existence-1',
        text: 'Proof of Existence leverages blockchain technology to prove that a specific piece of data existed at a certain point in time. Because the blockchain is an immutable, decentralized public ledger, any data embedded in it cannot be altered or removed after confirmation.',
        sourceUrl: `${SITE_URL}/about`,
        pageTitle: TITLE_ABOUT,
        publisher: SITE_NAME,
        contentType: 'definition',
      },
    ],
  },
  {
    entityId: 'sha-256',
    '@type': 'Standard',
    name: 'SHA-256',
    description:
      'A cryptographic hash function that maps a file of any size to a fixed 64-character hexadecimal digest. The stamping service computes this digest in the browser, so the file itself is never transmitted.',
    sameAs: 'https://en.wikipedia.org/wiki/SHA-2',
    hasChunks: [
      {
        chunkId: 'sha-256-1',
        text: "The file's SHA-256 hash is computed entirely client-side using js-sha256 — the file never leaves the user's device. Only the resulting hash is submitted to the stamping service.",
        sourceUrl: `${SITE_URL}/about`,
        pageTitle: TITLE_ABOUT,
        publisher: SITE_NAME,
        contentType: 'evidence',
      },
    ],
  },
  {
    entityId: 'gridcoin',
    '@type': 'Platform',
    name: 'Gridcoin',
    description:
      'The decentralized blockchain network that stores stamp hashes. Each stamp transaction embeds the hash in an OP_RETURN output; once confirmed it is permanent and publicly verifiable.',
    sameAs: 'https://en.wikipedia.org/wiki/Gridcoin',
    hasChunks: [
      {
        chunkId: 'gridcoin-1',
        text: 'The service embeds the hash in a Gridcoin blockchain transaction using an OP_RETURN script opcode. Once the transaction is confirmed on the blockchain, the proof is permanent and publicly verifiable.',
        sourceUrl: `${SITE_URL}/about`,
        pageTitle: TITLE_ABOUT,
        publisher: SITE_NAME,
        contentType: 'evidence',
      },
    ],
  },
  {
    entityId: 'stamp-protocol',
    '@type': 'Concept',
    name: 'Gridcoin Stamp Protocol',
    description:
      'The on-chain data format for stamps. Each OP_RETURN payload carries a "5ea1ed" ("Sealed") identifier word, a protocol version, and up to two SHA-256 hashes.',
    alternateName: '5ea1ed OP_RETURN stamp format',
    relations: [
      { predicate: 'REQUIRES', targetId: 'sha-256', targetName: 'SHA-256' },
      { predicate: 'RELATES_TO', targetId: 'gridcoin', targetName: 'Gridcoin' },
    ],
    hasChunks: [
      {
        chunkId: 'stamp-protocol-1',
        text: 'The hash is embedded using OP_RETURN. The payload begins with 6a46 (the OP_RETURN prefix) and the identifier word 5ea1ed ("Sealed"), followed by a protocol version and up to two 64-character SHA-256 hashes. Storing two hashes per transaction saves on fees.',
        sourceUrl: `${SITE_URL}/about`,
        pageTitle: TITLE_ABOUT,
        publisher: SITE_NAME,
        contentType: 'procedure',
      },
    ],
  },
  {
    entityId: 'stamping-api',
    '@type': 'Service',
    name: 'Stamping API',
    description:
      'A public, unauthenticated, CORS-enabled JSON:API for creating stamps, looking up hashes, and querying the service wallet.',
    relations: [{ predicate: 'PART_OF', targetId: 'stamping-service', targetName: SITE_NAME }],
    hasChunks: [
      {
        chunkId: 'stamping-api-1',
        text: 'The API is public, unauthenticated, and CORS-enabled, following the JSON:API specification. Endpoints let callers create stamps, fetch a stamp by id, look up the earliest stamp for a hash, and read the service wallet balance.',
        sourceUrl: `${SITE_URL}/developers`,
        pageTitle: TITLE_API,
        publisher: SITE_NAME,
        contentType: 'definition',
      },
    ],
  },
  {
    entityId: 'gridcoin-stamp-action',
    '@type': 'SoftwareProduct',
    name: 'Gridcoin Stamp GitHub Action',
    description:
      'A GitHub Action that anchors release assets to the Gridcoin blockchain on every published release, appending a verification table to the release notes.',
    sameAs: 'https://github.com/gridcat/gridcoin-stamp-action',
    relations: [
      { predicate: 'DEPENDS_ON', targetId: 'stamping-api', targetName: 'Stamping API' },
      { predicate: 'RELATES_TO', targetId: 'stamping-service', targetName: SITE_NAME },
    ],
    hasChunks: [
      {
        chunkId: 'gridcoin-stamp-action-1',
        text: 'The Gridcoin Stamp Action anchors GitHub release assets to the Gridcoin blockchain on every "release: published" event. It computes the SHA-256 of every artifact on the runner, submits the hashes to the stamping API, and writes a "Blockchain Timestamps" table into the release body with a verification link per file.',
        sourceUrl: `${SITE_URL}/developers/github-action`,
        pageTitle: TITLE_ACTION,
        publisher: SITE_NAME,
        contentType: 'procedure',
      },
    ],
  },
  {
    entityId: 'proof-certificate',
    '@type': 'Service',
    name: 'Blockchain Proof Certificate',
    description:
      'A public verification page and printable one-page PDF certificate for a confirmed stamp, carrying the hash, transaction id, block, UTC timestamp, and a QR code linking back to the proof.',
    relations: [{ predicate: 'PART_OF', targetId: 'stamping-service', targetName: SITE_NAME }],
    hasChunks: [
      {
        chunkId: 'proof-certificate-1',
        text: 'Each confirmed stamp has a verification page at /proof/{hash} and a printable PDF certificate that includes the SHA-256 hash, transaction id, block, UTC timestamp, and a QR code, plus instructions for verifying the proof against any Gridcoin block explorer.',
        sourceUrl: `${SITE_URL}/llms-full.txt`,
        pageTitle: TITLE_HOME,
        publisher: SITE_NAME,
        contentType: 'evidence',
      },
    ],
  },
];

export function buildEntityMap(): EntityMap {
  return {
    version: '1.0',
    schema: 'https://entitymap.org/spec/v1.0',
    publisher: { name: SITE_NAME, url: SITE_URL },
    generated: GENERATED,
    entities,
  };
}
