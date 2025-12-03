# Analytics Stack

A modern monorepo featuring a FastAPI backend with SQLAlchemy and a React frontend for analytics tracking.

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

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment (optional):
```bash
cp .env.example .env
```

5. Start the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
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
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation using Python type hints

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **SQL.js** - In-browser SQL database for local caching

## 📋 Features

- ✅ Analytics event tracking
- ✅ RESTful API with automatic documentation
- ✅ SQLAlchemy ORM with SQLite database
- ✅ React-based dashboard
- ✅ CORS enabled for local development
- ✅ Real-time event display

## 🔌 API Endpoints

- `GET /` - Health check
- `GET /health` - Service health status
- `POST /api/events` - Create analytics event
- `GET /api/events` - List all events
- `GET /api/events/{id}` - Get specific event

## 📝 License

MIT
