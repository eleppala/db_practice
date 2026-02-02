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
4. Test: `curl http://localhost:3000/health`

## Makefile Commands

| Command      | Description                                      |
|--------------|--------------------------------------------------|
| `make up`    | Build and start all containers                   |
| `make down`  | Stop all containers                              |
| `make clean` | Stop containers and remove built images          |
| `make fclean`| Stop containers, remove images, volumes and deps |

## Development

The backend uses hot-reload — any changes to files in `backend/src/` will automatically restart the server without rebuilding the Docker image.
