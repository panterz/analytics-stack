from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from ..duckdb_service import execute_query, execute_query_df, sync_from_sqlite

router = APIRouter()


class QueryRequest(BaseModel):
    """Schema for SQL query requests."""
    query: str
    params: Optional[List[Any]] = None


class QueryResponse(BaseModel):
    """Schema for SQL query responses."""
    data: List[Dict[str, Any]]
    row_count: int


@router.post("/query", response_model=QueryResponse)
def execute_duckdb_query(request: QueryRequest):
    """
    Execute a DuckDB SQL query.
    
    This endpoint allows the frontend to send SQL queries to be executed
    against DuckDB, which is connected to PostgreSQL.
    """
    try:
        # Sync data from SQLite first (for local development)
        sync_from_sqlite()
        
        # Security: In production, you should validate/sanitize queries
        # or use a whitelist of allowed queries
        results = execute_query(request.query, request.params)
        
        return QueryResponse(
            data=results,
            row_count=len(results)
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Query execution failed: {str(e)}"
        )


@router.get("/tables")
def list_tables():
    """List all available tables in DuckDB."""
    try:
        tables = execute_query("""
            SELECT table_name, table_schema, table_type
            FROM information_schema.tables
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
            ORDER BY table_schema, table_name;
        """)
        return {"tables": tables}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list tables: {str(e)}"
        )


@router.get("/schema/{table_name}")
def get_table_schema(table_name: str):
    """Get schema information for a specific table."""
    try:
        schema = execute_query(f"""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = ?
            ORDER BY ordinal_position;
        """, [table_name])
        
        if not schema:
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
        
        return {"table": table_name, "columns": schema}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get schema: {str(e)}"
        )


@router.get("/analytics/summary")
def get_analytics_summary():
    """Get analytics summary using DuckDB."""
    try:
        # Example aggregate query
        summary = execute_query("""
            SELECT 
                COUNT(*) as total_events,
                COUNT(DISTINCT event_name) as unique_events,
                COUNT(DISTINCT user_id) as unique_users,
                MIN(timestamp) as first_event,
                MAX(timestamp) as last_event
            FROM analytics_events;
        """)
        
        return summary[0] if summary else {}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get summary: {str(e)}"
        )


@router.get("/analytics/events-by-category")
def get_events_by_category():
    """Get event counts grouped by category."""
    try:
        results = execute_query("""
            SELECT 
                event_category,
                COUNT(*) as event_count,
                COUNT(DISTINCT user_id) as unique_users
            FROM analytics_events
            WHERE event_category IS NOT NULL
            GROUP BY event_category
            ORDER BY event_count DESC;
        """)
        
        return {"data": results}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get events by category: {str(e)}"
        )
