const CLIENT_ERROR_MESSAGE = 'La petición no es válida.';
const SERVER_ERROR_MESSAGE = 'Ocurrió un error interno. Intenta de nuevo más tarde.';

export function errorHandler(err, req, res, next) {
  const isClientError = err.status >= 400 && err.status < 500;
  if (isClientError) {
    return res.status(err.status).json({ error: CLIENT_ERROR_MESSAGE });
  }

  console.error(err);
  return res.status(500).json({ error: SERVER_ERROR_MESSAGE });
}