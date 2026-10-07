// ─────────────────────────────────────────────────────────────
//  Autenticación de la vista de administración.
//  AHORA MISMO NO PROTEGE NADA: es tu trabajo implementarla.
// ─────────────────────────────────────────────────────────────

// TODO (candidato): implementa una autenticación simple para proteger
// el listado de contactos (Basic Auth o un login sencillo).
// Tienes ADMIN_USER / ADMIN_PASSWORD disponibles en el archivo .env.
export function requireAuth(req, res, next) {
  console.warn('[auth] ⚠  Ruta SIN PROTECCIÓN: falta implementar requireAuth()');
  // TODO: reemplaza esta línea por una verificación real
  //       (y responde 401 cuando las credenciales no sean válidas).
  return next();
}
