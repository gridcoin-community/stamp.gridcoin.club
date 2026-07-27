import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

const SHA256_HEX = /^[a-fA-F0-9]{64}$/;

/** True if `value` is a syntactically valid lowercase-or-uppercase SHA-256 hex digest. */
export function isSha256Hex(value: string): boolean {
  return SHA256_HEX.test(value);
}

/** SHA-256 hex digest of a UTF-8 string. */
export function hashText(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * SHA-256 hex digest of a local file, computed by streaming so arbitrarily
 * large files never load fully into memory. The file is read but its bytes are
 * never sent anywhere — only the resulting hash leaves this process.
 */
export async function hashFile(filePath: string): Promise<string> {
  const hash = createHash('sha256');
  await pipeline(createReadStream(filePath), hash);
  return hash.digest('hex');
}
