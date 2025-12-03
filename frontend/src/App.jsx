import { useState, useEffect } from 'react';
import './App.css';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import { analyticsApi } from './services/api';

function App() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyticsApi.getEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const health = await analyticsApi.checkHealth();
      setHealthStatus(health);
    } catch (err) {
      console.error('Health check failed:', err);
      setHealthStatus({ status: 'error', message: 'Backend unavailable' });
    }
  };

  useEffect(() => {
    checkHealth();
    fetchEvents();
  }, []);

  const handleEventCreated = async (eventData) => {
    await analyticsApi.createEvent(eventData);
    await fetchEvents(); // Refresh the list
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Analytics Stack</h1>
        <div className="header-info">
          <p>FastAPI + React + SQLAlchemy</p>
          {healthStatus && (
            <div className={`health-status ${healthStatus.status}`}>
              Backend: {healthStatus.status}
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <EventForm onEventCreated={handleEventCreated} />
        <EventList events={events} isLoading={isLoading} error={error} />
      </main>
    </div>
  );
}

export default App;
