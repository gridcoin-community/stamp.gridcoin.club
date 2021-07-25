import HttpStatus from 'http-status-codes';
import express from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import { config } from './config';
import { ErrorModel } from './models/Error';
import { statusRouter } from './routes/status';
import packageJson from '../package.json';
// const { makesRouter } = require('./routes/makes');
// const models = require('./routes/models');
// const vehicles = require('./routes/vehicles');
// const { categoriesRouter } = require('./routes/categories');
// const { baseRouter } = require('./routes/base');
// const { trimsRouter } = require('./routes/trims');
// const { enginesRouter } = require('./routes/engines');
// const { partsRouter } = require('./routes/parts');

// const logger = logmodule(module, config);
const app = express();

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
  res.header('Access-Control-Allow-Headers',
    'x-forwarded-proto,Accept,DNT,X-CustomHeader,Keep-Alive,User-Agent,'
    + 'X-Requested-With,If-Modified-Since,Cache-Control,Content-Type');
  next();
});

// Routers

/**
 * URL path: /status
 *
 * just the usual status call for this service
 */
app.use('/status', statusRouter);

/**
 * URL path: /makes
 */
// app.use('/makes', makesRouter);
// app.use('/years', yearsRouter);
// app.use('/models', models);
// app.use('/vehicles', vehicles);
// app.use('/parts', partsRouter);
// app.use('/base', baseRouter);
// app.use('/trims', trimsRouter);
// app.use('/engines', enginesRouter);
// app.use('/categories', categoriesRouter);

// Not found error handling
/* eslint-disable no-unused-vars */
app.use((req, res) => {
  console.warn(`Not found URL: ${req.url}`);
  res
    .status(HttpStatus.NOT_FOUND)
    .send({
      errors: [
        new ErrorModel(HttpStatus.NOT_FOUND, HttpStatus.getStatusText(HttpStatus.NOT_FOUND)),
      ],
    });
});

// 500 error handling
app.use((err, req, res, next) => {
  console.error(`Internal server error: ${err}`);
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .send({
      errors: [
        new ErrorModel(HttpStatus.NOT_FOUND, HttpStatus.getStatusText(HttpStatus.NOT_FOUND)),
      ],
    });
});
/* eslint-enable no-unused-vars */

// Express error logging
app.on('error', (err) => {
  console.error(`Express: ${err}`);
});

// Start web server using defined port
app.listen(app.get('port'), () => {
  console.info(`${packageJson.name} is running on port ${app.get('port')}`);
});

module.exports = app;
