# Analytics Stack - Backend

FastAPI backend application with SQLAlchemy ORM and DuckDB integration for advanced analytics.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
```

Edit `.env` to configure PostgreSQL connection if available.

4. Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

API documentation: http://localhost:8000/docs

## Project Structure

- `app/` - Main application package
  - `main.py` - FastAPI application entry point
  - `database.py` - SQLAlchemy database configuration and session management
  - `duckdb_service.py` - DuckDB integration with PostgreSQL
  - `models.py` - SQLAlchemy models
  - `schemas.py` - Pydantic schemas for request/response validation
  - `api/` - API routes
    - `analytics.py` - Analytics event CRUD operations
    - `duckdb.py` - DuckDB query endpoints

## DuckDB Integration

The backend uses DuckDB to provide analytical query capabilities:

- **PostgreSQL Connection**: DuckDB connects to PostgreSQL for data access
- **Query Endpoint**: `/api/duckdb/query` - Execute SQL queries
- **Table Listing**: `/api/duckdb/tables` - List available tables
- **Schema Info**: `/api/duckdb/schema/{table_name}` - Get table schema
- **Analytics**: Pre-built analytics endpoints for common queries

### Configuration

Configure PostgreSQL connection in `.env`:

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=analytics
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

### DuckDB Features

- **In-memory analytical processing**: Fast queries on PostgreSQL data
- **SQL query execution**: Full SQL support for complex analytics
- **PostgreSQL extension**: Seamless integration with PostgreSQL
- **Fallback mode**: Works without PostgreSQL for local development

## API Endpoints

### Analytics Events

- `POST /api/events` - Create analytics event
- `GET /api/events` - List all events (paginated)
- `GET /api/events/{id}` - Get specific event
- `GET /health` - Health check

### DuckDB Queries

- `POST /api/duckdb/query` - Execute SQL query
- `GET /api/duckdb/tables` - List all tables
- `GET /api/duckdb/schema/{table_name}` - Get table schema
- `GET /api/duckdb/analytics/summary` - Get analytics summary
- `GET /api/duckdb/analytics/events-by-category` - Events grouped by category

## Example DuckDB Queries

```python
# Via API
POST /api/duckdb/query
{
  "query": "SELECT event_category, COUNT(*) as count FROM analytics_events GROUP BY event_category",
  "params": []
}

# Using the service directly
from app.duckdb_service import execute_query

results = execute_query("SELECT * FROM analytics_events LIMIT 10")
```

## Dependencies

- **FastAPI** - Web framework
- **SQLAlchemy** - ORM for database operations
- **DuckDB** - Analytical database engine
- **psycopg2-binary** - PostgreSQL adapter
- **asyncpg** - Async PostgreSQL driver
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

## Notes

- DuckDB will attempt to connect to PostgreSQL on startup
- If PostgreSQL is not available, DuckDB runs in standalone mode
- The analytics_events table is automatically mirrored in DuckDB when PostgreSQL is connected
