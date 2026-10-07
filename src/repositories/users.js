import db from '../db.js';

const countAllUsers = db.prepare('SELECT COUNT(*) AS total FROM users');

const selectUserByUsername = db.prepare(`
  SELECT user_id, username, password_hash
  FROM users
  WHERE username = @username
`);

const insertUser = db.prepare(`
  INSERT INTO users (username, password_hash)
  VALUES (@username, @password_hash)
`);

export function hasUsers() {
  return countAllUsers.get().total > 0;
}

export function findUserByUsername(username) {
  return selectUserByUsername.get({ username });
}

export function createUser({ username, password_hash }) {
  insertUser.run({ username, password_hash });
}