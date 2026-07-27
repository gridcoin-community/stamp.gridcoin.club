import type { GetServerSideProps } from 'next';
import { IS_TESTNET } from '@/lib/network';
import { buildEntityMap } from '@/lib/entitymap';

// /entitymap.json — machine-readable EntityMap v1.0 (https://entitymap.org).
// Mainnet only, matching llms.txt/robots: testnet is noindex/nofollow, so
// the route 404s there. The human-readable twin lives at /entitymap.html.
export default function EntityMapJson() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (IS_TESTNET) return { notFound: true };

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  res.write(JSON.stringify(buildEntityMap(), null, 2));
  res.end();

  return { props: {} };
};
