import './EventList.css';

function EventList({ events, isLoading, error }) {
  if (isLoading) {
    return <div className="event-list loading">Loading events...</div>;
  }

  if (error) {
    return <div className="event-list error">Error: {error}</div>;
  }

  if (!events || events.length === 0) {
    return (
      <div className="event-list empty">
        No events yet. Create your first analytics event above!
      </div>
    );
  }

  return (
    <div className="event-list">
      <h2>Analytics Events ({events.length})</h2>
      <div className="events-container">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3>{event.event_name}</h3>
              <span className="event-id">#{event.id}</span>
            </div>
            <div className="event-details">
              {event.event_category && (
                <div className="event-detail">
                  <strong>Category:</strong> {event.event_category}
                </div>
              )}
              {event.user_id && (
                <div className="event-detail">
                  <strong>User ID:</strong> {event.user_id}
                </div>
              )}
              {event.properties && (
                <div className="event-detail">
                  <strong>Properties:</strong> {event.properties}
                </div>
              )}
              {event.value !== null && (
                <div className="event-detail">
                  <strong>Value:</strong> {event.value}
                </div>
              )}
              <div className="event-detail">
                <strong>Timestamp:</strong>{' '}
                {new Date(event.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;
