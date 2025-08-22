import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({ handleExceptions: true }),
    new transports.File({ filename: 'logs/error.log', level: 'error', handleExceptions: true }),
    new transports.File({ filename: 'logs/combined.log' })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ],
  exitOnError: false
});

export default logger;