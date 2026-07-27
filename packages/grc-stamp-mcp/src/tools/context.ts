import type { Config } from '../config.js';
import type { StampClient } from '../lib/stampClient.js';
import type { RateLimiter } from '../lib/rateLimiter.js';

/** Shared dependencies handed to every tool registrar. */
export interface ToolContext {
  client: StampClient;
  config: Config;
  // Shared limiter guarding stamp_document (the only GRC-spending tool).
  stampLimiter: RateLimiter;
  // Whether stamp_document may hash a local file path. Only true for the stdio
  // transport, where the client runs on the same machine. On the hosted HTTP
  // transport the caller is remote, so filePath is both meaningless and a
  // local-file-probe / CPU-DoS vector — it is refused there.
  allowFilePath: boolean;
}
