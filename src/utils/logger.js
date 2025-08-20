const pino = require('pino');

const isProduction = (process.env.NODE_ENV === 'production');

const transport = !isProduction
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        singleLine: false,
        ignore: 'pid,hostname',
      },
    }
  : undefined;

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'body.password',
      'body.token',
      'body.accessToken',
      'body.refreshToken',
      'body.authorization',
    ],
    remove: true,
  },
  ...(transport ? { transport } : {}),
});

module.exports = { logger };


