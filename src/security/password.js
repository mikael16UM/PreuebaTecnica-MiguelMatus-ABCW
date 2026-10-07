import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SALT_BYTES = 16;
const KEY_BYTES = 64;
const SEPARATOR = ':';

function deriveKey(password, salt) {
  return scryptSync(password, salt, KEY_BYTES);
}

export function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  const key = deriveKey(password, salt).toString('hex');
  return `${salt}${SEPARATOR}${key}`;
}

export function verifyPassword(password, passwordHash) {
  const [salt, storedKey] = passwordHash.split(SEPARATOR);
  const expectedKey = Buffer.from(storedKey, 'hex');
  const actualKey = deriveKey(password, salt);
  return actualKey.length === expectedKey.length && timingSafeEqual(actualKey, expectedKey);
}