// ─────────────────────────────────────────────────────────────
//  Conexión a SQLite — YA FUNCIONA (abre/crea el archivo de DB).
//  Lo que te toca a ti: DISEÑAR el esquema de los datos.
// ─────────────────────────────────────────────────────────────
import Database from 'better-sqlite3';

const dbPath = process.env.DATABASE_PATH || './db/app.sqlite';

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// ── TODO (candidato): define aquí el esquema de tu base de datos. ──
//
// El modelado de los datos es parte de lo que evaluamos, así que el
// diseño es decisión tuya. Esto es solo para mostrarte el mecanismo:
//
//   db.exec(`
//     CREATE TABLE IF NOT EXISTS contacts (
//       id   ... ,
//       ...        -- qué campos y de qué tipo lo decides tú
//     )
//   `);
//
// ───────────────────────────────────────────────────────────────────

export default db;
