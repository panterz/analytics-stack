# Analytics Stack

A modern monorepo featuring a FastAPI backend with SQLAlchemy and a React frontend with SQLRooms for analytics tracking and data visualization.

## 🏗️ Project Structure

```
analytics-stack/
├── backend/          # FastAPI application
│   ├── app/         # Application code
│   │   ├── api/     # API routes
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   ├── requirements.txt
│   └── README.md
│
└── frontend/        # React application
    ├── src/
    │   ├── components/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── README.md
```

## 🚀 Quick Start

### 🐳 Docker Compose (Recommended)

The fastest way to get started is using Docker Compose:

```bash
# Start all services (PostGIS, backend, frontend)
docker compose up -d

# View logs
docker compose logs -f
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

See [DOCKER.md](DOCKER.md) for detailed Docker Compose documentation.

### Manual Setup

If you prefer to run services individually:

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Poetry 2.0 (if not already installed):
```bash
pip install poetry==2.0.1
```

3. Install dependencies:
```bash
poetry install
```

4. Configure environment (optional):
```bash
cp .env.example .env
```

5. Start the server:
```bash
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000  
API documentation: http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## 🛠️ Technologies

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **DuckDB** - In-process analytical database
- **PostgreSQL** - Production database (via DuckDB)
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation using Python type hints

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **SQLRooms** - Building blocks for React data analytics applications
- **DuckDB WASM** - In-browser analytical database (via SQLRooms)
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management (via SQLRooms)
- **PGlite** - PostgreSQL in the browser

### Docker
- **PostgreSQL with PostGIS** - Geospatial database
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Production web server for frontend

## 📋 Features

- ✅ Analytics event tracking with SQLAlchemy ORM
- ✅ **SQLRooms integration** - Modern React framework for data analytics
- ✅ **DuckDB integration** for advanced analytics
- ✅ **PostgreSQL connectivity** through DuckDB
- ✅ **SQL query panel** in frontend to query backend DuckDB
- ✅ **DuckDB WASM** for local data processing (via SQLRooms)
- ✅ **Room-based state management** with Zustand
- ✅ **React hooks for SQL queries** (useSql from SQLRooms)
- ✅ RESTful API with automatic documentation
- ✅ React + TypeScript dashboard
- ✅ CORS enabled for local development
- ✅ Real-time event display

## 🔌 API Endpoints

### Analytics Events
- `GET /` - Health check
- `GET /health` - Service health status
- `POST /api/events` - Create analytics event
- `GET /api/events` - List all events
- `GET /api/events/{id}` - Get specific event

### DuckDB Queries
- `POST /api/duckdb/query` - Execute SQL query against DuckDB
- `GET /api/duckdb/tables` - List available tables
- `GET /api/duckdb/schema/{table}` - Get table schema
- `GET /api/duckdb/analytics/summary` - Analytics summary
- `GET /api/duckdb/analytics/events-by-category` - Events by category

## 🏢 SQLRooms Integration

The frontend integrates [SQLRooms](https://github.com/sqlrooms/sqlrooms), a powerful React framework for building data analytics applications with DuckDB WASM.

### What is SQLRooms?

SQLRooms provides building blocks for creating modern, interactive data-analytics applications that run entirely in the browser:

- **In-browser DuckDB WASM** - Columnar analytics speed with zero backend load
- **Room-based architecture** - Self-contained workspaces for data analysis
- **React hooks** - Easy-to-use hooks like `useSql` for SQL queries
- **State management** - Built on Zustand for predictable state
- **Theme support** - Light/dark themes via ThemeProvider
- **Modular design** - Composable slices for flexible architecture

### Example Usage

```typescript
// Using SQLRooms useSql hook
import { useSql } from '@sqlrooms/duckdb';
import { useRoomStore } from './room-store';

function MyComponent() {
  const dbReady = useRoomStore((state) => state.db.isReady);
  
  const { data, isLoading, error } = useSql({
    query: 'SELECT * FROM my_table LIMIT 10',
    enabled: dbReady,
  });
  
  return <div>{/* render data */}</div>;
}
```

## 🦆 DuckDB Integration

The stack includes DuckDB for powerful analytical queries:

**Backend**: DuckDB connects to PostgreSQL and provides analytical query capabilities  
**Frontend**: DuckDB WASM runs queries locally in the browser via SQLRooms

### Backend Query Example

```typescript
// Frontend: Execute query against backend DuckDB
const result = await executeBackendQuery(`
  SELECT event_category, COUNT(*) as count 
  FROM analytics_events 
  GROUP BY event_category
`);
```

## 📝 License

MIT
