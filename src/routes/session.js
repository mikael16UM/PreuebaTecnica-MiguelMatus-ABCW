import { Router } from 'express';

import { findUserByUsername } from '../repositories/users.js';
import { verifyPassword } from '../security/password.js';
import { signToken } from '../security/token.js';

const router = Router();

function findUserByCredentials(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string') {
    return null;
  }

  const user = findUserByUsername(username);
  return user && verifyPassword(password, user.password_hash) ? user : null;
}

router.post('/', (req, res) => {
  const user = findUserByCredentials(req.body?.username, req.body?.password);
  if (!user) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
  }

  return res.json({ token: signToken(user) });
});

export default router;