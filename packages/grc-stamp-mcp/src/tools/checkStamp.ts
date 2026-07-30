import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ToolContext } from './context.ts';
import { ok, fail } from './result.ts';
import { isSha256Hex } from '../lib/hash.ts';
import { formatUtc, isConfirmed } from '../lib/present.ts';
import { certificateUrl, proofUrl, txUrl } from '../lib/urls.ts';
import type { Stamp } from '../lib/stampClient.ts';
import { logger } from '../lib/logger.ts';

const inputSchema = {
  hash: z.string().optional()
    .describe('A SHA-256 hex digest (64 hex chars) to look up.'),
  id: z.string().optional()
    .describe('The numeric stamp id to look up (as returned by stamp_document).'),
};

const outputSchema = {
  found: z.boolean(),
  hash: z.string().optional(),
  id: z.string().optional(),
  network: z.enum(['mainnet', 'testnet']),
  confirmed: z.boolean(),
  block: z.number().optional(),
  tx: z.string().optional(),
  time: z.number().optional(),
  timeUtc: z.string().optional(),
  proofUrl: z.string().optional(),
  certificateUrl: z.string().optional(),
  txUrl: z.string().optional(),
};

const DESCRIPTION = [
  'Check whether a document has been timestamped on the Gridcoin blockchain and get its proof.',
  'Look up by hash (a SHA-256 digest) or by stamp id.',
  'When confirmed on-chain, returns the block, txid, UTC timestamp, the public proof page, the downloadable PDF certificate, and an explorer link. When still pending, returns the proof page and confirmed=false.',
].join(' ');

function present(ctx: ToolContext, stamp: Stamp) {
  const confirmed = isConfirmed(stamp);
  const explorer = txUrl(ctx.config, stamp.tx);
  const proof = proofUrl(ctx.config, stamp.hash);

  const structured: Record<string, unknown> = {
    found: true,
    hash: stamp.hash,
    id: stamp.id,
    network: ctx.config.network,
    confirmed,
    proofUrl: proof,
  };

  let summary: string;
  if (confirmed) {
    const cert = certificateUrl(ctx.config, stamp.hash);
    structured.block = stamp.block ?? undefined;
    structured.tx = stamp.tx ?? undefined;
    structured.time = stamp.time ?? undefined;
    structured.timeUtc = stamp.time != null ? formatUtc(stamp.time) : undefined;
    structured.certificateUrl = cert;
    if (explorer) structured.txUrl = explorer;
    summary = [
      `Confirmed on Gridcoin ${ctx.config.network}.`,
      `Hash: ${stamp.hash}`,
      stamp.time != null ? `Timestamped: ${formatUtc(stamp.time)}` : undefined,
      stamp.block != null ? `Block: ${stamp.block}` : undefined,
      stamp.tx ? `Tx: ${stamp.tx}` : undefined,
      `Proof page: ${proof}`,
      `Certificate (PDF): ${cert}`,
      explorer ? `Explorer: ${explorer}` : undefined,
    ].filter(Boolean).join('\n');
  } else {
    summary = [
      `Found on Gridcoin ${ctx.config.network} but not yet confirmed on-chain.`,
      `Hash: ${stamp.hash}`,
      `Proof page: ${proof}`,
      'The PDF certificate will be available once the stamp is confirmed (check again in a few minutes).',
    ].join('\n');
  }

  return ok(summary, structured);
}

export function registerCheckStamp(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    'check_stamp',
    {
      title: 'Check a Gridcoin stamp and get its proof',
      description: DESCRIPTION,
      inputSchema,
      outputSchema,
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (args) => {
      if (!args.hash && !args.id) return fail('Provide a hash or an id to look up.');
      if (args.hash && args.id) return fail('Provide either hash or id, not both.');
      if (args.hash && !isSha256Hex(args.hash)) {
        return fail('hash must be a 64-character hex SHA-256 digest.');
      }

      try {
        const stamp = args.hash
          ? await ctx.client.getByHash(args.hash.toLowerCase())
          : await ctx.client.getById(args.id as string);

        if (!stamp) {
          const what = args.hash ? `hash ${args.hash.toLowerCase()}` : `id ${args.id}`;
          return ok(`No stamp found for ${what} on Gridcoin ${ctx.config.network}.`, {
            found: false,
            network: ctx.config.network,
            confirmed: false,
          });
        }

        return present(ctx, stamp);
      } catch (err) {
        logger.error('check_stamp failed', err);
        return fail(`Could not look up the stamp: ${(err as Error).message}`);
      }
    },
  );
}
