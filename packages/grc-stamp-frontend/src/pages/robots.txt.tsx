import type { GetServerSideProps } from 'next';
import { IS_TESTNET } from '@/lib/network';
import { SITE_URL } from '@/components/Seo';

// SSR replaces the previous public/robots.txt so the testnet deployment
// can serve a deny-all without forking the static file. Both branches
// are env-driven: NEXT_PUBLIC_NETWORK picks the body, NEXT_PUBLIC_SITE_URL
// supplies the canonical origin for sitemap / llms references.
export default function RobotsTxt() { return null; }

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const body = IS_TESTNET
    ? `User-agent: *
Disallow: /
`
    : `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml

# LLMs
llms.txt: ${SITE_URL}/llms.txt
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(body);
  res.end();

  return { props: {} };
};
