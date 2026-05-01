// eslint-disable jsx-a11y/alt-text: react-pdf's <Image> is a PDF primitive,
// not an HTML <img>; it does not accept an alt prop.
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  StyleSheet,
} from '@react-pdf/renderer';

// Split a string into fixed-size chunks joined by newlines. Used for
// 64-character SHA-256 hashes and tx ids: the layout engine inserts a "-"
// at any soft-wrap point it picks itself, which corrupts the rendered hex.
// Hard `\n` breaks are not soft-wraps, so they pass through unaltered.
function chunkLines(s: string, size: number): string {
  const out: string[] = [];
  for (let i = 0; i < s.length; i += size) {
    out.push(s.slice(i, i + size));
  }
  return out.join('\n');
}

// Display the proof URL across multiple lines so it fits inside the QR card
// without triggering soft-wrap. When the URL ends with the hash (the common
// case), break before the hash and split the hash in half.
function breakProofUrlForDisplay(proofUrl: string, hash: string): string {
  if (hash.length === 64 && proofUrl.endsWith(hash)) {
    const prefix = proofUrl.slice(0, -64);
    return `${prefix}\n${hash.slice(0, 32)}\n${hash.slice(32)}`;
  }
  return proofUrl;
}

export interface CertificateProps {
  hash: string;
  block: number;
  tx: string;
  formattedTime: string;
  identiconPng: string;
  qrPng: string;
  logoPng?: string | null;
  /** Full URL encoded into the QR code; also used as the source for the
   * visible "verify online" text after manual line-breaking. */
  proofUrl: string;
  /** Host of a representative block-explorer (e.g. "gridcoinstats.eu") used
   * inline in the verification instructions. Optional; when missing, the
   * step refers to "any Gridcoin block explorer" without a concrete example. */
  explorerHost?: string;
  protocol: string;
  /** Display name of the service (e.g. "Gridcoin Blockchain Stamping"). */
  siteName: string;
  /** Full site URL with scheme (e.g. "https://stamp.gridcoin.club"). Used as
   * the Link target for the drop-zone reference in the verification steps. */
  siteUrl: string;
  /** Host portion of the site URL (e.g. "stamp.gridcoin.club"). */
  siteHost: string;
  /** Full URL (with scheme) pointing at the protocol-format docs, e.g.
   * "https://stamp.gridcoin.club/about#protocol-overview". Used both as the
   * visible string and as the Link target. */
  protocolDocUrl: string;
}

const PURPLE = '#732DE2';
const TEXT = '#1a1a1a';
const MUTED = '#888888';
const BORDER = '#e0e4ee';
const BG = '#f8fafd';
const CARD = '#ffffff';

