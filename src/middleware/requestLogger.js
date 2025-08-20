const { v4: uuid } = require('uuid');
const onFinished = require('on-finished');
const { logger } = require('../utils/logger');

function requestLogger() {
  return (req, res, next) => {
    const startHrTime = process.hrtime.bigint();
    const requestId = req.headers['x-request-id'] || uuid();
    req.id = requestId;
    res.setHeader('x-request-id', requestId);

    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString();
    const logData = {
      req: {
        id: requestId,
        method: req.method,
        url: req.originalUrl || req.url,
        ip,
        headers: {
          'user-agent': req.headers['user-agent'],
          'content-type': req.headers['content-type'],
          'accept': req.headers['accept'],
        },
      },
    };

    logger.info(logData, 'request.start');

    onFinished(res, () => {
      const endHrTime = process.hrtime.bigint();
      const durationMs = Number(endHrTime - startHrTime) / 1e6;
      const responseData = {
        req: { id: requestId },
        res: {
          statusCode: res.statusCode,
          contentLength: res.getHeader('content-length'),
        },
        durationMs: Math.round(durationMs),
      };
      const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
      logger[level](responseData, 'request.end');
    });

    next();
  };
}

module.exports = { requestLogger };


