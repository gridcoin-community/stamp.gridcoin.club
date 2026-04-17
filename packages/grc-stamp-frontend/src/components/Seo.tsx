import Head from 'next/head';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://stamp.gridcoin.club';
export const SITE_NAME = 'Gridcoin Blockchain Stamping';

interface SeoProps {
  title: string;
  description: string;
  path: string;
   
  ogType?: 'website' | 'article';
   
  jsonLd?: Record<string, unknown>;
   
  noindex?: boolean;
   
  iconDataUrl?: string;
   
  ogImagePath?: string;
}

export function Seo({
  title,
  description,
  path,
  ogType = 'website',
  jsonLd,
  noindex,
  iconDataUrl,
  ogImagePath,
}: SeoProps) {
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImageUrl = ogImagePath
    ? `${SITE_URL}${ogImagePath}`
    : `${SITE_URL}/og-image.png`;

  return (
    <Head>
      <title>{title}</title>
      <meta key="description" name="description" content={description} />
      <link key="canonical" rel="canonical" href={canonicalUrl} />

      {/*
        Always emit a favicon link — next/head only replaces tags by key, so
        a page that omits it entirely would leave the previous page's icon
        stuck in the tab until a full reload.
      */}
      <link
        key="icon"
        rel="icon"
        href={iconDataUrl ?? '/favicon.ico'}
      />

      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:type" property="og:type" content={ogType} />
      <meta key="og:url" property="og:url" content={canonicalUrl} />
      <meta key="og:image" property="og:image" content={ogImageUrl} />
      <meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
      <meta key="og:locale" property="og:locale" content="en_US" />

      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta key="twitter:description" name="twitter:description" content={description} />
      <meta key="twitter:image" name="twitter:image" content={ogImageUrl} />

      {noindex && <meta key="robots" name="robots" content="noindex, nofollow" />}
      {jsonLd && (
        <script
          key="jsonld"
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\//g, '<\\/') }}
        />
      )}
    </Head>
  );
}
