import { Router } from 'express';

import { requireAuth } from '../middleware/auth.js';
import { saveContactMessage } from '../repositories/contacts.js';
import { validateContact } from '../validation/contact.js';

const router = Router();

router.post('/', (req, res) => {
  const { values, errors, isValid } = validateContact(req.body);
  if (!isValid) {
    return res.status(422).json({ errors });
  }

  const savedMessage = saveContactMessage(values);
  return res.status(201).json(savedMessage);
});

router.get('/', requireAuth, (req, res) => {
  res.status(501).json({ error: 'No implementado. Construye el listado de contactos.' });
});

export default router;