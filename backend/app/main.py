from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api import analytics, duckdb
from .schemas import HealthResponse
from .duckdb_service import get_duckdb_connection, create_table_from_sqlalchemy, close_connection

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Analytics Stack API",
    description="FastAPI backend for analytics tracking with DuckDB",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize DuckDB connection on startup."""
    try:
        get_duckdb_connection()
        create_table_from_sqlalchemy()
        print("DuckDB initialized successfully")
    except Exception as e:
        print(f"Warning: DuckDB initialization failed: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """Close DuckDB connection on shutdown."""
    close_connection()
    print("DuckDB connection closed")


@app.get("/", response_model=HealthResponse)
def root():
    """Root endpoint - health check."""
    return {"status": "ok", "message": "Analytics Stack API with DuckDB is running"}


@app.get("/health", response_model=HealthResponse)
def health():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Service is operational"}


# Include routers
app.include_router(analytics.router, prefix="/api", tags=["analytics"])
app.include_router(duckdb.router, prefix="/api/duckdb", tags=["duckdb"])

