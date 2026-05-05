import type { GetServerSideProps } from 'next';
import { IS_TESTNET } from '@/lib/network';
import { SITE_URL } from '@/components/Seo';

// /llms.txt — plain-text summary for LLMs / AEO per https://llmstxt.org/.
// Mainnet only: testnet is noindex/nofollow, so an llms.txt on testnet
// would be wasted bytes. The route returns 404 there.

const content = `# Gridcoin Blockchain Stamping

> Permanently certify documents on the Gridcoin blockchain. Privacy-first: files never leave the browser — only SHA-256 hashes are stored on-chain.

Gridcoin Blockchain Stamping is a free Proof of Existence service. Users drop a file in the browser, a SHA-256 hash is computed client-side, and the hash is embedded in a Gridcoin blockchain transaction using OP_RETURN. The file never uploads. Once confirmed, the proof is permanent and publicly verifiable.

## Documentation
- [About](${SITE_URL}/llms-full.txt): Full explanation of Proof of Existence, the protocol, and costs
- [API Reference](${SITE_URL}/developers): Public JSON:API — endpoints to create stamps, look up hashes, and query the service wallet
- [GitHub Action](${SITE_URL}/developers/github-action): Gridcoin Stamp Action for GitHub — automatically timestamps release assets on the Gridcoin blockchain and appends a verification table to the release notes

## Optional
- [Stamps endpoint (live JSON:API)](${SITE_URL}/api/stamps): Paginated JSON:API listing of all stamps with filter/sort/sparse-fieldset support
- [Service status](${SITE_URL}/api/status): Current service version and maintenance flag
`;

export default function LlmsTxt() { return null; }

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (IS_TESTNET) return { notFound: true };

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  res.write(content);
  res.end();

  return { props: {} };
};
