from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from .frequency import FrequencyBase
from .source import SourceBase

class OriginBase(BaseModel):
    sourceId: str
    originName: str
    createdDate: datetime
    createdUser: str
    lastModified: datetime
    extension: str
    url: str
    cutOffDate: Optional[datetime]
    frequencyId: Optional[int]
    version: int
    active: bool



class OriginResponse(OriginBase):
    id: str
    
    class Config:
        from_attributes = True
