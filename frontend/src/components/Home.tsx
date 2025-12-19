import { useState, useEffect } from 'react';
import EventForm from './EventForm';
import EventList from './EventList';
import QueryPanel from './QueryPanel';
import SQLRoomsPanel from './SQLRoomsPanel';
import { analyticsApi, AnalyticsEvent, AnalyticsEventCreate, HealthResponse } from '../services/api';

function Home() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyticsApi.getEvents();
      setEvents(data);
    } catch (err) {
      setError((err as Error).message);
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

  const handleEventCreated = async (eventData: AnalyticsEventCreate) => {
    await analyticsApi.createEvent(eventData);
    await fetchEvents(); // Refresh the list
  };

  return (
    <>
      <header className="app-header">
        <h1>Analytics Stack</h1>
        <div className="header-info">
          <p>FastAPI + React + SQLRooms + DuckDB + PostgreSQL</p>
          {healthStatus && (
            <div className={`health-status ${healthStatus.status}`}>
              Backend: {healthStatus.status}
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <EventForm onEventCreated={handleEventCreated} />
        <SQLRoomsPanel />
        <QueryPanel />
        <EventList events={events} isLoading={isLoading} error={error} />
      </main>
    </>
  );
}

export default Home;
