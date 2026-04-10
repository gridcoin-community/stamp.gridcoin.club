import Head from 'next/head';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://stamp.gridcoin.club';
export const SITE_NAME = 'Gridcoin Blockchain Stamping';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  // eslint-disable-next-line react/require-default-props
  ogType?: 'website' | 'article';
  // eslint-disable-next-line react/require-default-props
  jsonLd?: Record<string, unknown>;
  // eslint-disable-next-line react/require-default-props
  noindex?: boolean;
}

export function Seo({
  title,
  description,
  path,
  ogType = 'website',
  jsonLd,
  noindex,
}: SeoProps) {
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Head>
      <title>{title}</title>
      <meta key="description" name="description" content={description} />
      <link key="canonical" rel="canonical" href={canonicalUrl} />

      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:type" property="og:type" content={ogType} />
      <meta key="og:url" property="og:url" content={canonicalUrl} />
      <meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
      <meta key="og:locale" property="og:locale" content="en_US" />

      <meta key="twitter:card" name="twitter:card" content="summary" />
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta key="twitter:description" name="twitter:description" content={description} />

      {noindex && <meta key="robots" name="robots" content="noindex, nofollow" />}
      {jsonLd && (
        <script
          key="jsonld"
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
