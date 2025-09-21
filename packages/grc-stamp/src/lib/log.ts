import { createLogger, format, transports } from 'winston';

const console = new transports.Console();

const logFormatProduction = format.combine(
  format.timestamp(),
  format.prettyPrint(),
  format.json(),
);

const logFormatDevelopment = format.combine(
  format.colorize(),
  format.simple(),
);

const logFormat = process.env.NODE_ENV === 'production'
  ? logFormatProduction
  : logFormatDevelopment;

export const log = createLogger({
  level: 'debug',
  format: logFormat,
  transports: [console],
});

if (process.env.NODE_ENV === 'testing') {
  log.silent = true;
}
