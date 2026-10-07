// ─────────────────────────────────────────────────────────────
//  Rutas de contactos. Los stubs responden 501 a propósito:
//  son los que tienes que construir.
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';

import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/contacts  —  PÚBLICO
// Recibe el formulario de contacto y lo guarda en la base de datos.
// TODO: valida en el servidor (no confíes solo en el front) y guarda.
router.post('/', (req, res) => {
  res.status(501).json({ error: 'No implementado. Construye el guardado del contacto.' });
});

// GET /api/contacts  —  PROTEGIDO (vista de administración)
// Devuelve los contactos guardados, del más reciente al más antiguo.
// TODO: léelos de la base de datos y devuélvelos.
router.get('/', requireAuth, (req, res) => {
  res.status(501).json({ error: 'No implementado. Construye el listado de contactos.' });
});

export default router;
