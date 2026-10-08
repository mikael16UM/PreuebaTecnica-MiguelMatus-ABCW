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
- Panel de administración: http://localhost:3000/admin (sin sesión, redirige a `/login`)
- Tests: `npm test`

El `.env` de ejemplo funciona tal cual en local. Antes de usarlo en otro entorno, cambia
`JWT_SECRET` por una cadena larga y aleatoria.

El usuario inicial se crea en el primer arranque con `ADMIN_USER` y `ADMIN_PASSWORD` del `.env`
(por defecto `admin` / `changeme`). Después de ese arranque las credenciales viven en la base:
para cambiarlas hay que borrar `db/app.sqlite` y volver a arrancar.

Rutas de la API:

| Método | Ruta | Acceso | Respuestas |
|---|---|---|---|
| `POST` | `/api/contacts` | Público | `201` creado · `422` errores por campo · `400` JSON mal formado · `500` fallo al guardar |
| `GET` | `/api/contacts` | Token (`Authorization: Bearer`) | `200` listado, del más reciente al más antiguo · `401` sin token, alterado o vencido |
| `POST` | `/api/session` | Público | `200` con `{ "token": "..." }` · `401` usuario o contraseña incorrectos |

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
  mensajes, no tres leads. Cada mensaje guarda el nombre con el que llegó y el contacto conserva
  el más reciente, así no se pierde lo que la persona escribió en cada envío. Las dos escrituras
  van en una transacción y una llave foránea impide mensajes sin contacto. Los identificadores se
  llaman igual en todas las tablas (`contact_id`, `message_id`, `user_id`).
- **Código separado por responsabilidad y casi sin librerías nuevas.** Las rutas reciben la
  petición y responden; la validación está en su propio módulo; las consultas SQL están en
  repositorios y usan parámetros, lo que evita inyección de SQL. Si algo falla, un manejador
  central responde un error genérico y deja el detalle solo en el log del servidor. Para el hash
  de contraseñas y los tests usé lo que ya trae Node; la única librería que agregué es
  `jsonwebtoken`, para los tokens de sesión.
- **Usuarios en la base y sesión con JWT.** La contraseña se guarda con `scrypt` y salt; el `.env`
  solo siembra el primer usuario. El login es una página propia (`/login`) que devuelve un token
  firmado con vigencia de 8 horas; el panel lo guarda en `localStorage` y lo manda en cada
  petición. El servidor no guarda estado de sesión: valida la firma y el vencimiento. La página
  `/admin` se entrega sin token y redirige al login si no lo hay; lo que se protege son los datos,
  que solo salen de `GET /api/contacts` con un token válido.
- **Seguridad en el panel.** Los nombres y mensajes los escribe cualquiera desde internet, así que
  el panel los pinta con `textContent`: un mensaje con HTML o scripts se muestra como texto y no se
  ejecuta. Al verificar el token se fija el algoritmo (`HS256`), y un test comprueba que un token
  con el contenido alterado se rechaza.

### Cómo usé IA

Usé Claude como apoyo durante el desarrollo, principalmente para revisar ideas, proponer soluciones y ayudarme con el código. Trabajé en modo conversación, sin darle acceso directo a la terminal: yo copiaba los archivos, revisaba los cambios, los probaba en el navegador y después hacía los commits.

Antes de empezar también le pedí revisar el repositorio base, especialmente los scripts de instalación, el lockfile y el origen de las dependencias, ya que partía de un repositorio público.

### Qué le pedí

Le pedí ayuda para entender mejor el alcance del ejercicio, comparar algunas opciones de diseño, proponer implementaciones y explicarme el porqué detrás de sus propuestas. Por ejemplo, revisamos temas como `scrypt` y las salts, `timingSafeEqual` y por qué necesita comparar valores de la misma longitud, así como las diferencias entre manejar sesiones y usar JWT.

### Decisiones que cambié o tomé por mi cuenta

No seguí todas sus propuestas tal cual. Algunas decisiones que cambié fueron:

- Separé contactos y mensajes en tablas diferentes, porque un mismo contacto puede enviar varios mensajes y no quería tratar cada mensaje como un contacto diferente.
- Decidí guardar el nombre también en cada mensaje para conservar el histórico aunque el contacto cambie posteriormente.
- En lugar de usar credenciales fijas en el `.env`, opté por manejar los usuarios en una tabla y guardar las contraseñas hasheadas.
- Cambié los nombres genéricos como `id` por nombres más claros relacionados con sus referencias en otras tablas.
- Después de revisar el modelo, agregué las llaves foráneas que inicialmente no había considerado.
- El panel comenzó usando Basic Auth, pero preferí cambiarlo por un login propio con JWT porque quería permitir cerrar sesión y tener una pantalla de acceso dentro de la aplicación. La alternativa que me propuso fue manejar sesiones en base de datos; elegí JWT porque preferí mantener el servidor sin estado de sesión y dejé documentada esta decisión y sus desventajas.

También tomé algunas decisiones más pequeñas durante el desarrollo, como limitar los mensajes a 1500 caracteres con un contador visual, mostrar el número de mensajes enviados por cada contacto y mantener nombre y apellidos en un solo campo porque no había ninguna funcionalidad que necesitara manejarlos por separado.

### Qué aportó la IA

La IA me ayudó bastante con la implementación: propuso código para distintas partes, ayudó a preparar los tests y sirvió para revisar casos límite, como tipos inesperados en el cuerpo de una petición o intentos de inyectar HTML en el panel.

Aun así, yo fui revisando y probando los cambios, y varias de las propuestas iniciales las modifiqué o descarté según lo que consideré más adecuado para el proyecto.

**Qué dejé pendiente por tiempo y cómo lo resolvería:**

- **Historial por contacto en el panel.** Hoy la columna "Envíos" solo indica cuántos mensajes
  tiene ese correo. Lo siguiente sería desplegar bajo cada fila los mensajes anteriores del mismo
  contacto; el API ya entrega `contact_id`, así que bastaría agrupar en el front.
- **Paginación y búsqueda.** El listado trae todo. Usaría `LIMIT` con cursor por `created_at`
  (el índice ya existe) y un filtro por correo.
- **Protección contra abuso.** No hay límite de intentos ni en el formulario ni en el login.
  Agregaría un rate limit.
- **Revocación de la sesión.** Cerrar sesión borra el token del navegador, pero el token sigue
  siendo válido hasta que vence (1 hora) si alguien lo copió. Para producción usaría tokens de
  vida corta con un token de renovación revocable, o el token en una cookie `httpOnly`, siempre
  sobre HTTPS, y agregaría alta y baja de usuarios.
- **Migraciones.** El esquema se crea con `CREATE TABLE IF NOT EXISTS`, que no modifica tablas
  existentes. Con más cambios usaría migraciones versionadas.
- **Más tests.** Faltan el caso de fallo al guardar y pruebas del front.