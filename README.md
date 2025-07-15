# Salas API - Backend

Este proyecto es una API RESTful para la gestión de salas de juntas y sus reservas. Está construida con **Node.js**, **Express**, y **Sequelize** como ORM para conectarse a una base de datos MySQL en producción y SQLite en testing.

---

## Características principales

- CRUD de salas con capacidad y ubicación.
- Reservas con validaciones:
  - Duración máxima de 2 horas.
  - No se permiten traslapes.
- Liberación automática de reservas vencidas con cron.
- Pruebas automatizadas con Jest + Supertest.
- Preparado para entorno de producción y testing (SQLite).

---

## Tecnologías

- Node.js
- Express
- Sequelize
- MySQL / SQLite
- Jest + Supertest
- dotenv
- cron (node-cron)

---

## Instalación

```bash
git clone https://github.com/fabianreyesmn/salas-backend
cd salas-backend
npm install
```

## COnfiguración de MySQL
- Asegurarse de tener un servidor MySQL corriendo.
- Crear una base de datos llamada `salas_db` (o el nombre que definas en `.env`):
```
CREATE DATABASE salas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
- Luego, asegúrate de que el usuario y contraseña definidos en .env tengan permisos sobre esa base.

## Configuración de entorno
Crea un archivo .env:
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=salas_db
```
Y otro para pruebas .env.test:
```
NODE_ENV=test
```

## Ejecutar pruebas
```
npm test
```
Usa una base de datos en memoria (SQLite) y carga variables desde .env.test.

## Ejecutar servidor
```
npm run dev
```
La API estará disponible en http://localhost:3000.

## Endpoints principales
| Método | Ruta                        | Descripción                     |
| ------ | --------------------------- | ------------------------------- |
| GET    | `/api/salas`                | Listar salas                    |
| POST   | `/api/salas/crear`                | Crear sala                      |
| DELETE | `/api/salas/:id`            | Eliminar sala                   |
| GET    | `/api/reservas`             | Listar reservas                 |
| POST   | `/api/reservas/crear`             | Crear reserva                   |
| PATCH  | `/api/reservas/:id/liberar` | Liberar una reserva manualmente |

## Tareas programadas
Se ejecuta cada minuto:
```
cron.schedule('* * * * *', liberarReservasVencidas);
```

## Estructura del proyecto
```
salas-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── jobs/
│   ├── database/
│   ├── app.js
│   └── index.js
├── .env
├── .env.test
├── .env.example
├── jest.config.js
├── jest.setup.js
├── package-lock.json
└── package.json
```
