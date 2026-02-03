# db_practice

A portfolio project for practicing PostgreSQL with a modern backend stack. Features a hockey league database with teams, players, games, and statistics.

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
5. Run `make seed` to populate sample data
6. Test: `curl http://localhost:3000/health`

## Makefile Commands

| Command        | Description                                      |
|----------------|--------------------------------------------------|
| `make up`      | Build and start all containers                   |
| `make migrate` | Run database migrations                          |
| `make seed`    | Populate database with sample data               |
| `make down`    | Stop all containers                              |
| `make clean`   | Stop containers and remove built images          |
| `make psql`    | Open PostgreSQL shell inside the database        |
| `make fclean`  | Stop containers, remove images, volumes and deps |

## API Endpoints

### Teams
| Method | URL                  | Description            |
|--------|----------------------|------------------------|
| `GET`  | `/teams`             | Get all teams          |
| `GET`  | `/teams/:id`         | Get one team by id     |
| `GET`  | `/teams/:id/players` | Get team roster        |

### Players
| Method | URL                   | Description              |
|--------|-----------------------|--------------------------|
| `GET`  | `/players`            | Get all players          |
| `GET`  | `/players/:id`        | Get one player by id     |
| `GET`  | `/players/:id/stats`  | Get player game-by-game  |
| `GET`  | `/players/:id/totals` | Get player career totals |

### Stats
| Method | URL              | Description           |
|--------|------------------|-----------------------|
| `GET`  | `/standings`     | League standings      |
| `GET`  | `/leaders`       | Scoring leaders       |
| `GET`  | `/leaders/goals` | Goal leaders          |

### System
| Method | URL       | Description  |
|--------|-----------|--------------|
| `GET`  | `/health` | Health check |

## Database Schema

- **team** - Hockey teams (name, city, founded_year)
- **player** - Players with foreign key to team
- **game** - Games between two teams with scores
- **stat** - Player statistics per game (goals, assists, minutes)

## Database Migrations

SQL migration files are located in `backend/src/migrations/`. Each file represents a single database change and is executed in alphabetical order. Migrations are tracked in a `migrations` table to ensure each file runs only once.

## Development

The backend uses hot-reload — any changes to files in `backend/src/` will automatically restart the server without rebuilding the Docker image.