const styles = StyleSheet.create({
  page: {
    backgroundColor: BG,
    padding: 48,
    fontFamily: 'Helvetica',
    color: TEXT,
    fontSize: 10.5,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  logo: {
    width: 150,
    height: 36,
    objectFit: 'contain',
  },
  brand: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: PURPLE,
  },
  headerSubtitle: {
    fontSize: 10,
    color: MUTED,
    letterSpacing: 1.5,
    fontFamily: 'Helvetica-Bold',
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 22,
    padding: 18,
    backgroundColor: CARD,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  identiconCard: {
    width: 132,
    height: 132,
    padding: 6,
    backgroundColor: CARD,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    flexShrink: 0,
    marginRight: 20,
  },
  identicon: {
    width: 118,
    height: 118,
    borderRadius: 4,
  },
  heroData: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 7.5,
    color: MUTED,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.4,
    marginTop: 6,
  },
  hash: {
    fontFamily: 'Courier-Bold',
    fontSize: 10,
    color: TEXT,
    marginTop: 2,
  },
  value: {
    fontSize: 10.5,
    color: TEXT,
    marginTop: 2,
  },
  txValue: {
    fontFamily: 'Courier',
    fontSize: 9,
    color: TEXT,
    marginTop: 2,
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    padding: 14,
    backgroundColor: CARD,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  qr: {
    width: 78,
    height: 78,
    marginRight: 16,
  },
  qrText: {
    flex: 1,
  },
  proofUrl: {
    fontSize: 11,
    color: PURPLE,
    fontFamily: 'Helvetica-Bold',
    marginTop: 2,
  },
  section: {
    marginTop: 16,
  },
  h2: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: PURPLE,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 10.5,
    color: TEXT,
  },
  list: {
    marginTop: 2,
  },
  listItem: {
    fontSize: 10.5,
    color: TEXT,
    marginTop: 4,
  },
  monoInline: {
    fontFamily: 'Courier',
    fontSize: 9.5,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 8.5,
    color: MUTED,
    textAlign: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
});

export function Certificate(props: CertificateProps) {
  const {
    hash,
    block,
    tx,
    formattedTime,
    identiconPng,
    qrPng,
    logoPng,
    proofUrl,
    explorerHost,
    protocol,
    siteName,
    siteUrl,
    siteHost,
    protocolDocUrl,
  } = props;

  const hashLines = chunkLines(hash, 32);
  const txLines = chunkLines(tx, 32);
  const proofUrlDisplay = breakProofUrlForDisplay(proofUrl, hash);
  const explorerSnippet = explorerHost ? ` (e.g. ${explorerHost})` : '';

  return (
    <Document
      title={`${siteName} · Proof of ${hash}`}
      subject="Blockchain proof of existence"
      author={siteHost}
      creator={siteHost}
      producer={siteHost}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoPng ? (
            <Image src={logoPng} style={styles.logo} />
          ) : (
            <Text style={styles.brand}>{siteHost}</Text>
          )}
          <Text style={styles.headerSubtitle}>PROOF OF EXISTENCE</Text>
        </View>

        <View style={styles.hero}>
          <View style={styles.identiconCard}>
            <Image src={identiconPng} style={styles.identicon} />
          </View>
          <View style={styles.heroData}>
            <Text style={[styles.label, { marginTop: 0 }]}>SHA-256</Text>
            <Text style={styles.hash}>{hashLines}</Text>

            <Text style={styles.label}>STAMPED</Text>
            <Text style={styles.value}>{formattedTime}</Text>

            <Text style={styles.label}>BLOCK</Text>
            <Text style={styles.value}>{`#${block.toLocaleString('en-US')}`}</Text>

            <Text style={styles.label}>TRANSACTION</Text>
            <Text style={styles.txValue}>{txLines}</Text>
          </View>
        </View>

        <View style={styles.qrRow}>
          <Image src={qrPng} style={styles.qr} />
          <View style={styles.qrText}>
            <Text style={[styles.label, { marginTop: 0 }]}>VERIFY ONLINE</Text>
            <Link src={proofUrl} style={styles.proofUrl}>
              {proofUrlDisplay}
            </Link>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>What this proves</Text>
          <Text style={styles.body}>
            The SHA-256 hash above was published to the Gridcoin blockchain
            at the time shown, in the transaction listed. This certifies that
            the document with that hash existed no later than the stamp time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Privacy</Text>
          <Text style={styles.body}>
            {`${siteName} never received the original file. The hash was computed in the submitter's browser; only the hash leaves the browser. This certificate is a presentation of public on-chain data, not a copy of any private content.`}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>How to verify independently</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              1.  Compute the SHA-256 of your original file and confirm it
              matches the hash above. The browser drop-zone at
              {' '}
              <Link src={siteUrl} style={styles.monoInline}>{siteHost}</Link>
              {' '}
              does this locally. Your file is hashed in the browser and is
              never uploaded.
            </Text>
            <Text style={styles.listItem}>
              2.  Look up the transaction id (shown above) on any Gridcoin
              block explorer
              {explorerSnippet}
              {' '}
              and confirm the OP_RETURN script of that transaction contains
              the hash.
            </Text>
            <Text style={styles.listItem}>
              3.  The protocol embeds the hash as
              {' '}
              <Text style={styles.monoInline}>5ea1ed</Text>
              {' '}
              + protocol version + the hash(es). For the byte-level format, see:
            </Text>
            <Link
              src={protocolDocUrl}
              style={[styles.monoInline, { color: PURPLE, marginTop: 4, marginLeft: 16 }]}
            >
              {protocolDocUrl}
            </Link>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            {`Open-source · ${siteHost} · Gridcoin protocol v${protocol}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
