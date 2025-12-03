from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api import analytics
from .schemas import HealthResponse

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Analytics Stack API",
    description="FastAPI backend for analytics tracking",
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


@app.get("/", response_model=HealthResponse)
def root():
    """Root endpoint - health check."""
    return {"status": "ok", "message": "Analytics Stack API is running"}


@app.get("/health", response_model=HealthResponse)
def health():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Service is operational"}


# Include routers
app.include_router(analytics.router, prefix="/api", tags=["analytics"])
