import assert from 'node:assert/strict';
import { once } from 'node:events';
import { after, before, test } from 'node:test';

const TEST_USER = 'test-admin';
const TEST_PASSWORD = 'test-password';

process.env.DATABASE_PATH = ':memory:';
process.env.ADMIN_USER = TEST_USER;
process.env.ADMIN_PASSWORD = TEST_PASSWORD;

const { default: app } = await import('../src/app.js');
const { seedFirstUser } = await import('../src/seedFirstUser.js');

const AUTH_HEADER = `Basic ${Buffer.from(`${TEST_USER}:${TEST_PASSWORD}`).toString('base64')}`;

let server;
let contactsUrl;

before(async () => {
  seedFirstUser();
  server = app.listen(0);
  await once(server, 'listening');
  contactsUrl = `http://localhost:${server.address().port}/api/contacts`;
});

after(() => {
  server.closeAllConnections();
  server.close();
});

function postContact(body) {
  return fetch(contactsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function listMessages() {
  const response = await fetch(contactsUrl, { headers: { Authorization: AUTH_HEADER } });
  return response.json();
}

test('guarda un contacto válido y lo muestra en el listado', async () => {
  const response = await postContact({
    name: 'Ana López',
    email: 'Ana@Example.com',
    message: 'Hola, quiero una cotización.',
  });
  const saved = await response.json();
  const messages = await listMessages();

  assert.equal(response.status, 201);
  assert.ok(saved.message_id);
  assert.equal(messages[0].message_id, saved.message_id);
  assert.equal(messages[0].email, 'ana@example.com');
});

test('rechaza un correo inválido con 422 y el error del campo', async () => {
  const response = await postContact({
    name: 'Luis Pérez',
    email: 'correo-sin-arroba',
    message: 'Mensaje con longitud suficiente.',
  });
  const body = await response.json();

  assert.equal(response.status, 422);
  assert.deepEqual(Object.keys(body.errors), ['email']);
});

test('rechaza un envío vacío con un error por cada campo', async () => {
  const response = await postContact({});
  const body = await response.json();

  assert.equal(response.status, 422);
  assert.deepEqual(Object.keys(body.errors), ['name', 'email', 'message']);
});

test('agrupa en un solo contacto los envíos del mismo correo', async () => {
  await postContact({ name: 'Eva R.', email: 'eva@example.com', message: 'Primer mensaje de Eva.' });
  await postContact({ name: 'Eva Ruiz', email: 'EVA@example.com', message: 'Segundo mensaje de Eva.' });

  const fromEva = (await listMessages()).filter((message) => message.email === 'eva@example.com');

  assert.equal(fromEva.length, 2);
  assert.equal(fromEva[0].contact_id, fromEva[1].contact_id);
  assert.deepEqual(fromEva.map((message) => message.message_count), [2, 2]);
  assert.deepEqual(fromEva.map((message) => message.name), ['Eva Ruiz', 'Eva R.']);
});

test('niega el listado sin credenciales', async () => {
  const response = await fetch(contactsUrl);

  assert.equal(response.status, 401);
});