import { useState, ChangeEvent, FormEvent } from 'react';
import './EventForm.css';
import { AnalyticsEventCreate } from '../services/api';

interface EventFormProps {
  onEventCreated: (eventData: AnalyticsEventCreate) => Promise<void>;
}

interface FormData {
  event_name: string;
  event_category: string;
  user_id: string;
  properties: string;
  value: string;
}

function EventForm({ onEventCreated }: EventFormProps) {
  const [formData, setFormData] = useState<FormData>({
    event_name: '',
    event_category: '',
    user_id: '',
    properties: '',
    value: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const eventData: AnalyticsEventCreate = {
        event_name: formData.event_name,
        event_category: formData.event_category || null,
        user_id: formData.user_id || null,
        properties: formData.properties || null,
        value: formData.value ? parseFloat(formData.value) : null,
      };

      await onEventCreated(eventData);

      // Reset form
      setFormData({
        event_name: '',
        event_category: '',
        user_id: '',
        properties: '',
        value: '',
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="event-form">
      <h2>Create Analytics Event</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="event_name">Event Name *</label>
          <input
            type="text"
            id="event_name"
            name="event_name"
            value={formData.event_name}
            onChange={handleChange}
            required
            placeholder="e.g., page_view, button_click"
          />
        </div>

        <div className="form-group">
          <label htmlFor="event_category">Event Category</label>
          <input
            type="text"
            id="event_category"
            name="event_category"
            value={formData.event_category}
            onChange={handleChange}
            placeholder="e.g., navigation, user_action"
          />
        </div>

        <div className="form-group">
          <label htmlFor="user_id">User ID</label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            placeholder="e.g., user123"
          />
        </div>

        <div className="form-group">
          <label htmlFor="properties">Properties (JSON string)</label>
          <input
            type="text"
            id="properties"
            name="properties"
            value={formData.properties}
            onChange={handleChange}
            placeholder='e.g., {"page": "/home"}'
          />
        </div>

        <div className="form-group">
          <label htmlFor="value">Value</label>
          <input
            type="number"
            id="value"
            name="value"
            step="0.01"
            value={formData.value}
            onChange={handleChange}
            placeholder="e.g., 1.0"
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}

export default EventForm;
