import type { LoggerOptions } from 'pino';
import type { LoggerConfig } from './types';

export const getLoggerConfig = (): LoggerConfig => ({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  isDevelopment: process.env.NODE_ENV !== 'production',
  redact: [
    'password',
    'token',
    'authorization',
    'cookie',
    'access_token',
    'refresh_token',
    'api_key',
    'secret',
    'private_key',
    'credit_card',
    'ssn',
    'phone',
  ],
});

export const getPinoConfig = (config: LoggerConfig): LoggerOptions => {
  const baseConfig: LoggerOptions = {
    level: config.level,
    redact: {
      paths: config.redact,
      remove: true,
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    formatters: {
      level: (label) => ({
        level: label,
      }),
    },
    // Remove pid and hostname from logs completely
    base: undefined,
    serializers: {
      error: (err: Error) => ({
        type: err.constructor.name,
        message: err.message,
        stack: err.stack,
      }),
      req: (req: any) => ({
        method: req.method,
        url: req.url,
        headers: {
          'content-type': req.headers['content-type'],
        },
      }),
      res: (res: any) => ({
        statusCode: res.statusCode,
        headers: {
          'content-type': res.getHeader?.('content-type'),
        },
      }),
    },
  };

  if (config.isDevelopment) {
    return {
      ...baseConfig,
      // Use JSON logging in development to avoid Next.js worker thread issues
      // pino-pretty transport causes issues with Next.js worker threads
    };
  }

  return baseConfig;
};
