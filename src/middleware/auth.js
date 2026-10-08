import { verifyToken } from '../security/token.js';

const BEARER_PREFIX = 'Bearer ';

function readBearerToken(authorizationHeader) {
  if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
    return null;
  }
  return authorizationHeader.slice(BEARER_PREFIX.length);
}

export function requireAuth(req, res, next) {
  const token = readBearerToken(req.headers.authorization);
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Sesión no iniciada o expirada.' });
  }
  return next();
}