import { useSql } from '@sqlrooms/duckdb';
import { useRoomStore } from '../room-store';
import './SQLRoomsPanel.css';

interface EventCount {
  event_category: string;
  count: number;
}

function SQLRoomsPanel() {
  const dbReady = useRoomStore((state) => state.db.isReady);
  const tables = useRoomStore((state) => state.db.tables);

  // Example query using SQLRooms useSql hook
  const { data, isLoading, error } = useSql<EventCount>({
    query: `
      SELECT 
        'Demo' as event_category,
        42 as count
    `,
    enabled: dbReady,
  });

  return (
    <div className="sqlrooms-panel">
      <h2>SQLRooms Integration</h2>
      <p className="sqlrooms-panel-description">
        SQLRooms provides building blocks for React data analytics applications powered by DuckDB WASM
      </p>

      <div className="sqlrooms-status">
        <h3>DuckDB Status</h3>
        <div className="status-item">
          <span className="status-label">Database Ready:</span>
          <span className={`status-value ${dbReady ? 'ready' : 'not-ready'}`}>
            {dbReady ? '✓ Ready' : '✗ Not Ready'}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Available Tables:</span>
          <span className="status-value">{tables.length}</span>
        </div>
      </div>

      <div className="sqlrooms-demo">
        <h3>Demo Query with useSql Hook</h3>
        {isLoading && <p>Loading query results...</p>}
        {error && <div className="query-error">Error: {error.message}</div>}
        {data && (
          <div className="query-result">
            <p>Successfully executed query using SQLRooms!</p>
            <pre>{JSON.stringify(data.toArray(), null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="sqlrooms-features">
        <h3>SQLRooms Features Available</h3>
        <ul>
          <li>✓ In-browser DuckDB WASM integration</li>
          <li>✓ Room-based state management with Zustand</li>
          <li>✓ React hooks for SQL queries (useSql)</li>
          <li>✓ Theme support with ThemeProvider</li>
          <li>✓ Modular architecture with composable slices</li>
          <li>✓ UI components from @sqlrooms/ui</li>
        </ul>
      </div>
    </div>
  );
}

export default SQLRoomsPanel;

