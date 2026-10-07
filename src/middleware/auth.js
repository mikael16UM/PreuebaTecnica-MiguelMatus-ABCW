import { findUserByUsername } from '../repositories/users.js';
import { verifyPassword } from '../security/password.js';

const BASIC_PREFIX = 'Basic ';
const CHALLENGE = 'Basic realm="Admin", charset="UTF-8"';

function readCredentials(authorizationHeader) {
  if (!authorizationHeader?.startsWith(BASIC_PREFIX)) {
    return null;
  }

  const encoded = authorizationHeader.slice(BASIC_PREFIX.length);
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex === -1) {
    return null;
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  };
}

function areValidCredentials(credentials) {
  if (!credentials) {
    return false;
  }

  const user = findUserByUsername(credentials.username);
  return Boolean(user) && verifyPassword(credentials.password, user.password_hash);
}

export function requireAuth(req, res, next) {
  const credentials = readCredentials(req.headers.authorization);
  if (!areValidCredentials(credentials)) {
    res.set('WWW-Authenticate', CHALLENGE);
    return res.status(401).json({ error: 'Credenciales requeridas o incorrectas.' });
  }

  return next();
}