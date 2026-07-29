import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import path from 'node:path';
import { stat } from 'node:fs/promises';
import type { ToolContext } from './context.js';
import { ok, fail } from './result.js';
import {
  hashText, hashFile, isSha256Hex,
} from '../lib/hash.js';
import { isConfirmed } from '../lib/present.js';
import { certificateUrl, proofUrl, txUrl } from '../lib/urls.js';
import {
  InsufficientFundsError, RateLimitError, StampValidationError,
} from '../lib/stampClient.js';
import { logger } from '../lib/logger.js';

function makeInputSchema(allowFilePath: boolean) {
  const textNote = allowFilePath
    ? 'The text is SHA-256-hashed on this machine and never leaves it. Only the hash is sent.'
    : 'The text is sent to the hosted server, hashed, and discarded. Only the hash is stored. For sensitive content, precompute the sha256 and send that instead.';
  const base = {
    sha256: z.string().optional()
      .describe('A precomputed SHA-256 hex digest (64 hex chars). Use this when you already have the hash.'),
    text: z.string().optional()
      .describe(`Raw text to hash and stamp. ${textNote}`),
  };
  if (!allowFilePath) return base;
  return {
    ...base,
    filePath: z.string().optional()
      .describe('Absolute path to a local file to hash and stamp. The file is read and hashed on this machine and its bytes never leave it. Only the SHA-256 hash is sent.'),
  };
}

const outputSchema = {
  id: z.string(),
  hash: z.string(),
  network: z.enum(['mainnet', 'testnet']),
  status: z.enum(['pending', 'confirmed']),
  alreadyExisted: z.boolean(),
  proofUrl: z.string(),
  certificateUrl: z.string(),
  certificateAvailable: z.boolean(),
  txUrl: z.string().optional(),
};

// Guard against hashing special files (/dev/zero, FIFOs) that never end, and
// absurdly large regular files. The isFile() check is the real safety net; the
// size ceiling is belt-and-suspenders against a runaway read.
const MAX_FILE_BYTES = 5 * 1024 ** 3; // 5 GiB

function makeDescription(allowFilePath: boolean): string {
  const inputs = allowFilePath
    ? 'Provide exactly one of: sha256 (a precomputed digest), text, or filePath (a local file).'
    : 'Provide exactly one of: sha256 (a precomputed digest) or text.';
  const privacy = allowFilePath
    ? 'Computes a SHA-256 hash and anchors it on-chain. The document never leaves this machine. Only the hash is sent.'
    : 'Anchors a SHA-256 hash on-chain. The service stores only the hash.';
  return [
    'Timestamp a document on the Gridcoin blockchain (proof-of-existence / notarization).',
    `${privacy} Free, no payment required.`,
    inputs,
    'Returns a public proof-page URL immediately. The downloadable PDF certificate becomes available once the stamp is confirmed on-chain, usually within a few minutes. Poll check_stamp to get it.',
  ].join(' ');
}

async function resolveHash(
  args: { sha256?: string; text?: string; filePath?: string },
  allowFilePath: boolean,
): Promise<{ hash: string } | { error: string }> {
  // Guard first: on the hosted HTTP transport the caller is remote, so a
  // filePath would make this server read its own filesystem. Refuse it before
  // any counting or I/O.
  if (args.filePath !== undefined && !allowFilePath) {
    return { error: 'filePath is only supported by the local (stdio) server. Provide sha256 or text instead.' };
  }

  const provided = [args.sha256, args.text, args.filePath].filter((v) => v !== undefined);
  const inputList = allowFilePath ? 'sha256, text, or filePath' : 'sha256 or text';
  if (provided.length === 0) {
    return { error: `Provide one of: ${inputList}.` };
  }
  if (provided.length > 1) {
    return { error: `Provide exactly one of ${inputList}, not several.` };
  }

  if (args.sha256 !== undefined) {
    if (!isSha256Hex(args.sha256)) {
      return { error: 'sha256 must be a 64-character hex SHA-256 digest.' };
    }
    return { hash: args.sha256.toLowerCase() };
  }
  if (args.text !== undefined) {
    return { hash: hashText(args.text) };
  }

  const filePath = args.filePath as string;
  if (!path.isAbsolute(filePath)) {
    return { error: `filePath must be an absolute path, got: ${filePath}` };
  }
  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      return { error: `Not a regular file (will not hash directories, devices, or pipes): ${filePath}` };
    }
    if (stats.size > MAX_FILE_BYTES) {
      return { error: `File exceeds the ${MAX_FILE_BYTES}-byte limit: ${filePath}` };
    }
    return { hash: await hashFile(filePath) };
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === 'ENOENT') return { error: `File not found: ${filePath}` };
    if (code === 'EACCES') return { error: `Permission denied reading file: ${filePath}` };
    return { error: `Could not read file: ${(err as Error).message}` };
  }
}

export function registerStampDocument(server: McpServer, ctx: ToolContext): void {
  const { allowFilePath } = ctx;
  server.registerTool(
    'stamp_document',
    {
      title: 'Stamp a document on the Gridcoin blockchain',
      description: makeDescription(allowFilePath),
      inputSchema: makeInputSchema(allowFilePath),
      outputSchema,
      annotations: { readOnlyHint: false, openWorldHint: true },
    },
    async (args: { sha256?: string; text?: string; filePath?: string }) => {
      const resolved = await resolveHash(args, allowFilePath);
      if ('error' in resolved) return fail(resolved.error);
      const { hash } = resolved;

      // Local spend guard: each stamp burns GRC from a shared wallet.
      const gate = ctx.stampLimiter.tryAcquire();
      if (!gate.allowed) {
        return fail(`Local stamp rate limit reached (${ctx.config.maxStampsPerMinute}/min). Try again in ${gate.retryAfterSeconds}s.`);
      }

      try {
        const { stamp, created } = await ctx.client.createStamp(hash);
        const confirmed = isConfirmed(stamp);
        const proof = proofUrl(ctx.config, hash);
        const cert = certificateUrl(ctx.config, hash);
        const explorer = txUrl(ctx.config, stamp.tx);

        const summary = [
          created
            ? `Stamp queued on Gridcoin ${ctx.config.network}.`
            : `This hash was already stamped on Gridcoin ${ctx.config.network} (returning the existing record).`,
          `Hash: ${hash}`,
          `Proof page: ${proof}`,
          confirmed
            ? `Confirmed on-chain. Certificate: ${cert}`
            : 'Not yet confirmed on-chain. The PDF certificate becomes available in a few minutes. Call check_stamp with this hash to retrieve it.',
        ].join('\n');

        return ok(summary, {
          id: stamp.id,
          hash,
          network: ctx.config.network,
          status: confirmed ? 'confirmed' : 'pending',
          alreadyExisted: !created,
          proofUrl: proof,
          certificateUrl: cert,
          certificateAvailable: confirmed,
          ...(explorer ? { txUrl: explorer } : {}),
        });
      } catch (err) {
        if (err instanceof InsufficientFundsError) return fail(err.message);
        if (err instanceof RateLimitError) {
          const suffix = err.retryAfterSeconds ? ` Retry in ${err.retryAfterSeconds}s.` : '';
          return fail(`${err.message}${suffix}`);
        }
        if (err instanceof StampValidationError) return fail(err.message);
        logger.error('stamp_document failed', err);
        return fail(`Could not create the stamp: ${(err as Error).message}`);
      }
    },
  );
}
