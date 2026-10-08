const DATE_FORMAT = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' });

const messagesBody = document.querySelector('#messages-body');
const listStatus = document.querySelector('#list-status');

function createCell(text, className) {
  const cell = document.createElement('td');
  cell.textContent = text;
  if (className) {
    cell.className = className;
  }
  return cell;
}

function createRow(message) {
  const row = document.createElement('tr');
  row.append(
    createCell(DATE_FORMAT.format(new Date(message.created_at)), 'cell-date'),
    createCell(message.name),
    createCell(message.email),
    createCell(message.message, 'cell-message'),
    createCell(message.message_count, 'cell-count'),
  );
  return row;
}

function describeTotal(total) {
  if (total === 0) {
    return 'Aún no hay mensajes.';
  }
  return total === 1 ? '1 mensaje, del más reciente al más antiguo.' : `${total} mensajes, del más reciente al más antiguo.`;
}

async function loadMessages() {
  const response = await fetch('/api/contacts');

  if (response.status === 401) {
    listStatus.textContent = 'No tienes acceso. Recarga la página para identificarte.';
    return;
  }
  if (!response.ok) {
    listStatus.textContent = 'No pudimos cargar los mensajes. Intenta de nuevo más tarde.';
    return;
  }

  const messages = await response.json();
  messagesBody.replaceChildren(...messages.map(createRow));
  listStatus.textContent = describeTotal(messages.length);
}

loadMessages().catch(() => {
  listStatus.textContent = 'No hay conexión con el servidor. Intenta de nuevo.';
});