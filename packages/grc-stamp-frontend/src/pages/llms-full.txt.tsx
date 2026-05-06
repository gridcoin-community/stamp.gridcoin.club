import { GetServerSideProps } from 'next';
import { IS_TESTNET } from '@/lib/network';
import { SITE_URL } from '@/components/Seo';

// Mainnet only: testnet is noindex/nofollow, so we don't ship llms-full
// there either — the route returns 404 when NEXT_PUBLIC_NETWORK=testnet.
// All canonical URLs come from NEXT_PUBLIC_SITE_URL via SITE_URL.

const content = `# Gridcoin Blockchain Stamping

> Permanently certify documents on the Gridcoin blockchain. Privacy-first: files never leave the browser — only SHA-256 hashes are stored on-chain.

Gridcoin Blockchain Stamping is a free Proof of Existence service built on the Gridcoin blockchain. It allows anyone to securely and anonymously certify that a document existed at a specific point in time.

## How It Works

1. The user selects a file in their browser.
2. The file's SHA-256 hash is computed entirely client-side using js-sha256 — the file never leaves the user's device.
3. The hash is submitted to the stamping service API.
4. The service embeds the hash in a Gridcoin blockchain transaction using an OP_RETURN script opcode.
5. Once the transaction is confirmed on the blockchain, the proof is permanent and publicly verifiable.

## Proof of Existence

Proof of Existence is a concept that leverages blockchain technology to prove that a specific piece of data existed at a certain point in time. Because the blockchain is an immutable, decentralized public ledger, any data embedded in it cannot be altered or removed after confirmation.

Common use cases include:
- **Proof of ownership**: Demonstrate you possessed a document before a certain date
- **Data timestamping**: Establish when data was created or last modified
- **Data integrity**: Verify a document hasn't been tampered with by comparing hashes

## Privacy

- Documents are never uploaded — only the SHA-256 hash is transmitted
- No user accounts or personal data collected
- No tracking pixels or invasive analytics — only privacy-friendly Plausible Analytics
- The service is also available via Tor onion service

## Protocol

The hash is embedded in Gridcoin blockchain transactions using OP_RETURN. A typical transaction looks like:

    6a465ea1ed0000015bbbbbee48b735693478140de1b7f09fe0acddc0c7bce87f8665074efe53410f7158380aca149fa8422fb1274a69155303d4aaa76bf67defe0bb31628293afd2

Breaking this down:
- \`6a46\` — OP_RETURN script hex prefix
- \`5ea1ed\` — "Sealed" identifier hex word, used to identify stamp transactions
- \`000001\` — Protocol version (0.0.1, semantic versioning). All future versions support legacy protocols
- First 64 hex chars after version — first SHA-256 hash
- Next 64 hex chars (if present) — second SHA-256 hash

Each transaction can store up to two SHA-256 hashes, saving on fees and improving efficiency.

## Costs

- Transaction cost: approximately 0.06 GRC per proof (0.00000001 GRC burned + ~0.05 GRC fee)
- The service is currently offered for **free**. The service wallet is shared across all callers and topped up by the operator; anyone may also send GRC directly to the wallet address to keep it funded.

## Disclaimer

This service is provided as-is, without any warranty of any kind, express or implied. This includes the stamping web application, the public API, and the Gridcoin Stamp GitHub Action. We make no guarantees about availability, correctness, durability, or fitness for a particular purpose. To the maximum extent permitted by applicable law, the operators of this service shall not be liable for any direct, indirect, incidental, consequential, or any other damages arising from the use — or inability to use — any part of it. By using any component you accept full responsibility for how you integrate and rely on it.

## Pages

- \`/\` — Interactive stamping tool: upload a file, compute its hash, and submit to blockchain
- \`/about\` — Detailed explanation of Proof of Existence, the protocol, costs, and the liability disclaimer
- \`/developers\` — Full API reference with request and response examples
- \`/developers/github-action\` — Drop-in GitHub Actions workflow that timestamps release assets on the Gridcoin blockchain
- \`/proof/{sha256hash}\` — Verification page for a specific blockchain-certified document hash. Renders the full proof once the transaction is confirmed on chain, or a "pending" state while it is still in the mempool (the page updates automatically when confirmation lands).
- \`/proof/{sha256hash}/certificate.pdf\` — One-page printable PDF certificate of the proof. Includes the SHA-256 hash, identicon, transaction id, block, UTC timestamp, a QR code linking back to the proof page, and step-by-step instructions for verifying the proof against any Gridcoin block explorer without trusting stamp.gridcoin.club. Available only after the stamp is confirmed on-chain — pending stamps return 404. Suitable for attaching to court filings, articles, or grant submissions.

## GitHub Action

The Gridcoin Stamp Action (https://github.com/gridcat/gridcoin-stamp-action) is a companion tool that anchors GitHub release assets to the Gridcoin blockchain on every \`release: published\` event. When a release is published the action:

1. Fetches GitHub's auto-generated source archives and re-uploads them as immutable release assets under a \`-stamped\` name — GitHub's auto-archives are not byte-stable and their hashes can drift silently, so the action stamps the uploaded copy it controls
2. Emits a \`<tag>.stamp.txt\` proof manifest containing repository, tag, commit SHA, and tree SHA — fully reproducible from git state, no archive download needed
3. Aborts on tag-mutation: if the tag has been force-pushed to a different commit since the previous run, the action refuses to re-stamp and surfaces a clear error
4. Computes the SHA-256 of every artifact locally on the runner, submits the hashes to the stamping API, and writes a "Blockchain Timestamps" table into the release body with a verification link per file
5. Is idempotent on reruns: existing \`-stamped\` assets are reused, partial failures from a prior run are picked up, and the release body is rewritten only if it would actually change

Verification is privacy-first: recipients drop the stamped file onto ${SITE_URL} and the SHA-256 is computed client-side in the browser — the file itself never leaves the verifier's machine.

Minimal workflow:

    name: Stamp Release
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
              github-token: \${{ secrets.GITHUB_TOKEN }}

## API

The API is public, unauthenticated, and CORS-enabled. Full human-readable docs live at ${SITE_URL}/developers.

- **Base URL**: ${SITE_URL}/api
- **Content-Type**: application/vnd.api+json (JSON:API specification)
- **Authentication**: none — every endpoint is publicly accessible
- **Error format**: { "errors": [{ "status": number, "title": string, "detail"?: string }] }

### Conventions

Collection endpoints support these query parameters:
- \`page[size]\` — items per page, default 25, maximum 100
- \`page[number]\` — zero-indexed page number
- \`page[offset]\` — absolute record offset
- \`sort=field\` or \`sort=-field\` — ascending or descending
- \`fields[stamps]=hash,block,time\` — sparse fieldsets
- \`filter[field]=value\` — exact match, or \`filter[field][op]=value\` with operators \`eq\`, \`ne\`, \`gt\`, \`gte\`, \`lt\`, \`lte\`
- Responses include \`meta.count\` with the total number of matching records

### Endpoints

- \`GET /api/status\` — Service name, version, and maintenance flag. Use this for health checks.
- \`GET /api/stamps\` — List stamps. Supports pagination, sorting, sparse fieldsets, and filtering.
- \`GET /api/stamps/:id\` — Fetch a single stamp by its numeric id.
- \`POST /api/stamps\` — Create a new stamp. JSON:API body: { data: { type: "stamps", attributes: { hash, hashType?, protocol? } } }. \`hash\` must be exactly 64 hex characters. Returns 201 Created for a new stamp, 200 OK if the hash was already stamped, 400 for validation errors, 406 if the service wallet is below the minimum balance, and 429 if the per-IP rate limit (90 requests / 60 seconds) is exceeded — 429 responses include a \`Retry-After\` header in seconds.
- \`GET /api/hashes/:hash\` — Look up the earliest stamp for a given SHA-256 hash. Returns 404 if the hash has never been stamped.
- \`GET /api/wallet\` — Returns the service wallet address, current balance (as a JSON number), the last block processed by the scraper, the \`minimumBalance\` threshold below which new stamps are refused with 406, and \`effectiveBalance\` (balance minus GRC promised to pending stamps) — the value the server compares against \`minimumBalance\`.
- \`GET /api/wallet/balance\` — Lightweight balance-only variant.

### Quick examples

Check service health:

    curl ${SITE_URL}/api/status

Stamp a SHA-256 hash:

    curl -X POST '${SITE_URL}/api/stamps' \\
      -H 'Content-Type: application/vnd.api+json' \\
      -d '{"data":{"type":"stamps","attributes":{"hash":"87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7"}}}'

Look up a hash:

    curl ${SITE_URL}/api/hashes/87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7
`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (IS_TESTNET) return { notFound: true };

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400');
  res.write(content);
  res.end();

  return { props: {} };
};

export default function LlmsFullTxt() {
  return null;
}
