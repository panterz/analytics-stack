# Analytics Stack - Frontend

React + TypeScript frontend application for the Analytics Stack with DuckDB WASM integration.

## Technologies

- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **DuckDB WASM** - In-browser analytical database
- **PGlite** - PostgreSQL in the browser
- **ESLint** - Code linting

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Build for Production

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Project Structure

- `src/` - Source code
  - `components/` - React components (TypeScript)
    - `EventForm.tsx` - Create analytics events
    - `EventList.tsx` - Display analytics events
    - `QueryPanel.tsx` - Execute DuckDB SQL queries
  - `services/` - API service layer
    - `api.ts` - Backend API integration
    - `duckdb.ts` - DuckDB WASM local database utilities
    - `duckdbApi.ts` - Backend DuckDB query API
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
  - `vite-env.d.ts` - Vite type definitions

## Features

- **TypeScript** - Full type safety across the application
- **DuckDB WASM Integration** - In-browser analytical database
- **Query Panel** - Execute SQL queries against backend DuckDB (connected to PostgreSQL)
- **Type-Safe API** - Strongly typed API calls with interfaces
- **Modern React** - React 19 with hooks and functional components

## Backend Integration

The frontend connects to the FastAPI backend running on http://localhost:8000

The backend uses DuckDB to query PostgreSQL data, providing powerful analytical capabilities.

## DuckDB WASM Usage

The application includes DuckDB WASM for local data processing:

```typescript
import { initDuckDB, executeLocalQuery, insertLocalEvent } from './services/duckdb';

// Initialize DuckDB WASM
await initDuckDB();

// Execute a local query
const result = await executeLocalQuery('SELECT * FROM local_analytics LIMIT 10');

// Insert local event
await insertLocalEvent('page_view', 'navigation', 'user123', '{"page": "/home"}', 1.0);
```

## Backend DuckDB Queries

Query the backend DuckDB instance (connected to PostgreSQL):

```typescript
import { executeBackendQuery, getAnalyticsSummary } from './services/duckdbApi';

// Execute custom query
const result = await executeBackendQuery('SELECT * FROM analytics_events WHERE event_category = ?', ['navigation']);

// Get analytics summary
const summary = await getAnalyticsSummary();
```

## Query Panel

The Query Panel component allows users to:
- Write and execute SQL queries against the backend DuckDB
- View results in a formatted table
- Use sample queries for common analytics tasks
- Query data stored in PostgreSQL through DuckDB

Example queries:
- `SELECT * FROM analytics_events ORDER BY timestamp DESC LIMIT 10`
- `SELECT event_category, COUNT(*) as count FROM analytics_events GROUP BY event_category`
- `SELECT user_id, COUNT(*) as event_count FROM analytics_events GROUP BY user_id`
