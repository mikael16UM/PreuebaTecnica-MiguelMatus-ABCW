import { createUser, hasUsers } from './repositories/users.js';
import { hashPassword } from './security/password.js';

export function seedFirstUser() {
  if (hasUsers()) {
    return;
  }

  const username = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    console.warn('[seed] Sin ADMIN_USER o ADMIN_PASSWORD: no se creó ningún usuario.');
    return;
  }

  createUser({ username, password_hash: hashPassword(password) });
  console.log(`[seed] Usuario inicial creado: ${username}`);
}