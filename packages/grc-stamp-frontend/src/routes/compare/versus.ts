// One entry per competitor: drives both the "vs" sections and the page menu.
export interface Versus {
  id: string;
  name: string;
  theirs: string;
  ours: string;
}

export const versus: Versus[] = [
  {
    id: 'vs-opentimestamps',
    name: 'OpenTimestamps',
    theirs: 'OpenTimestamps anchors to Bitcoin, the largest proof-of-work chain, and needs no account. Its calendar servers can delay a proof but cannot forge one. It is the strongest choice if Bitcoin\'s security is the only thing that matters to you.',
    ours: 'With OpenTimestamps you must keep the .ots file next to the original, and the proof is only complete after Bitcoin confirms it a few hours later. If the .ots file is lost, so is the proof. Gridcoin Stamp confirms in minutes and you keep nothing extra, because the hash itself is enough to find the proof. Every stamp also gets a public proof page and a printable PDF certificate.',
  },
  {
    id: 'vs-originstamp',
    name: 'OriginStamp',
    theirs: 'OriginStamp anchors each batch to both Bitcoin and Ethereum and documents a full manual verification procedure. It is a commercial product aimed at businesses, with support and contracts.',
    ours: 'OriginStamp anchors once a day, so a proof can take up to 24 hours, and pricing is by quote. Gridcoin Stamp is free and needs no account or API key. A stamp confirms in minutes, and checking it later takes only the original file.',
  },
  {
    id: 'vs-freetsa',
    name: 'FreeTSA',
    theirs: 'FreeTSA is a free RFC 3161 timestamp authority. Responses are instant and the format is understood by PDF signing and code signing tools, which matters when a workflow demands RFC 3161.',
    ours: 'An RFC 3161 token is only as good as one operator\'s signing key, and you must keep the token and the authority\'s certificates. FreeTSA replaced its signing certificate in March 2026, so checking an older token also means keeping the old certificate around. A Gridcoin Stamp sits in a public blockchain that no single party controls, and you keep only the file.',
  },
  {
    id: 'vs-proof-of-existence',
    name: 'Proof of Existence',
    theirs: 'Proof of Existence was one of the first blockchain notaries. It writes the document hash straight into a Bitcoin transaction, so the proof needs no extra file.',
    ours: 'Proof of Existence charges a bitcoin fee per document and broadcasts only after that payment confirms. Gridcoin Stamp works the same way on chain, with one hash in one transaction, but you pay nothing and there is no payment to wait for. It also has an API, a GitHub Action and an MCP server.',
  },
];
