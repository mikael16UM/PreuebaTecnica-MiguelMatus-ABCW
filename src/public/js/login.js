import { saveToken } from './token.js';

const form = document.querySelector('#login-form');
const loginButton = document.querySelector('#login-button');
const loginStatus = document.querySelector('#login-status');

async function logIn(username, password) {
  const response = await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const { token } = await response.json();
    saveToken(token);
    window.location.assign('/admin');
    return;
  }

  loginStatus.textContent = response.status === 401
    ? 'Usuario o contraseña incorrectos.'
    : 'No pudimos iniciar sesión. Intenta de nuevo más tarde.';
}

async function handleSubmit(event) {
  event.preventDefault();

  const username = form.elements.username.value.trim();
  const password = form.elements.password.value;
  if (!username || !password) {
    loginStatus.textContent = 'Escribe tu usuario y tu contraseña.';
    return;
  }

  loginButton.disabled = true;
  loginStatus.textContent = '';
  try {
    await logIn(username, password);
  } catch {
    loginStatus.textContent = 'No hay conexión con el servidor. Intenta de nuevo.';
  } finally {
    loginButton.disabled = false;
  }
}

form.addEventListener('submit', handleSubmit);