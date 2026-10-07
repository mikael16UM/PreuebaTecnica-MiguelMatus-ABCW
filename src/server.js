import 'dotenv/config';

import app from './app.js';
import { seedFirstUser } from './seedFirstUser.js';

const PORT = process.env.PORT || 3000;

seedFirstUser();

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log(`Healthcheck: http://localhost:${PORT}/health`);
});