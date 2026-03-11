# Gridcoin Blockchain Stamp

**Free, secure, blockchain-based digital timestamping service.**

Gridcoin Blockchain Stamp allows anyone to create tamper-proof, publicly verifiable timestamps for documents and digital files — without uploading any data. Powered by the [Gridcoin](https://gridcoin.us/) blockchain.

**[Use the service](https://stamp.gridcoin.club)** | **[Learn more](https://stamp.gridcoin.club/about)** | **[Tor access](http://u4embjw2uzwpdubgm72ywbmixte4kqgwurc4r4rp6elhlokutdfsy4id.onion/)**

---

## What Is Gridcoin Blockchain Stamp?

Gridcoin Blockchain Stamp is an open-source document timestamping tool that proves a file existed at a specific point in time. It works by recording a cryptographic hash of your document on the Gridcoin blockchain — creating a permanent, immutable, and publicly verifiable proof of existence.

**Your files never leave your device.** The SHA-256 hash is computed entirely client-side in your browser. We do not store, upload, or access your documents — only the resulting hash is written to the blockchain.

## Key Features

- **Free to use** — No account required, no fees. The service is offered at zero cost.
- **Permanent proof links** — Every stamped document receives a unique, shareable [proof URL](https://stamp.gridcoin.club/proof/46f7e19d330eefcbed12cd909b98265a399bf9e44c032d9419a1a33888a4a1fc) that serves as lasting evidence of its existence.
- **Privacy-first** — No tracking pixels, no data collection. The only analytics tool used is [Plausible](https://plausible.io/), a privacy-friendly alternative to Google Analytics.
- **Open source** — Fully transparent codebase under the MIT license.
- **Tor accessible** — Available as a hidden service for users requiring additional anonymity.
- **Blockchain-secured** — Proofs are anchored to the Gridcoin blockchain, making them transparent, unalterable, and permanent.

## Use Cases

### Proof of Ownership
Confirm you created or possessed a document at a specific time — without revealing the document itself. Useful for intellectual property, creative works, and trade secrets.

### Document Timestamping
Establish a verifiable record that a contract, agreement, research paper, or any digital file existed before a certain date. Blockchain Stamp serves as a decentralized alternative to traditional trusted timestamping authorities.

### Data Integrity Verification
Detect even the smallest modification to a file. If a single bit changes, the hash will differ — allowing you to prove a document has remained unaltered since it was stamped.

### Legal Evidence
Blockchain timestamps can support legal claims by providing an independent, tamper-proof record of when a document was created. The decentralized nature of blockchain makes the proof independent of any single organization.

### Research and Academic Integrity
Researchers can timestamp datasets, manuscripts, and experimental results to establish priority and protect against disputes over originality.

## How It Works

### For Users

1. **Drag and drop** your file onto [stamp.gridcoin.club](https://stamp.gridcoin.club)
2. The SHA-256 hash is calculated **in your browser** — the file never leaves your device
3. The hash is recorded on the Gridcoin blockchain in a transaction
4. You receive a **permanent proof link** you can share or store as evidence
5. To **verify** a file later, simply drop it again — if the hash matches an existing stamp, the original timestamp is confirmed

### Protocol Details

Blockchain Stamp embeds document hashes in the Gridcoin blockchain using the `OP_RETURN` script opcode, which creates an unspendable transaction output encoding the hash.

**Transaction structure:**

6a46 5ea1ed 000001 \<hash1\> \<hash2\>


| Segment | Meaning |
|---------|---------|
| `6a46` | `OP_RETURN` script (hex) |
| `5ea1ed` | Magic bytes — reads as "Sealed" |
| `000001` | Protocol version (0.0.1, [semver](https://semver.org/)) |
| `<hash1>` | First SHA-256 hash (32 bytes) |
| `<hash2>` | Optional second SHA-256 hash |

Each transaction can store up to **two hashes**, reducing costs and improving efficiency.

**Cost per proof:** ~0.06 GRC (approximately 0.00000001 GRC burned + ~0.05 GRC transaction fee). All future protocol versions will maintain backward compatibility.

## Architecture

This is a monorepo managed with [Nx](https://nx.dev/), containing:

| Package | Description | Stack |
|---------|-------------|-------|
| `packages/frontend` | Web application and UI | [Next.js](https://nextjs.org/), TypeScript |
| `packages/backend` | API server, blockchain interaction, stamp processing | TypeScript, [Prisma](https://www.prisma.io/) |

### Tech Stack

- **Language:** TypeScript
- **Frontend:** Next.js
- **Backend:** Node.js with Prisma ORM
- **Blockchain:** Gridcoin (via [gridcoin-rpc](https://github.com/gridcat/gridcoin-rpc))
- **CI/CD:** CircleCI with semantic-release
- **Containerization:** Docker

## Getting Started

### Prerequisites

- Node.js 22+ (see `.nvmrc`)
- Docker (for local development)
- Access to a Gridcoin wallet node

### Installation

```bash
git clone https://github.com/gridcoin-community/stamp.gridcoin.club.git
cd stamp.gridcoin.club
npm install
```

## Development

Start development environment
```bash
docker-compose up
```

### Run tests
```bash
npm test
```

## Comparison With Other Timestamping Services

| Feature                      | Geidcoin Blockchain Stamp           | Traditional TSA           | Other Blockchain Services  |
|------------------------------|----------------------------|---------------------------|-----------------------------|
| Cost                         | Free                       | Paid                      | Varies                      |
| Account required             | No                         | Yes                       | Often                       |
| File uploaded to server      | No                         | Yes                       | Sometimes                   |
| Proof publicly verifiable    | Yes                        | No                        | Varies                      |
| Open source                  | Yes                        | No                        | Rarely                      |
| Blockchain anchored          | Yes (Gridcoin)            | No                        | Yes (various chains)       |
| Tor accessible               | Yes                        | No                        | Rarely                      |

---

## Contributing

Contributions are welcome. This project uses:

- Commitizen for conventional commits
- semantic-release for automated versioning
- CircleCI for continuous integration

Please open an issue before submitting a pull request for significant changes.

---

## Links

- **Live service:** [stamp.gridcoin.club](http://stamp.gridcoin.club)
- **Tor hidden service:** [u4embjw2uzwpdubgm72ywbmixte4kqgwurc4r4rp6elhlokutdfsy4id.onion](http://u4embjw2uzwpdubgm72ywbmixte4kqgwurc4r4rp6elhlokutdfsy4id.onion)
- **Gridcoin:** [gridcoin.us](http://gridcoin.us)
- **Gridcoin RPC client:** [gridcoin-rpc](http://gridcoin-rpc)

---

## License

MIT
