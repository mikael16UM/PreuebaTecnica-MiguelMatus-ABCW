    import jwt from 'jsonwebtoken';

const TOKEN_ALGORITHM = 'HS256';
const TOKEN_DURATION = '1h';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Falta JWT_SECRET en las variables de entorno.');
  }
  return secret;
}

export function signToken(user) {
  return jwt.sign({ sub: String(user.user_id) }, getSecret(), {
    algorithm: TOKEN_ALGORITHM,
    expiresIn: TOKEN_DURATION,
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret(), { algorithms: [TOKEN_ALGORITHM] });
  } catch {
    return null;
  }
}