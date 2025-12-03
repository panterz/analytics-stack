from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base


class AnalyticsEvent(Base):
    """Model for analytics events."""
    __tablename__ = "analytics_events"

    id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String, index=True, nullable=False)
    event_category = Column(String, index=True)
    user_id = Column(String, index=True)
    properties = Column(String)  # JSON string
    value = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<AnalyticsEvent(id={self.id}, event_name='{self.event_name}')>"
