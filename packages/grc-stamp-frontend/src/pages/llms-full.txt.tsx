import { GetServerSideProps } from 'next';

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
- The service is currently offered for **free**

## Pages

- \`/\` — Interactive stamping tool: upload a file, compute its hash, and submit to blockchain
- \`/about\` — Detailed explanation of Proof of Existence, the protocol, and costs
- \`/developers\` — Full API reference with request and response examples
- \`/developers/github-action\` — Gridcoin Stamp Action for GitHub (drop-in workflow that timestamps release assets on the Gridcoin blockchain)
- \`/proof/{sha256hash}\` — Verification page for a specific blockchain-certified document hash

## API

The API is public, unauthenticated, and CORS-enabled. Full human-readable docs live at https://stamp.gridcoin.club/developers.

- **Base URL**: https://stamp.gridcoin.club/api
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
- \`POST /api/stamps\` — Create a new stamp. JSON:API body: { data: { type: "stamps", attributes: { hash, hashType?, protocol? } } }. \`hash\` must be exactly 64 hex characters. Returns 201 Created for a new stamp, 200 OK if the hash was already stamped, 400 for validation errors, and 406 if the service wallet is below the minimum balance.
- \`GET /api/hashes/:hash\` — Look up the earliest stamp for a given SHA-256 hash. Returns 404 if the hash has never been stamped.
- \`GET /api/wallet\` — Returns the service wallet address, current balance (as a string to avoid floating-point rounding), and the last block processed by the scraper.
- \`GET /api/wallet/balance\` — Lightweight balance-only variant.

### Quick examples

Check service health:

    curl https://stamp.gridcoin.club/api/status

Stamp a SHA-256 hash:

    curl -X POST 'https://stamp.gridcoin.club/api/stamps' \\
      -H 'Content-Type: application/vnd.api+json' \\
      -d '{"data":{"type":"stamps","attributes":{"hash":"87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7"}}}'

Look up a hash:

    curl https://stamp.gridcoin.club/api/hashes/87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7
`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');
  res.write(content);
  res.end();

  return { props: {} };
};

export default function LlmsFullTxt() {
  return null;
}
