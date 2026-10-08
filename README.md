# Prueba Técnica Full Stack — Repositorio base (Node)

Este repo existe para que **no pierdas tiempo en configuración**. Lo aburrido ya
está resuelto; lo que evaluamos lo construyes tú.

Recuerda: la parte práctica está pensada para **un máximo de 3 horas**. No pasa
nada si usas IA — solo pedimos que entiendas y puedas explicar lo que entregues.

---

## Arranque rápido

Necesitas **Node 18.18+**.

```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm run dev
```

Luego abre: http://localhost:3000/health
Si ves `{"status":"ok","db":true}`, todo está corriendo.

> `npm install` compila `better-sqlite3`. En la mayoría de los sistemas usa un
> binario precompilado y no necesitas nada extra.

---

## El reto (resumen)

Un **mini-gestor de contactos (leads)** que funcione de punta a punta:

**formulario público → tu API → base de datos → panel protegido**

1. Formulario público de contacto (nombre, correo, mensaje) con validación
   **en cliente y en servidor**.
2. Al enviarse, el contacto se **guarda en la base de datos** vía tu API.
3. Una **vista de administración protegida** que lista los contactos, del más
   reciente al más antiguo.
4. Manejo básico de errores.

No sobre-ingenierices: preferimos algo simple y bien resuelto.

---

## Qué ya está hecho (no necesitas tocarlo)

- Proyecto de Express que arranca con `npm run dev`.
- Conexión a **SQLite ya configurada** (`src/db.js`) — crea el archivo solo.
- Lectura de body JSON y de formularios.
- Servido de estáticos desde `src/public` (por si usas HTML/CSS/JS "vanilla").
- Ruta `/health` funcionando.
- `.gitignore` correcto (no subas `node_modules` ni tu `.env`).

## Qué construyes tú (esto es lo que evaluamos)

| Dónde | Qué falta |
|---|---|
| `src/db.js` | Diseñar el **esquema** de la tabla de contactos. |
| `src/routes/contacts.js` | `POST /api/contacts` (guardar) y `GET /api/contacts` (listar). |
| `src/middleware/auth.js` | La **autenticación** del panel (ahora no protege nada). |
| `src/public/` *(o tu front)* | El **formulario** y la **vista de administración**. |

El front-end es tu decisión: puedes usar la carpeta `src/public` con vanilla, o
montar **Astro / Next / Svelte** aparte. Lo único imprescindible es que consuma
tu propia API.

---

## Entrega

- Este repositorio en **GitHub** con tus commits.
- Completa la sección de abajo en este mismo README.
- Opcional: un video corto (2–3 min) mostrándolo funcionar. **No** hace falta
  desplegarlo; el despliegue lo conversamos en la sesión en vivo.

### Para completar por el candidato

**Cómo correr mi proyecto:**

Requiere **Node 20 o 22 LTS**. Con Node 24 en Windows, `better-sqlite3` 11 no encuentra binario
precompilado e intenta compilarse, lo que exige Visual Studio Build Tools. Me pasó al instalar
y lo resolví usando Node 22.

```bash
npm ci
cp .env.example .env     # en Windows: copy .env.example .env
npm run dev
```

- Formulario público: http://localhost:3000/
- Panel de administración: http://localhost:3000/admin
- Tests: `npm test`

El panel pide usuario y contraseña con el diálogo del navegador. El usuario inicial se crea en el
primer arranque con `ADMIN_USER` y `ADMIN_PASSWORD` del `.env` (por defecto `admin` / `changeme`).
Después de ese arranque las credenciales viven en la base: para cambiarlas hay que borrar
`db/app.sqlite` y volver a arrancar.

Rutas de la API:

| Método | Ruta | Acceso | Respuestas |
|---|---|---|---|
| `POST` | `/api/contacts` | Público | `201` creado · `422` errores por campo · `400` JSON mal formado · `500` fallo al guardar |
| `GET` | `/api/contacts` | Basic Auth | `200` listado, del más reciente al más antiguo · `401` sin credenciales o incorrectas |

