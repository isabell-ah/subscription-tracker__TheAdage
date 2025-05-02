// arcjet.middleware.js
const arcjetPromise = require('../config/arcjet');

const arcjetMiddleware = async (req, res, next) => {
  try {
    const arcjet = await arcjetPromise;
    const decision = await arcjet.protect({
      request: {
        ip: req.ip,
        headers: req.headers,
        method: req.method,
        url: req.url,
        body: req.body,
      },
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return res.status(429).json({ error: 'Rate limit exceeded' });
      if (decision.reason.isBot())
        return res.status(403).json({ error: 'Bot detected' });
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    console.log(`Arcjet Middleware Error: ${error}`);
    next(error);
  }
};

module.exports = arcjetMiddleware;
