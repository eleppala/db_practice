# db_practice

Work in progress — a portfolio project for practicing PostgreSQL with a modern backend stack.

This project does not yet contain any specific features beyond the basic setup. New functionality will be added incrementally.

## Tech Stack

- **Backend:** Node.js + TypeScript + Fastify
- **Database:** PostgreSQL 16
- **Containerization:** Docker + Docker Compose
- **Database Client:** node-postgres (pg)
- **Dev Tools:** ts-node-dev (hot-reload), Make

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the values
3. Run `make up`
4. Run `make migrate` (in a separate terminal)
5. Test: `curl http://localhost:3000/health`

## Makefile Commands

| Command        | Description                                      |
|----------------|--------------------------------------------------|
| `make up`      | Build and start all containers                   |
| `make migrate` | Run database migrations                          |
| `make down`    | Stop all containers                              |
| `make clean`   | Stop containers and remove built images          |
| `make psql`    | Open PostgreSQL shell inside the database         |
| `make fclean`  | Stop containers, remove images, volumes and deps |

## API Endpoints

| Method   | URL              | Description              |
|----------|------------------|--------------------------|
| `GET`    | `/health`        | Health check             |
| `GET`    | `/examples`      | Get all examples         |
| `GET`    | `/examples/:id`  | Get one example by id    |
| `POST`   | `/examples`      | Create a new example     |
| `PUT`    | `/examples/:id`  | Update an example by id  |
| `DELETE` | `/examples/:id`  | Delete an example by id  |

## Database Migrations

SQL migration files are located in `backend/src/migrations/`. Each file represents a single database change and is executed in alphabetical order. Migrations are tracked in a `migrations` table to ensure each file runs only once.

## Development

The backend uses hot-reload — any changes to files in `backend/src/` will automatically restart the server without rebuilding the Docker image.
