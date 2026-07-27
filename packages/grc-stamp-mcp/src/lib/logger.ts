// Minimal leveled logger that writes to STDERR only.
//
// This is critical for an stdio MCP server: STDOUT carries the JSON-RPC
// protocol stream, so a single stray write to stdout corrupts every message.
// All diagnostics therefore go to stderr, which the MCP host surfaces as
// server logs without touching the protocol channel.

type Level = 'debug' | 'info' | 'warn' | 'error';

const ORDER: Record<Level, number> = {
  debug: 0, info: 1, warn: 2, error: 3,
};

let threshold: number = ORDER.info;

export function setLogLevel(level: Level): void {
  threshold = ORDER[level] ?? ORDER.info;
}

function formatMeta(meta: unknown): string {
  if (meta instanceof Error) return meta.stack ?? meta.message;
  try {
    return JSON.stringify(meta);
  } catch {
    return String(meta);
  }
}

function emit(level: Level, message: string, meta?: unknown): void {
  if (ORDER[level] < threshold) return;
  const line = `[grc-stamp-mcp] ${level.toUpperCase()} ${message}`;
  if (meta !== undefined) {
    process.stderr.write(`${line} ${formatMeta(meta)}\n`);
  } else {
    process.stderr.write(`${line}\n`);
  }
}

export const logger = {
  debug: (message: string, meta?: unknown): void => emit('debug', message, meta),
  info: (message: string, meta?: unknown): void => emit('info', message, meta),
  warn: (message: string, meta?: unknown): void => emit('warn', message, meta),
  error: (message: string, meta?: unknown): void => emit('error', message, meta),
};
