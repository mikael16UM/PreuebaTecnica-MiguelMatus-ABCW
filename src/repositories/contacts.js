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


const selectMessagesNewestFirst = db.prepare(`
  SELECT
    messages.message_id,
    messages.contact_id,
    messages.name,
    contacts.email,
    messages.message,
    messages.created_at,
    COUNT(*) OVER (PARTITION BY messages.contact_id) AS message_count
  FROM messages
  JOIN contacts USING (contact_id)
  ORDER BY messages.created_at DESC, messages.message_id DESC
`);

export function listMessages() {
  return selectMessagesNewestFirst.all();
}