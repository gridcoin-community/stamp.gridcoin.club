import { createLogger, format, transports } from 'winston';

const {
  combine, timestamp, prettyPrint,
} = format;

export const log = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    prettyPrint(),
  ),
  transports: [new transports.Console()],
});
