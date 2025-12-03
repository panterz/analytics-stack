# Analytics Stack - Frontend

React + TypeScript frontend application for the Analytics Stack.

## Technologies

- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **SQL.js** - In-browser SQL database for local caching
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
  - `services/` - API service layer
    - `api.ts` - Backend API integration
    - `sqljs.ts` - SQL.js local database utilities
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
  - `vite-env.d.ts` - Vite type definitions

## Features

- **TypeScript** - Full type safety across the application
- **SQL.js Integration** - Local in-browser database for caching analytics events
- **Type-Safe API** - Strongly typed API calls with interfaces
- **Modern React** - React 19 with hooks and functional components

## Backend Integration

The frontend connects to the FastAPI backend running on http://localhost:8000

## SQL.js Usage

The application includes SQL.js for local data caching. Example usage:

```typescript
import { initDatabase, addLocalEvent, getLocalEvents } from './services/sqljs';

// Initialize the database
await initDatabase();

// Add a local event
await addLocalEvent('page_view', 'navigation', 'user123', '{"page": "/home"}', 1.0);

// Get all local events
const events = await getLocalEvents();
```

### Configuring SQL.js CDN

By default, SQL.js loads from the official CDN. To use a local copy or different CDN:

1. Create a `.env` file in the frontend directory
2. Add: `VITE_SQLJS_CDN=https://your-cdn.com/path/to/sqljs/`

Or bundle SQL.js locally by copying the wasm files to your public directory.
