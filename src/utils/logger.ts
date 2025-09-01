import { createLogger, transports, format } from 'winston';
import { env } from '../commons/env.js';
const { combine, timestamp, prettyPrint, errors } = format;

const defaultLogLevel = env.LOG_LEVEL;
const errorLogLevel = 'warn';

const devTransports = new transports.Console({
  level: defaultLogLevel,
});

const prodTransports = [
  new transports.Console({
    level: defaultLogLevel,
  }),

  new transports.File({
    filename: 'logs/combined.log',
    level: defaultLogLevel,
  }),

  new transports.File({
    filename: 'logs/errors.log',
    level: errorLogLevel,
  }),
];

const logTransports =
  env.NODE_ENV === 'test'
    ? []
    : env.NODE_ENV === 'production'
      ? prodTransports
      : devTransports;

export const logger = createLogger({
  transports: logTransports,
  format: combine(errors({ stack: true }), timestamp(), prettyPrint()),
  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'logs/rejections.log' })],
});