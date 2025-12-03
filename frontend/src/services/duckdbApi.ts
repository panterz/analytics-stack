const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface QueryRequest {
  query: string;
  params?: unknown[];
}

export interface QueryResponse {
  data: Record<string, unknown>[];
  row_count: number;
}

export interface TableInfo {
  table_name: string;
  table_schema: string;
  table_type: string;
}

export interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

/**
 * Execute a SQL query on the backend DuckDB instance
 */
export async function executeBackendQuery(
  query: string,
  params?: unknown[]
): Promise<QueryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/duckdb/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, params }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Query execution failed');
  }

  return response.json();
}

/**
 * List all available tables in the backend DuckDB
 */
export async function listBackendTables(): Promise<TableInfo[]> {
  const response = await fetch(`${API_BASE_URL}/api/duckdb/tables`);

  if (!response.ok) {
    throw new Error('Failed to list tables');
  }

  const data = await response.json();
  return data.tables;
}

/**
 * Get schema information for a specific table
 */
export async function getTableSchema(tableName: string): Promise<ColumnInfo[]> {
  const response = await fetch(`${API_BASE_URL}/api/duckdb/schema/${tableName}`);

  if (!response.ok) {
    throw new Error(`Failed to get schema for table: ${tableName}`);
  }

  const data = await response.json();
  return data.columns;
}

/**
 * Get analytics summary from backend
 */
export async function getAnalyticsSummary(): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_BASE_URL}/api/duckdb/analytics/summary`);

  if (!response.ok) {
    throw new Error('Failed to get analytics summary');
  }

  return response.json();
}

/**
 * Get events grouped by category
 */
export async function getEventsByCategory(): Promise<Record<string, unknown>[]> {
  const response = await fetch(`${API_BASE_URL}/api/duckdb/analytics/events-by-category`);

  if (!response.ok) {
    throw new Error('Failed to get events by category');
  }

  const data = await response.json();
  return data.data;
}
