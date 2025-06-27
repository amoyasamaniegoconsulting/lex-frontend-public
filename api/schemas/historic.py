from datetime import datetime
from pydantic import BaseModel
from .source import SourceBase

class HistoricBase(BaseModel):
    sourceId: str
    origin: str
    createdDate: datetime
    createdUser: str
    url: str
    process: str



class HistoricResponse(HistoricBase):
    id: str
    
    class Config:
        from_attributes = True
