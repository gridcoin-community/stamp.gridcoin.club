#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { createServer } from './server.js';
import { startHttpServer } from './http.js';
import { logger, setLogLevel } from './lib/logger.js';

async function main(): Promise<void> {
  const config = loadConfig();
  setLogLevel(config.logLevel);

  if (config.transport === 'http') {
    await startHttpServer(config);
    return;
  }

  const server = createServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info(`grc-stamp-mcp started on stdio (network=${config.network}, api=${config.apiUrl})`);
}

main().catch((err) => {
  logger.error('fatal startup error', err);
  process.exit(1);
});
