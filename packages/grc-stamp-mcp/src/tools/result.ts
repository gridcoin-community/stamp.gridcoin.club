import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/** A successful tool result: a human-readable summary plus structured data. */
export function ok(summary: string, structured: Record<string, unknown>): CallToolResult {
  return {
    content: [{ type: 'text', text: summary }],
    structuredContent: structured,
  };
}

/** An error tool result: surfaced to the model as `isError` with a message. */
export function fail(message: string): CallToolResult {
  return {
    content: [{ type: 'text', text: message }],
    isError: true,
  };
}