```
POST /api/contacts
{ "name": "Ana López", "email": "ana@ejemplo.com", "message": "Hola, quiero una cotización." }

201 → { "message_id": 1, "contact_id": 1, "created_at": "2026-10-07T23:33:37.031Z" }
422 → { "errors": { "email": "El correo no tiene un formato válido." } }
```

Reglas de validación (iguales en cliente y servidor): nombre de 2 a 100 caracteres, correo con
formato válido y máximo 254, mensaje de 10 a 1500. Se recortan espacios y el correo se guarda en
minúsculas.

**Decisiones técnicas (3–4 puntos):**

- **Dos tablas: `contacts` y `messages`.** Un contacto es una persona, identificada por su correo;
  un mensaje es cada envío del formulario. Si alguien escribe tres veces es un lead con tres
  mensajes, no tres leads. Cada mensaje guarda el nombre con el que llegó, y el contacto conserva
  el más reciente. Ambas escrituras van en una transacción; no declaré llaves foráneas, así que
  la transacción es la que garantiza la consistencia.
- **Capas pequeñas y sin dependencias nuevas.** Las rutas solo atienden HTTP, la validación es un
  módulo sin efectos y el SQL vive en repositorios con sentencias preparadas. Un manejador
  central convierte cualquier fallo en un `500` genérico y deja el detalle en el log. Hash de
  contraseñas y tests usan módulos que ya trae Node (`crypto`, `node:test`).
- **Usuarios en la base, no en el `.env`.** La contraseña se guarda con `scrypt` y sal; el `.env`
  solo siembra el primer usuario. La autenticación es Basic Auth, que evita programar login y
  sesiones, a cambio de exigir HTTPS en producción.
- **La página del panel no está en la carpeta pública.** Al probarla ahí, una URL codificada
  (`/%61dmin.html`) la entregaba sin pedir credenciales. La moví a `src/views` y se sirve solo
  desde una ruta protegida. El panel pinta los datos con `textContent`, para que un mensaje con
  HTML o scripts se muestre como texto y no se ejecute.

**Cómo usé IA:**

Trabajé con Claude en modo conversación, sin agente en la terminal: yo copié, revisé y probé cada
archivo, e hice un commit por paso.

- **Qué le pedí:** revisar el starter antes de instalarlo, ayudarme a acotar el alcance, proponer
  el código de cada paso y explicarme lo que no conocía de Express y SQLite.
- **Qué me dio:** una primera propuesta con una sola tabla, credenciales en el `.env` y el nombre
  de columnas genérico (`id`); después, el código de cada paso ya probado, y el hallazgo de la URL
  codificada que saltaba la protección del panel.
- **Qué decidí o ajusté yo:** separar contactos de mensajes, guardar el nombre en cada mensaje,
  no usar llaves foráneas, mover los usuarios a la base, nombrar los identificadores igual en
  todas las tablas (`contact_id`, `message_id`, `user_id`) y el límite de 1500 caracteres con su
  contador.

**Qué dejé pendiente por tiempo y cómo lo resolvería:**

- **Historial por contacto en el panel.** Hoy la columna "Envíos" solo indica cuántos mensajes
  tiene ese correo. Lo siguiente sería desplegar bajo cada fila los mensajes anteriores del mismo
  contacto; el API ya entrega `contact_id`, así que bastaría agrupar en el front.
- **Paginación y búsqueda.** El listado trae todo. Usaría `LIMIT` con cursor por `created_at`
  (el índice ya existe) y un filtro por correo.
- **Protección contra abuso.** No hay límite de intentos ni en el formulario ni en el login.
  Agregaría un limitador por IP y un campo trampa contra bots.
- **Sesiones en lugar de Basic Auth.** Basic Auth verifica la contraseña en cada petición y no
  permite cerrar sesión. Para producción: login con cookie de sesión, HTTPS y alta de usuarios.
- **Migraciones.** El esquema se crea con `CREATE TABLE IF NOT EXISTS`, que no modifica tablas
  existentes. Con más cambios usaría migraciones versionadas.
- **Más tests.** Faltan el caso de fallo al guardar (`500`) y pruebas del front.