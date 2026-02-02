# db_practice

Work in progress — a portfolio project for practicing PostgreSQL with a modern backend stack.

This project does not yet contain any specific features beyond the basic setup. New functionality will be added incrementally.

## Tech Stack

- **Backend:** Node.js + TypeScript + Fastify
- **Database:** PostgreSQL 16
- **Containerization:** Docker + Docker Compose
- **Database Client:** node-postgres (pg)

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the values
3. Run `docker compose up --build`
4. Test: `curl http://localhost:3000/health`
