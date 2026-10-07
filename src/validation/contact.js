const NAME_LENGTH = { min: 2, max: 100 };
const MESSAGE_LENGTH = { min: 10, max: 1500 };
const EMAIL_MAX_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toTrimmedText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isLengthBetween(text, { min, max }) {
  return text.length >= min && text.length <= max;
}

function isValidEmail(email) {
  return email.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(email);
}

export function validateContact(input) {
  const values = {
    name: toTrimmedText(input?.name),
    email: toTrimmedText(input?.email).toLowerCase(),
    message: toTrimmedText(input?.message),
  };
  const errors = {};

  if (!isLengthBetween(values.name, NAME_LENGTH)) {
    errors.name = `El nombre debe tener entre ${NAME_LENGTH.min} y ${NAME_LENGTH.max} caracteres.`;
  }
  if (!isValidEmail(values.email)) {
    errors.email = 'El correo no tiene un formato válido.';
  }
  if (!isLengthBetween(values.message, MESSAGE_LENGTH)) {
    errors.message = `El mensaje debe tener entre ${MESSAGE_LENGTH.min} y ${MESSAGE_LENGTH.max} caracteres.`;
  }

  return { values, errors, isValid: Object.keys(errors).length === 0 };
}