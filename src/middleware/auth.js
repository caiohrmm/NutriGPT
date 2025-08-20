const jwt = require('jsonwebtoken');

function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      if (required) return res.status(401).json({ message: 'Token ausente' });
      return next();
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] });
      req.user = { id: payload.sub, role: payload.role };
      return next();
    } catch (_err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  };
}

module.exports = { auth };


