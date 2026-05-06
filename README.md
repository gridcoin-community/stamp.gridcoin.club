# Gridcoin Blockchain Stamp

Free, blockchain-backed document timestamping. Files never leave your browser. Only the SHA-256 hash gets written to the Gridcoin chain.

[Use it](https://stamp.gridcoin.club) | [How it works](https://stamp.gridcoin.club/about) | [Tor mirror](http://u4embjw2uzwpdubgm72ywbmixte4kqgwurc4r4rp6elhlokutdfsy4id.onion/)

---

## What it does

Drop a file in the browser. Your browser computes a SHA-256 hash locally, then writes that hash to the Gridcoin blockchain in an `OP_RETURN` transaction. You get back a permanent proof URL.

The file itself never uploads. We can't read your documents because we never see them. The only thing that hits our server is the hash, and from there it goes straight on-chain.

Running in production since October 2021.

## Why use it

- Free. No signup, no fees, no API key.
- Permanent, shareable proof URLs (e.g. [this one](https://stamp.gridcoin.club/proof/46f7e19d330eefcbed12cd909b98265a399bf9e44c032d9419a1a33888a4a1fc)).
- No tracking pixels. The only analytics tool is [Plausible](https://plausible.io/), which doesn't follow you around.
- MIT-licensed, fully open source.
- Reachable over Tor.
- Anchored on the Gridcoin chain, so the timestamp survives even if we don't.

## What people use it for

Proof of authorship. Show you had a file on a given date without revealing what's in it. Useful for IP, draft work, trade secrets.

Document timestamping. A drop-in alternative to a paid TSA. Same idea (hash plus signed time), except the signer is the blockchain.

Tamper detection. Flip a single bit and the hash changes. So if a file's hash still matches an old stamp, the file hasn't been touched.

Legal evidence. Decentralized timestamps don't depend on any one company sticking around to vouch for them.

Research priority. Stamp a manuscript or dataset before you submit. If a dispute comes up later, you have an on-chain record of when you had it.

## How it works

For users:

1. Drop a file at [stamp.gridcoin.club](https://stamp.gridcoin.club).
2. Your browser hashes it. The file does not upload.
3. The hash is written to the Gridcoin blockchain.
4. You get a proof URL. Bookmark it, share it, send it to a lawyer.
5. To verify later, drop the same file again. If the hash matches, the original timestamp is confirmed.

### Protocol

Hashes go on-chain inside an `OP_RETURN` output:

```
6a46 5ea1ed 000001 <hash1> <hash2>
```

| Segment | Meaning |
|---------|---------|
| `6a46` | `OP_RETURN` opcode (hex) |
| `5ea1ed` | Magic bytes, reads as "Sealed" |
| `000001` | Protocol version (0.0.1, [semver](https://semver.org/)) |
| `<hash1>` | SHA-256 hash (32 bytes) |
| `<hash2>` | Optional second SHA-256 hash |

Two hashes per transaction, which halves the cost.

Cost per proof: about 0.06 GRC (a tiny burn plus the standard ~0.05 GRC fee). Future protocol versions stay backward compatible.

## Repo layout

[Nx](https://nx.dev/) monorepo:

| Package | What it does | Stack |
|---------|-------------|-------|
| `packages/grc-stamp` | API, scraper, blockchain interaction | TypeScript, Express, Kysely, MariaDB |
| `packages/grc-stamp-frontend` | Web UI | Next.js, TypeScript, MUI |

Other tooling: Gridcoin RPC client ([gridcoin-rpc](https://github.com/gridcat/gridcoin-rpc)), CircleCI plus semantic-release for releases, Docker for the runtime.

## Getting started

You'll need:

- Node 22+ (see `.nvmrc`)
- Docker
- A Gridcoin wallet node it can talk to

```bash
git clone https://github.com/gridcoin-community/stamp.gridcoin.club.git
cd stamp.gridcoin.club
npm install
```

Boot the dev stack:

```bash
docker-compose up
```

Run tests:

```bash
npm test
```

## How it stacks up

| | Gridcoin Stamp | Traditional TSA | Other blockchain services |
|--|--|--|--|
| Cost | Free | Paid | Varies |
| Account required | No | Yes | Often |
| File uploaded | No | Yes | Sometimes |
| Publicly verifiable | Yes | No | Varies |
| Open source | Yes | No | Rarely |
| Blockchain-anchored | Yes (Gridcoin) | No | Yes (various) |
| Tor accessible | Yes | No | Rarely |

## Contributing

PRs welcome. The repo uses Commitizen for conventional commits and semantic-release for versioning, so commit messages matter. For anything substantial, open an issue first.

## Links

- Live service: [stamp.gridcoin.club](https://stamp.gridcoin.club)
- Tor mirror: [u4embjw2uzwpdubgm72ywbmixte4kqgwurc4r4rp6elhlokutdfsy4id.onion](http://u4embjw2uzwpdubgm72ywbmixte4kqgwurc4r4rp6elhlokutdfsy4id.onion)
- Gridcoin: [gridcoin.us](https://gridcoin.us)
- Gridcoin RPC client: [github.com/gridcat/gridcoin-rpc](https://github.com/gridcat/gridcoin-rpc)

## License

MIT

---

<p align="center">Made with ❤️ by @gridcat</p>
