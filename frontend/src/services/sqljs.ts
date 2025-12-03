import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

// Configure SQL.js location - can be overridden via environment variable
const SQLJS_CDN = import.meta.env.VITE_SQLJS_CDN || 'https://sql.js.org/dist/';

export const initDatabase = async (): Promise<Database> => {
  if (db) return db;

  try {
    const SQL = await initSqlJs({
      // Use CDN by default, but can be configured to use local copy
      locateFile: (file) => `${SQLJS_CDN}${file}`,
    });

    db = new SQL.Database();

    // Create a sample table for local analytics caching
    db.run(`
      CREATE TABLE IF NOT EXISTS local_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_name TEXT NOT NULL,
        event_category TEXT,
        user_id TEXT,
        properties TEXT,
        value REAL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        synced INTEGER DEFAULT 0
      );
    `);

    console.log('SQL.js database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize SQL.js:', error);
    throw error;
  }
};

export const getDatabase = (): Database | null => {
  return db;
};

// Add a local event to the SQL.js database
export const addLocalEvent = async (
  eventName: string,
  eventCategory: string | null = null,
  userId: string | null = null,
  properties: string | null = null,
  value: number | null = null
): Promise<void> => {
  const database = await initDatabase();
  
  database.run(
    'INSERT INTO local_events (event_name, event_category, user_id, properties, value) VALUES (?, ?, ?, ?, ?)',
    [eventName, eventCategory, userId, properties, value]
  );
};

export interface LocalEvent {
  id: number;
  event_name: string;
  event_category: string | null;
  user_id: string | null;
  properties: string | null;
  value: number | null;
  timestamp: string;
  synced: number;
}

// Helper function to validate and convert row to LocalEvent
const validateLocalEvent = (row: Record<string, unknown>): LocalEvent => {
  // Validate required fields
  if (typeof row.id !== 'number') {
    throw new Error('Invalid event: id must be a number');
  }
  if (typeof row.event_name !== 'string') {
    throw new Error('Invalid event: event_name must be a string');
  }
  
  return {
    id: row.id,
    event_name: row.event_name,
    event_category: row.event_category === null ? null : String(row.event_category),
    user_id: row.user_id === null ? null : String(row.user_id),
    properties: row.properties === null ? null : String(row.properties),
    value: row.value === null ? null : Number(row.value),
    timestamp: String(row.timestamp || ''),
    synced: Number(row.synced || 0),
  };
};

// Get all local events
export const getLocalEvents = async (): Promise<LocalEvent[]> => {
  const database = await initDatabase();
  const result = database.exec('SELECT * FROM local_events ORDER BY id DESC');
  
  if (result.length === 0) return [];
  
  const columns = result[0].columns;
  const values = result[0].values;
  
  return values.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return validateLocalEvent(obj);
  });
};

// Clear all local events
export const clearLocalEvents = async (): Promise<void> => {
  const database = await initDatabase();
  database.run('DELETE FROM local_events');
};

// Export the database as a binary array (for saving/loading)
export const exportDatabase = async (): Promise<Uint8Array> => {
  const database = await initDatabase();
  return database.export();
};
