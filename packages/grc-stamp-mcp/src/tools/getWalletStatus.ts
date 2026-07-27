import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ToolContext } from './context.js';
import { ok, fail } from './result.js';
import { logger } from '../lib/logger.js';

const outputSchema = {
  network: z.enum(['mainnet', 'testnet']),
  address: z.string(),
  balance: z.number(),
  effectiveBalance: z.number(),
  minimumBalance: z.number(),
  canStamp: z.boolean(),
};

const DESCRIPTION = [
  'Check whether the Gridcoin stamp service can currently accept new stamps.',
  'Returns the service wallet balance and a canStamp flag. Call this before stamp_document if you want to confirm the service is funded; if canStamp is false, stamping will be rejected until the wallet is topped up.',
].join(' ');

export function registerGetWalletStatus(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    'get_wallet_status',
    {
      title: 'Check Gridcoin stamp service availability',
      description: DESCRIPTION,
      inputSchema: {},
      outputSchema,
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async () => {
      try {
        const wallet = await ctx.client.getWallet();
        const canStamp = wallet.effectiveBalance >= wallet.minimumBalance;
        const summary = canStamp
          ? `The Gridcoin ${ctx.config.network} stamp service is funded and can accept new stamps.`
          : `The Gridcoin ${ctx.config.network} stamp service wallet is low (effective balance ${wallet.effectiveBalance}, minimum ${wallet.minimumBalance}) — stamping is currently unavailable.`;

        return ok(summary, {
          network: ctx.config.network,
          address: wallet.address,
          balance: wallet.balance,
          effectiveBalance: wallet.effectiveBalance,
          minimumBalance: wallet.minimumBalance,
          canStamp,
        });
      } catch (err) {
        logger.error('get_wallet_status failed', err);
        return fail(`Could not read the stamp service wallet: ${(err as Error).message}`);
      }
    },
  );
}
