import duckdb
import os
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL connection settings
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "analytics")
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")

# DuckDB connection
_conn: Optional[duckdb.DuckDBPyConnection] = None


def get_duckdb_connection() -> duckdb.DuckDBPyConnection:
    """Get or create DuckDB connection with PostgreSQL extension."""
    global _conn
    
    if _conn is None:
        # Create in-memory DuckDB instance
        _conn = duckdb.connect(database=':memory:', read_only=False)
        
        # Install and load PostgreSQL extension
        _conn.execute("INSTALL postgres;")
        _conn.execute("LOAD postgres;")
        
        # Create PostgreSQL connection
        postgres_conn_str = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
        
        try:
            # Attach PostgreSQL database
            _conn.execute(f"""
                ATTACH '{postgres_conn_str}' AS postgres_db (TYPE POSTGRES);
            """)
            print(f"DuckDB connected to PostgreSQL at {POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}")
        except Exception as e:
            print(f"Warning: Could not connect to PostgreSQL: {e}")
            print("DuckDB will run without PostgreSQL connection")
    
    return _conn


def execute_query(query: str, params: Optional[List[Any]] = None) -> List[Dict[str, Any]]:
    """
    Execute a SQL query and return results as list of dictionaries.
    
    Args:
        query: SQL query string
        params: Optional list of parameters for parameterized queries
        
    Returns:
        List of dictionaries with query results
    """
    conn = get_duckdb_connection()
    
    try:
        if params:
            result = conn.execute(query, params).fetchall()
        else:
            result = conn.execute(query).fetchall()
        
        # Get column names
        columns = [desc[0] for desc in conn.description] if conn.description else []
        
        # Convert to list of dictionaries
        return [dict(zip(columns, row)) for row in result]
    except Exception as e:
        raise Exception(f"Query execution failed: {str(e)}")


def execute_query_df(query: str, params: Optional[List[Any]] = None):
    """
    Execute a SQL query and return results as pandas DataFrame.
    
    Args:
        query: SQL query string
        params: Optional list of parameters for parameterized queries
        
    Returns:
        pandas DataFrame with query results
    """
    conn = get_duckdb_connection()
    
    try:
        if params:
            return conn.execute(query, params).df()
        else:
            return conn.execute(query).df()
    except Exception as e:
        raise Exception(f"Query execution failed: {str(e)}")


def create_table_from_sqlalchemy():
    """
    Create a view in DuckDB that mirrors the SQLAlchemy analytics_events table.
    This allows querying the data through DuckDB.
    """
    conn = get_duckdb_connection()
    
    try:
        # Try to create a view from PostgreSQL table if available
        conn.execute("""
            CREATE OR REPLACE VIEW analytics_events AS 
            SELECT * FROM postgres_db.public.analytics_events;
        """)
        print("Created DuckDB view for analytics_events from PostgreSQL")
    except Exception as e:
        print(f"Could not create view from PostgreSQL: {e}")
        # Fallback: create empty table structure and load from SQLite
        conn.execute("""
            CREATE TABLE IF NOT EXISTS analytics_events (
                id INTEGER PRIMARY KEY,
                event_name VARCHAR NOT NULL,
                event_category VARCHAR,
                user_id VARCHAR,
                properties VARCHAR,
                value DOUBLE,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        print("Created local DuckDB table for analytics_events")
        
        # Try to load data from SQLite
        try:
            import os
            db_path = os.path.join(os.path.dirname(__file__), "..", "analytics.db")
            if os.path.exists(db_path):
                # Install and load SQLite extension
                conn.execute("INSTALL sqlite;")
                conn.execute("LOAD sqlite;")
                
                # Attach SQLite database
                conn.execute(f"ATTACH '{db_path}' AS sqlite_db (TYPE SQLITE);")
                
                # Copy data from SQLite to DuckDB
                conn.execute("""
                    INSERT INTO analytics_events 
                    SELECT * FROM sqlite_db.analytics_events
                    ON CONFLICT (id) DO UPDATE SET
                        event_name = EXCLUDED.event_name,
                        event_category = EXCLUDED.event_category,
                        user_id = EXCLUDED.user_id,
                        properties = EXCLUDED.properties,
                        value = EXCLUDED.value,
                        timestamp = EXCLUDED.timestamp;
                """)
                print("Loaded data from SQLite into DuckDB")
        except Exception as sqlite_err:
            print(f"Could not load SQLite data: {sqlite_err}")


def sync_from_sqlite():
    """Sync data from SQLite to DuckDB."""
    conn = get_duckdb_connection()
    
    try:
        import os
        db_path = os.path.join(os.path.dirname(__file__), "..", "analytics.db")
        if os.path.exists(db_path):
            # Ensure table exists
            conn.execute("""
                CREATE TABLE IF NOT EXISTS analytics_events (
                    id INTEGER PRIMARY KEY,
                    event_name VARCHAR NOT NULL,
                    event_category VARCHAR,
                    user_id VARCHAR,
                    properties VARCHAR,
                    value DOUBLE,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            # Clear existing data
            conn.execute("DELETE FROM analytics_events;")
            
            # Check if SQLite is attached
            try:
                conn.execute("SELECT * FROM sqlite_db.analytics_events LIMIT 1;")
            except:
                # Need to attach SQLite
                conn.execute("INSTALL sqlite;")
                conn.execute("LOAD sqlite;")
                conn.execute(f"ATTACH '{db_path}' AS sqlite_db (TYPE SQLITE);")
            
            # Copy fresh data from SQLite
            conn.execute(f"""
                INSERT INTO analytics_events 
                SELECT * FROM sqlite_db.analytics_events;
            """)
            print("Synced data from SQLite to DuckDB")
            return True
    except Exception as e:
        print(f"Sync failed: {e}")
        return False



def close_connection():
    """Close DuckDB connection."""
    global _conn
    if _conn:
        _conn.close()
        _conn = None
