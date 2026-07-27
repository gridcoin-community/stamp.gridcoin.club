import express, {
  type Request, type Response, type NextFunction, type ErrorRequestHandler,
} from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Config } from './config.js';
import { buildContext, createServerFromContext } from './server.js';
import { logger } from './lib/logger.js';

// The hosted remote transport (Phase 2). Serves MCP over Streamable HTTP at
// POST /mcp in stateless mode: a fresh McpServer + transport per request, all
// sharing one tool context so the stamp spend-limiter is global. Statelessness
// keeps it horizontally scalable behind nginx with no session affinity.

const JSONRPC_ERROR = (message: string, code = -32000) => ({
  jsonrpc: '2.0' as const,
  error: { code, message },
  id: null,
});

export function startHttpServer(config: Config): Promise<void> {
  // One shared context (HTTP client + global spend limiter) for the process.
  const ctx = buildContext(config);

  const app = express();
  // Bodies are small JSON-RPC envelopes plus any inline `text` to hash. Cap
  // generously but bounded, so a giant body can't exhaust memory.
  app.use(express.json({ limit: '16mb' }));

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'grc-stamp-mcp', network: config.network });
  });

  app.post('/mcp', async (req: Request, res: Response) => {
    const server = createServerFromContext(ctx);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => {
      transport.close();
      server.close();
    });
    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      logger.error('MCP HTTP request failed', err);
      if (!res.headersSent) res.status(500).json(JSONRPC_ERROR('Internal server error', -32603));
    }
  });

  // Stateless mode has no server-initiated stream or session to tear down.
  const notAllowed = (_req: Request, res: Response) => res.status(405).json(JSONRPC_ERROR('Method not allowed.'));
  app.get('/mcp', notAllowed);
  app.delete('/mcp', notAllowed);

  // Body-parser failures (malformed JSON, body over the 16mb cap) throw before
  // the /mcp handler, so translate them into JSON-RPC errors rather than
  // leaking Express's default HTML error page.
  const errorHandler: ErrorRequestHandler = (err, _req, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err);
    const type = (err as { type?: string })?.type;
    if (type === 'entity.too.large') {
      return res.status(413).json(JSONRPC_ERROR('Request body too large.', -32600));
    }
    if (err instanceof SyntaxError || type === 'entity.parse.failed') {
      return res.status(400).json(JSONRPC_ERROR('Parse error: request body is not valid JSON.', -32700));
    }
    logger.error('unhandled HTTP error', err);
    return res.status(500).json(JSONRPC_ERROR('Internal server error', -32603));
  };
  app.use(errorHandler);

  return new Promise((resolve) => {
    const httpServer = app.listen(config.port, () => {
      logger.info(`grc-stamp-mcp HTTP transport on :${config.port}/mcp (network=${config.network}, api=${config.apiUrl})`);
      resolve();
    });
    const shutdown = () => httpServer.close(() => process.exit(0));
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  });
}
