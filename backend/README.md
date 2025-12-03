# Analytics Stack - Backend

FastAPI backend application with SQLAlchemy ORM.

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

4. Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

API documentation: http://localhost:8000/docs

## Project Structure

- `app/` - Main application package
  - `main.py` - FastAPI application entry point
  - `database.py` - Database configuration and session management
  - `models.py` - SQLAlchemy models
  - `schemas.py` - Pydantic schemas for request/response validation
  - `api/` - API routes
