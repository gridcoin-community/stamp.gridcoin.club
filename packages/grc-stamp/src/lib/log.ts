import { createLogger, format, transports } from 'winston';

const {
  combine, timestamp, prettyPrint,
} = format;

const console = new transports.Console();

export const log = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    prettyPrint(),
  ),
  transports: [console],
});

if (process.env.NODE_ENV === 'testing') {
  log.silent = true;
}
