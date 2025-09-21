import HttpStatus from 'http-status-codes';
import express from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import { config } from './config';
import { ErrorModel } from './models/Error';
import { statusRouter } from './routes/status';
import { stampsRouter } from './routes/stamps';
import { walletRouter } from './routes/wallet';
import { hashesRouter } from './routes/hashes';
import { eventsRouter } from './routes/events';
import packageJson from '../package.json';
import { log } from './lib/log';

export const app = express();

// Set up port
app.set('port', config.PORT);

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

// 500 error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
  log.error(`Internal server error: ${err}`);
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .send({
      errors: [
        new ErrorModel(HttpStatus.NOT_FOUND, HttpStatus.getStatusText(HttpStatus.NOT_FOUND)),
      ],
    });
});

// Start web server using defined port
export const server = app.listen(app.get('port'), () => {
  log.info(`${packageJson.name} is running on port ${app.get('port')}`);
});
