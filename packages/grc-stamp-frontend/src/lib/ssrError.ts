import type { ServerResponse } from 'node:http';

export function writeError(res: ServerResponse, status: number, body: string): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.write(body);
  res.end();
}

// Stack traces leak file paths and library internals — log them server-side
// only, return a generic body to the client.
export function writeServerError(
  res: ServerResponse,
  tag: string,
  label: string,
  err: unknown,
): void {
  const detail = err instanceof Error ? err.stack ?? err.message : String(err);
  console.error(`${tag} ${detail}`);
  writeError(res, 500, label);
}
