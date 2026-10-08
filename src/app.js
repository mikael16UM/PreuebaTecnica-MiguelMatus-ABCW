import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import db from './db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAuth } from './middleware/auth.js';
import contactsRouter from './routes/contacts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: db.open });
});

app.use('/api/contacts', contactsRouter);

app.use(errorHandler);

export default app;