from pydantic import BaseModel
from typing import List, Optional


# 🟢 Schema para Process
class FlowBase(BaseModel):
    name: str
    active: Optional[bool] = True


class FlowCreate(FlowBase):
    pass


class FlowResponse(FlowBase):
    id: int

    class Config:
        from_attributes = True

