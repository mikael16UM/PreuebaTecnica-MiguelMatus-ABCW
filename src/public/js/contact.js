const NAME_LENGTH = { min: 2, max: 100 };
const MESSAGE_LENGTH = { min: 10, max: 1500 };
const EMAIL_MAX_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTER_WARNING_RATIO = 0.9;
const FIELD_NAMES = ['name', 'email', 'message'];

const form = document.querySelector('#contact-form');
const submitButton = document.querySelector('#submit-button');
const formStatus = document.querySelector('#form-status');
const messageCounter = document.querySelector('#message-counter');

function readValues() {
  return {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    message: form.elements.message.value.trim(),
  };
}

function isLengthBetween(text, { min, max }) {
  return text.length >= min && text.length <= max;
}

function validate(values) {
  const errors = {};

  if (!isLengthBetween(values.name, NAME_LENGTH)) {
    errors.name = `El nombre debe tener entre ${NAME_LENGTH.min} y ${NAME_LENGTH.max} caracteres.`;
  }
  if (values.email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(values.email)) {
    errors.email = 'El correo no tiene un formato válido.';
  }
  if (!isLengthBetween(values.message, MESSAGE_LENGTH)) {
    errors.message = `El mensaje debe tener entre ${MESSAGE_LENGTH.min} y ${MESSAGE_LENGTH.max} caracteres.`;
  }

  return errors;
}

function showErrors(errors) {
  for (const fieldName of FIELD_NAMES) {
    const errorMessage = errors[fieldName] ?? '';
    document.querySelector(`#${fieldName}-error`).textContent = errorMessage;
    form.elements[fieldName].closest('.field').classList.toggle('field--invalid', errorMessage !== '');
  }
}

function showStatus(text, state) {
  formStatus.textContent = text;
  formStatus.className = state ? `form-status form-status--${state}` : 'form-status';
}

function updateCounter() {
  const length = form.elements.message.value.length;
  const isAtLimit = length >= MESSAGE_LENGTH.max;
  const isNearLimit = length >= MESSAGE_LENGTH.max * COUNTER_WARNING_RATIO;

  messageCounter.textContent = `${length} / ${MESSAGE_LENGTH.max}`;
  messageCounter.classList.toggle('counter--limit', isAtLimit);
  messageCounter.classList.toggle('counter--warning', isNearLimit && !isAtLimit);
}

async function sendContact(values) {
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (response.status === 201) {
    form.reset();
    updateCounter();
    showStatus('¡Gracias! Recibimos tu mensaje.', 'success');
    return;
  }

  if (response.status === 422) {
    const { errors } = await response.json();
    showErrors(errors);
    showStatus('Revisa los campos marcados.', 'error');
    return;
  }

  showStatus('No pudimos guardar tu mensaje. Intenta de nuevo más tarde.', 'error');
}

async function handleSubmit(event) {
  event.preventDefault();

  const values = readValues();
  const errors = validate(values);
  showErrors(errors);
  if (Object.keys(errors).length > 0) {
    showStatus('Revisa los campos marcados.', 'error');
    return;
  }

  submitButton.disabled = true;
  showStatus('Enviando…');
  try {
    await sendContact(values);
  } catch {
    showStatus('No hay conexión con el servidor. Intenta de nuevo.', 'error');
  } finally {
    submitButton.disabled = false;
  }
}

form.addEventListener('submit', handleSubmit);
form.elements.message.addEventListener('input', updateCounter);
updateCounter();