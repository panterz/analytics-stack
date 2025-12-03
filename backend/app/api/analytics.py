from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import AnalyticsEvent
from ..schemas import AnalyticsEventCreate, AnalyticsEventResponse

router = APIRouter()


@router.post("/events", response_model=AnalyticsEventResponse, status_code=201)
def create_event(event: AnalyticsEventCreate, db: Session = Depends(get_db)):
    """Create a new analytics event."""
    db_event = AnalyticsEvent(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.get("/events", response_model=List[AnalyticsEventResponse])
def get_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all analytics events with pagination."""
    events = db.query(AnalyticsEvent).offset(skip).limit(limit).all()
    return events


@router.get("/events/{event_id}", response_model=AnalyticsEventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get a specific analytics event by ID."""
    event = db.query(AnalyticsEvent).filter(AnalyticsEvent.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event
