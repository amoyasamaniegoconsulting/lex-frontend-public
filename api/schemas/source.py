from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from .typeSource import TypeSourceBase

class SourceBase(BaseModel):
    name: str
    nameFather: str
    createdDate: datetime
    active: bool
    typeSourceId: int



class SourceResponse(SourceBase):
    id: str
    
    class Config:
        from_attributes = True
