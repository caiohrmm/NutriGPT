const jwt = require('jsonwebtoken');
const { signTokens, verifyRefresh } = require('../utils/jwt');
const { setAuthTokens, getCookieName } = require('../utils/authHelpers');

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
      // Try auto-refresh using httpOnly cookie
      try {
        const cookieName = getCookieName();
        const rt = req.cookies && (req.cookies[cookieName] || req.cookies.rt);
        if (!rt) throw new Error('no-rt');
        const payload = verifyRefresh(rt);
        const { accessToken, refreshToken } = signTokens({ sub: payload.sub, role: payload.role });
        setAuthTokens(res, { accessToken, refreshToken });
        req.user = { id: payload.sub, role: payload.role };
        return next();
      } catch (_e2) {
        return res.status(401).json({ message: 'Token inválido' });
      }
    }
  };
}

module.exports = { auth };


