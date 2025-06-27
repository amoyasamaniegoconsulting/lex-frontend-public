from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class QuarterlyBalanceBase(BaseModel):
    accountCode: int
    accountName: str
    thirdParty: str
    openingBalance: float
    debits: float
    credits: float
    closingBalance: float
    originId: str
    createdDate: datetime
    userId: str
    lastModified: datetime
    cutOffDate: Optional[datetime]
    frequencyId: Optional[int]
    version: int



class QuarterlyBalanceResponse(QuarterlyBalanceBase):
    id: str
    
    class Config:
        from_attributes = True
