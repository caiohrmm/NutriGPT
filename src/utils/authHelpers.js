function getCookieName() {
  return process.env.REFRESH_COOKIE_NAME || 'refreshToken';
}

function setAuthTokens(res, { accessToken, refreshToken }) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieName = getCookieName();
  if (refreshToken) {
    res.cookie(cookieName, refreshToken, {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
  if (accessToken) {
    const headerName = process.env.ACCESS_HEADER_NAME || 'x-access-token';
    res.setHeader(headerName, accessToken);
  }
}

function clearAuth(res) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieName = getCookieName();
  res.cookie(cookieName, '', {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 0,
    path: '/',
  });
}

module.exports = { setAuthTokens, clearAuth, getCookieName };


