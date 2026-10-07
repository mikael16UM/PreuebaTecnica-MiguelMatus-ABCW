import db from '../db.js';

const upsertContact = db.prepare(`
  INSERT INTO contacts (email, name)
  VALUES (@email, @name)
  ON CONFLICT (email) DO UPDATE SET name = excluded.name
  RETURNING contact_id
`);

const insertMessage = db.prepare(`
  INSERT INTO messages (contact_id, name, message)
  VALUES (@contact_id, @name, @message)
  RETURNING message_id, contact_id, created_at
`);

export const saveContactMessage = db.transaction(({ name, email, message }) => {
  const { contact_id } = upsertContact.get({ email, name });
  return insertMessage.get({ contact_id, name, message });
});