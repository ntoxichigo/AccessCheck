// Server-side logger utility
// Do NOT add 'use server' directive - this is a utility module, not a server action

import winston from 'winston';

// Custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// Custom log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: [
    // Write logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
    // File transports only in Node.js server environment
    ...(typeof window === 'undefined' ? [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: 'logs/all.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
    ] : []),
  ],
});

// Log unhandled exceptions and rejections (server-only)
if (typeof window === 'undefined') {
  logger.exceptions.handle(
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  );
  logger.rejections.handle(
    new winston.transports.File({ filename: 'logs/rejections.log' })
  );
}

export interface LogContext {
  userId?: string;
  url?: string;
  scanId?: string;
  error?: Error;
  [key: string]: unknown;
}

export const log = {
  error: (message: string, context?: LogContext) => {
    logger.error(message, context);
  },
  warn: (message: string, context?: LogContext) => {
    logger.warn(message, context);
  },
  info: (message: string, context?: LogContext) => {
    logger.info(message, context);
  },
  http: (message: string, context?: LogContext) => {
    logger.http(message, context);
  },
  debug: (message: string, context?: LogContext) => {
    logger.debug(message, context);
  },
};