import HttpStatus from 'http-status-codes';
import express, { ErrorRequestHandler } from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import { config } from './config';
import { ErrorModel } from './models/Error';
import { statusRouter } from './routes/status';
import { stampsRouter } from './routes/stamps';
import { walletRouter } from './routes/wallet';
import { hashesRouter } from './routes/hashes';
import { eventsRouter } from './routes/events';
import { indexerRouter } from './routes/indexer';
import packageJson from '../package.json';
import { log } from './lib/log';

export const app = express();

// Set up port
app.set('port', config.PORT);

// Behind a reverse proxy. With `trust proxy` set to a hop count, Express
// peels exactly that many entries off the right-hand side of the
// `X-Forwarded-For` header to derive `req.ip` — i.e. the IP that the
// last-trusted proxy saw as the client. Setting it too high (or `true`)
// would let clients spoof their IP by injecting fake X-F-F entries on the
// way in, defeating the per-IP rate limiter and SSE caps.
//
// nginx must be configured with
//   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
// so it appends the real client IP to the chain rather than overwriting it.
app.set('trust proxy', Number(config.TRUST_PROXY_HOPS));

// Express 5 changed the default query parser from "extended" (qs) to "simple"
// (node:querystring), which does NOT understand JSON:API bracket syntax like
// page[size]=5 or filter[block][gt]=0. Restore the qs-backed parser so nested
// query params produce a nested object in req.query.
app.set('query parser', 'extended');

// Set up middleware

// Set up body parser in order to get post values
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(express.json());

// Disable x-powered by
app.disable('x-powered-by');

// Allow to override PUT and DELETE methods using custom header
app.use(methodOverride('X-HTTP-Method-Override'));

// Access logs
if (!config.isTesting) {
  app.use(morgan('combined'));
}

// Set up default content type
app.use((req, res, next) => {
  res.header('Content-Type', 'application/vnd.api+json; charset=utf-8');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH');
  res.header(
    'Access-Control-Allow-Headers',
    'x-forwarded-proto,Accept,DNT,X-CustomHeader,Keep-Alive,User-Agent,'
    + 'X-Requested-With,If-Modified-Since,Cache-Control,Content-Type',
  );
  next();
});

// Routers

/**
 * URL path: /status
 *
 * just the usual status call for this service
 */
app.use('/status', statusRouter);
app.use('/stamps', stampsRouter);
app.use('/wallet', walletRouter);
app.use('/hashes', hashesRouter);
app.use('/events', eventsRouter);
app.use('/indexer', indexerRouter);

// Not found error handling
app.use((req, res) => {
  log.warn(`Not found URL: ${req.url}`);
  res
    .status(HttpStatus.NOT_FOUND)
    .send({
      errors: [
        new ErrorModel(HttpStatus.NOT_FOUND, HttpStatus.getStatusText(HttpStatus.NOT_FOUND)),
      ],
    });
});

// 500 error handling — catches any error forwarded via next(err), including
// rejections from async route handlers wrapped with asyncHandler(). Express
// identifies error middleware by arity, so the 4th `next` param must stay.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  log.error(`Internal server error: ${err && err.stack ? err.stack : err}`);
  if (res.headersSent) {
    return;
  }
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .send({
      errors: [
        new ErrorModel(
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
        ),
      ],
    });
};
app.use(errorHandler);

// Start web server using defined port
export const server = app.listen(app.get('port'), () => {
  log.info(`${packageJson.name} is running on port ${app.get('port')}`);
});
