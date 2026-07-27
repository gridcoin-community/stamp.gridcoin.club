# grc-stamp-mcp

An [MCP](https://modelcontextprotocol.io) server for
[stamp.gridcoin.club](https://stamp.gridcoin.club). It lets any MCP-capable AI
agent timestamp documents on the Gridcoin blockchain (proof-of-existence /
notarization).

Files are hashed with SHA-256 **locally**; only the hash is anchored on-chain.
The document itself never leaves the machine. The service is free: no payment,
no account.

## Tools

| Tool | What it does |
|------|--------------|
| `stamp_document` | Hash a document (`sha256`, `text`, or a local `filePath`) and anchor it on-chain. Returns a public proof-page URL immediately. |
| `check_stamp` | Look up a stamp by `hash` or `id`. Once confirmed on-chain, returns block, txid, UTC time, the proof page, the PDF certificate, and an explorer link. |
| `get_wallet_status` | Report whether the service is funded and can currently accept stamps (`canStamp`). |

Every confirmed stamp gets a free, public
[proof page](https://stamp.gridcoin.club) and a downloadable, QR-embedded PDF
certificate. The tools return both URLs.

> The PDF certificate is generated only **after** the stamp is confirmed
> on-chain (a few minutes). `stamp_document` returns the proof URL right away;
> poll `check_stamp` to pick up the certificate once `confirmed` is true.

## Install & run

Runs over stdio, so any MCP client can launch it with `npx`:

```jsonc
// e.g. Claude Desktop / Cursor / Windsurf MCP config
{
  "mcpServers": {
    "gridcoin-stamp": {
      "command": "npx",
      "args": ["-y", "grc-stamp-mcp"]
    }
  }
}
```

### Configuration (env vars)

| Var | Default | Purpose |
|-----|---------|---------|
| `NETWORK` | `mainnet` | `mainnet` or `testnet`. Selects the default API / web / explorer URLs. |
| `STAMP_API_URL` | per-network | Override the grc-stamp JSON:API base URL. |
| `STAMP_WEB_URL` | per-network | Override the public stamp frontend base URL (proof pages / certificates). |
| `EXPLORER_TX_URL` | per-network | Explorer tx URL template; `[data]` is replaced with the txid. |
| `LOG_LEVEL` | `info` | `debug` \| `info` \| `warn` \| `error`. Logs go to **stderr** only. |
| `TRANSPORT` | `stdio` | `stdio` (local) or `http` (hosted remote, see below). |
| `PORT` | `7010` | TCP port for the HTTP transport. Ignored under stdio. |
| `MAX_STAMPS_PER_MINUTE` | `20` | Process-global cap on `stamp_document`. Each stamp burns GRC. |

To point at testnet:

```jsonc
{
  "mcpServers": {
    "gridcoin-stamp-testnet": {
      "command": "npx",
      "args": ["-y", "grc-stamp-mcp"],
      "env": { "NETWORK": "testnet" }
    }
  }
}
```

## Hosted remote server (HTTP)

The same server can run as a remote **Streamable HTTP** endpoint instead of
stdio. That is the transport hosted and browser-based MCP clients (like ChatGPT)
connect to. Turn it on with `TRANSPORT=http`:

```bash
TRANSPORT=http PORT=7010 NETWORK=mainnet npx grc-stamp-mcp
# serves POST /mcp  (and GET /health for liveness)
```

Point a remote MCP client at the `/mcp` URL:

```jsonc
{
  "mcpServers": {
    "gridcoin-stamp": {
      "url": "https://stamp.gridcoin.club/mcp"
    }
  }
}
```

Two differences from stdio:

- **`filePath` is not available.** A remote server can't read your local files,
  so hosted mode accepts only `sha256` and `text`. (stdio keeps `filePath`.)
- **It's rate-limited.** Every `stamp_document` call burns GRC from a shared
  wallet, so the endpoint caps stamps at `MAX_STAMPS_PER_MINUTE` and stops
  accepting when the service wallet runs low (`check_stamp` /
  `get_wallet_status` stay open).

## Develop

```bash
npm install
npm run build        # tsc -> dist/
npm test             # vitest + eslint + tsc --noEmit
npm run inspect      # launch the MCP Inspector against the built server
```

Made with ❤️ by [@gridcat](https://github.com/gridcat) · Part of
[Gridcoin Club](https://gridcoin.club)
