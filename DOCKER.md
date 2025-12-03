# Docker Compose Setup

This directory contains Docker Compose configuration to run the entire Analytics Stack with three services:

## Services

1. **PostGIS Database** (`db`) - PostgreSQL 16 with PostGIS 3.4 extension
2. **Backend API** (`backend`) - FastAPI application
3. **Frontend** (`frontend`) - React application served via nginx

## Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system
- Ports 3000, 5432, and 8000 available

### Starting the Stack

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

### Service URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

### Database Credentials

- **Database**: analytics
- **User**: postgres
- **Password**: postgres

## Service Details

### PostGIS Database (`db`)

- Image: `postgis/postgis:16-3.4`
- Port: 5432
- Volume: `postgres_data` for persistent storage
- Health check included for proper startup ordering

### Backend API (`backend`)

- Build context: `./backend`
- Port: 8000
- Environment variables configured for Docker networking
- Depends on healthy database service
- Auto-restarts unless stopped

### Frontend (`frontend`)

- Build context: `./frontend`
- Port: 3000 (mapped from internal port 80)
- Nginx web server
- Configured to connect to backend at http://localhost:8000
- Depends on backend service
- Auto-restarts unless stopped

## Development

### Rebuilding Services

If you make changes to the code:

```bash
# Rebuild specific service
docker compose build backend
docker compose build frontend

# Rebuild and restart
docker compose up -d --build
```

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Accessing Services

```bash
# Execute commands in running containers
docker compose exec backend bash
docker compose exec frontend sh
docker compose exec db psql -U postgres -d analytics
```

## Environment Variables

### Backend

The backend uses the following environment variables (configured in compose.yaml):

- `DATABASE_URL`: PostgreSQL connection string
- `POSTGRES_HOST`: Database hostname (docker service name `db`)
- `POSTGRES_PORT`: Database port (5432)
- `POSTGRES_DB`: Database name (analytics)
- `POSTGRES_USER`: Database user (postgres)
- `POSTGRES_PASSWORD`: Database password (postgres)

### Frontend

The frontend build accepts:

- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)

## Troubleshooting

### Port Conflicts

If ports are already in use, modify the port mappings in `compose.yaml`:

```yaml
ports:
  - "YOUR_PORT:CONTAINER_PORT"
```

### Database Connection Issues

Ensure the database is healthy before the backend starts:

```bash
docker compose ps
```

The `db` service should show as "healthy".

### Rebuilding from Scratch

```bash
# Stop services, remove containers and volumes
docker compose down -v

# Remove images
docker compose down --rmi all

# Start fresh
docker compose up -d --build
```

## Data Persistence

PostgreSQL data is persisted in the `postgres_data` Docker volume. To reset the database:

```bash
docker compose down -v
docker compose up -d
```

## Network

All services run on the same Docker network (`analytics-stack_default`) and can communicate using service names:

- Backend connects to database using hostname `db`
- Frontend connects to backend using `http://backend:8000` internally (though external connections use localhost)
