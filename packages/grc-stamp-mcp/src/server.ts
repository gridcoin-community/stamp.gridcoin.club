import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Config } from './config.ts';
import { StampClient } from './lib/stampClient.ts';
import { RateLimiter } from './lib/rateLimiter.ts';
import type { ToolContext } from './tools/context.ts';
import { registerStampDocument } from './tools/stampDocument.ts';
import { registerCheckStamp } from './tools/checkStamp.ts';
import { registerGetWalletStatus } from './tools/getWalletStatus.ts';

function packageVersion(): string {
  try {
    const pkgUrl = new URL('../package.json', import.meta.url);
    const pkg = JSON.parse(readFileSync(fileURLToPath(pkgUrl), 'utf8'));
    return typeof pkg.version === 'string' ? pkg.version : '0.0.0';
  } catch {
    return '0.0.0';
  }
}

/**
 * Build the shared tool context (HTTP client + spend limiter) once. Under the
 * HTTP transport this is created a single time and reused across every request
 * so the stamp rate limiter bounds total spend, not per-connection spend.
 * `client` may be injected in tests.
 */
export function buildContext(config: Config, client?: StampClient): ToolContext {
  return {
    client: client ?? new StampClient(config.apiUrl),
    config,
    stampLimiter: new RateLimiter(config.maxStampsPerMinute),
    // Local file hashing only makes sense (and is only safe) when the client
    // runs on this machine — i.e. the stdio transport.
    allowFilePath: config.transport === 'stdio',
  };
}

/** Register all tools onto a fresh McpServer bound to a shared context. */
export function createServerFromContext(ctx: ToolContext): McpServer {
  const server = new McpServer(
    { name: 'grc-stamp-mcp', version: packageVersion() },
    {
      instructions: [
        'Tools to timestamp documents on the Gridcoin blockchain (proof-of-existence).',
        ctx.allowFilePath
          ? 'Documents are hashed locally with SHA-256 and only the hash is anchored on-chain. File contents never leave the machine. The service is free.'
          : 'Only SHA-256 hashes are anchored on-chain and stored. Document contents are never kept. The service is free.',
        `This server is anchored to the Gridcoin ${ctx.config.network} network.`,
      ].join(' '),
    },
  );

  registerStampDocument(server, ctx);
  registerCheckStamp(server, ctx);
  registerGetWalletStatus(server, ctx);

  return server;
}

/**
 * Build a self-contained MCP server (its own context) from config. Used by the
 * stdio transport and by tests; `client` may be injected.
 */
export function createServer(config: Config, client?: StampClient): McpServer {
  return createServerFromContext(buildContext(config, client));
}
