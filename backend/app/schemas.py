from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class AnalyticsEventBase(BaseModel):
    """Base schema for analytics events."""
    event_name: str = Field(..., description="Name of the event")
    event_category: Optional[str] = Field(None, description="Category of the event")
    user_id: Optional[str] = Field(None, description="User identifier")
    properties: Optional[str] = Field(None, description="JSON string of event properties")
    value: Optional[float] = Field(None, description="Numeric value associated with event")


class AnalyticsEventCreate(AnalyticsEventBase):
    """Schema for creating analytics events."""
    pass


class AnalyticsEventResponse(AnalyticsEventBase):
    """Schema for analytics event responses."""
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


class HealthResponse(BaseModel):
    """Schema for health check response."""
    status: str
    message: str
