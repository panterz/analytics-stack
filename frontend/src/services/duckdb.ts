import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js', import.meta.url).toString(),
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js', import.meta.url).toString(),
  },
};

let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;

export interface QueryResult {
  columns: string[];
  data: unknown[][];
  rowCount: number;
}

/**
 * Initialize DuckDB WASM instance
 */
export async function initDuckDB(): Promise<duckdb.AsyncDuckDB> {
  if (db) return db;

  try {
    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.ConsoleLogger();
    
    db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule);
    
    console.log('DuckDB WASM initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize DuckDB WASM:', error);
    throw error;
  }
}

/**
 * Get or create a DuckDB connection
 */
export async function getConnection(): Promise<duckdb.AsyncDuckDBConnection> {
  if (!conn) {
    const database = await initDuckDB();
    conn = await database.connect();
    
    // Create local analytics table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS local_analytics (
        id INTEGER PRIMARY KEY,
        event_name VARCHAR NOT NULL,
        event_category VARCHAR,
        user_id VARCHAR,
        properties VARCHAR,
        value DOUBLE,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        synced BOOLEAN DEFAULT FALSE
      );
    `);
    
    console.log('DuckDB connection established');
  }
  
  return conn;
}

/**
 * Execute a SQL query locally in DuckDB WASM
 */
export async function executeLocalQuery(query: string): Promise<QueryResult> {
  const connection = await getConnection();
  
  try {
    const result = await connection.query(query);
    const columns = result.schema.fields.map(field => field.name);
    const data: unknown[][] = [];
    
    // Convert Arrow table to array of arrays
    for (let i = 0; i < result.numRows; i++) {
      const row: unknown[] = [];
      for (let j = 0; j < result.numCols; j++) {
        const col = result.getChildAt(j);
        row.push(col?.get(i));
      }
      data.push(row);
    }
    
    return {
      columns,
      data,
      rowCount: result.numRows,
    };
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
}

/**
 * Insert data into local DuckDB table
 */
export async function insertLocalEvent(
  eventName: string,
  eventCategory: string | null = null,
  userId: string | null = null,
  properties: string | null = null,
  value: number | null = null
): Promise<void> {
  const connection = await getConnection();
  
  const query = `
    INSERT INTO local_analytics (event_name, event_category, user_id, properties, value, synced)
    VALUES (?, ?, ?, ?, ?, FALSE);
  `;
  
  await connection.query(query, [eventName, eventCategory, userId, properties, value]);
}

/**
 * Get all local events
 */
export async function getLocalEvents(): Promise<QueryResult> {
  return executeLocalQuery('SELECT * FROM local_analytics ORDER BY id DESC;');
}

/**
 * Clear local data
 */
export async function clearLocalData(): Promise<void> {
  const connection = await getConnection();
  await connection.query('DELETE FROM local_analytics;');
}

/**
 * Close DuckDB connection
 */
export async function closeDuckDB(): Promise<void> {
  if (conn) {
    await conn.close();
    conn = null;
  }
  if (db) {
    await db.terminate();
    db = null;
  }
}
