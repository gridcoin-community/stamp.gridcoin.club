import type { GetServerSideProps } from 'next';
import { IS_TESTNET } from '@/lib/network';
import { SITE_URL } from '@/components/Seo';
import { buildEntityMap, type Relation } from '@/lib/entitymap';

// /entitymap.html — human- and crawler-readable view of the same data served
// at /entitymap.json, per the EntityMap spec (publishers ship both). This is a
// standalone document on purpose: it is a spec artifact, not an app page, so it
// does not use the MUI shell — just plain semantic HTML that renders and
// indexes without JS.
export default function EntityMapHtml() {
  return null;
}

const esc = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const relationLine = (r: Relation): string => {
  const target = r.targetUri
    ? `<a href="${esc(r.targetUri)}">${esc(r.targetName)}</a>`
    : esc(r.targetName);
  const conf = r.confidence ? ` <span class="conf">(${esc(r.confidence)})</span>` : '';
  return `<li><code>${esc(r.predicate)}</code> → ${target}${conf}</li>`;
};

function renderHtml(): string {
  const map = buildEntityMap();

  const entities = map.entities
    .map((e) => {
      const sameAs = e.sameAs
        ? `<p class="sameas">Same as: <a href="${esc(e.sameAs)}">${esc(e.sameAs)}</a></p>`
        : '';
      const alt = e.alternateName
        ? `<p class="alt">Also known as: ${esc(e.alternateName)}</p>`
        : '';
      const relations =
        e.relations && e.relations.length
          ? `<h3>Relations</h3><ul class="relations">${e.relations.map(relationLine).join('')}</ul>`
          : '';
      const chunks = e.hasChunks
        .map(
          (c) =>
            `<blockquote><p>${esc(c.text)}</p><cite><a href="${esc(c.sourceUrl)}">${esc(
              c.pageTitle,
            )}</a></cite></blockquote>`,
        )
        .join('');

      return `<article id="${esc(e.entityId)}">
  <h2>${esc(e.name)} <span class="type">${esc(e['@type'])}</span></h2>
  <p class="desc">${esc(e.description)}</p>
  ${alt}
  ${sameAs}
  ${relations}
  <h3>Evidence</h3>
  ${chunks}
</article>`;
    })
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>EntityMap — ${esc(map.publisher.name)}</title>
<meta name="description" content="Entity-first index of ${esc(
    map.publisher.name,
  )} for AI systems and retrieval pipelines, per the EntityMap v1.0 standard.">
<link rel="canonical" href="${esc(SITE_URL)}/entitymap.html">
<link rel="alternate" type="application/json" href="${esc(SITE_URL)}/entitymap.json">
<style>
  :root { color-scheme: light dark; }
  body { max-width: 52rem; margin: 0 auto; padding: 2rem 1.25rem; line-height: 1.55;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  header { border-bottom: 1px solid #8888; padding-bottom: 1rem; margin-bottom: 2rem; }
  h1 { margin: 0 0 .25rem; font-size: 1.6rem; }
  h2 { font-size: 1.2rem; margin: 0 0 .35rem; }
  h3 { font-size: .8rem; text-transform: uppercase; letter-spacing: .06em; opacity: .7;
    margin: 1rem 0 .35rem; }
  article { padding: 1.25rem 0; border-bottom: 1px solid #8884; }
  .type { font-size: .7rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em;
    border: 1px solid #8888; border-radius: 999px; padding: .1rem .5rem; vertical-align: middle; }
  .desc { margin: .35rem 0; }
  .alt, .sameas { font-size: .85rem; opacity: .8; margin: .2rem 0; }
  ul.relations { margin: .25rem 0; padding-left: 1.1rem; }
  ul.relations code { font-size: .8rem; }
  .conf { opacity: .6; font-size: .8rem; }
  blockquote { margin: .5rem 0; padding: .4rem 0 .4rem .9rem; border-left: 3px solid #8886; }
  blockquote p { margin: 0 0 .3rem; }
  cite { font-size: .8rem; font-style: normal; opacity: .75; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  a { color: inherit; }
  footer { margin-top: 2.5rem; font-size: .8rem; opacity: .7; }
</style>
</head>
<body>
<header>
  <h1>EntityMap — ${esc(map.publisher.name)}</h1>
  <p>An entity-first index of what <a href="${esc(map.publisher.url)}">${esc(
    map.publisher.name,
  )}</a> knows, published for AI systems and retrieval pipelines under the
  <a href="https://entitymap.org/spec/v1.0">EntityMap v1.0</a> standard.
  Machine-readable version: <a href="${esc(SITE_URL)}/entitymap.json">entitymap.json</a>.</p>
  <p style="font-size:.8rem;opacity:.7">Generated ${esc(map.generated)} · ${
    map.entities.length
  } entities</p>
</header>
<main>
${entities}
</main>
<footer>
  <p>EntityMap ${esc(map.version)} · <a href="https://entitymap.org/">entitymap.org</a></p>
</footer>
</body>
</html>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (IS_TESTNET) return { notFound: true };

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  res.write(renderHtml());
  res.end();

  return { props: {} };
};
