export interface AnalyticsEvent {
  id: number;
  event_name: string;
  event_category: string | null;
  user_id: string | null;
  properties: string | null;
  value: number | null;
  timestamp: string;
}

export interface AnalyticsEventCreate {
  event_name: string;
  event_category?: string | null;
  user_id?: string | null;
  properties?: string | null;
  value?: number | null;
}

export interface HealthResponse {
  status: string;
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const analyticsApi = {
  // Get all analytics events
  async getEvents(): Promise<AnalyticsEvent[]> {
    const response = await fetch(`${API_BASE_URL}/api/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  },

  // Create a new analytics event
  async createEvent(eventData: AnalyticsEventCreate): Promise<AnalyticsEvent> {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    return response.json();
  },

  // Get specific event by ID
  async getEvent(eventId: number): Promise<AnalyticsEvent> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    return response.json();
  },

  // Health check
  async checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  },
};
