import { useState } from 'react';
import './QueryPanel.css';
import { executeBackendQuery, QueryResponse } from '../services/duckdbApi';

function QueryPanel() {
  const [query, setQuery] = useState<string>('SELECT * FROM analytics_events LIMIT 10');
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const handleExecuteQuery = async () => {
    setIsExecuting(true);
    setError(null);
    setResult(null);

    try {
      const queryResult = await executeBackendQuery(query);
      setResult(queryResult);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsExecuting(false);
    }
  };

  const sampleQueries = [
    {
      name: 'All Events',
      query: 'SELECT * FROM analytics_events ORDER BY timestamp DESC LIMIT 10',
    },
    {
      name: 'Events by Category',
      query: 'SELECT event_category, COUNT(*) as count FROM analytics_events GROUP BY event_category',
    },
    {
      name: 'User Activity',
      query: 'SELECT user_id, COUNT(*) as event_count FROM analytics_events GROUP BY user_id ORDER BY event_count DESC',
    },
  ];

  return (
    <div className="query-panel">
      <h2>DuckDB Query Panel</h2>
      <p className="query-panel-description">
        Execute SQL queries against DuckDB (connected to PostgreSQL)
      </p>

      <div className="sample-queries">
        <label>Sample Queries:</label>
        <div className="sample-query-buttons">
          {sampleQueries.map((sample) => (
            <button
              key={sample.name}
              onClick={() => setQuery(sample.query)}
              className="sample-query-btn"
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      <div className="query-input">
        <label htmlFor="query">SQL Query:</label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={5}
          placeholder="Enter your SQL query here..."
        />
      </div>

      <button
        onClick={handleExecuteQuery}
        disabled={isExecuting || !query.trim()}
        className="execute-btn"
      >
        {isExecuting ? 'Executing...' : 'Execute Query'}
      </button>

      {error && (
        <div className="query-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="query-result">
          <h3>Results ({result.row_count} rows)</h3>
          {result.data.length > 0 ? (
            <div className="result-table-container">
              <table className="result-table">
                <thead>
                  <tr>
                    {Object.keys(result.data[0]).map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((value, vidx) => (
                        <td key={vidx}>{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default QueryPanel;
