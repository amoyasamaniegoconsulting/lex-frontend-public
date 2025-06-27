from pydantic import BaseModel
from typing import Optional


# 🟢 Schema para SourceEdge
class FlowEdgeBase(BaseModel):
    name: str
    description: Optional[str] = ""
    sourceNodeId: Optional[int] = None
    targetNodeId: Optional[int] = None
    active: Optional[bool] = True


class FlowEdgeCreate(FlowEdgeBase):
    pass


class FlowEdgeResponse(FlowEdgeBase):
    id: int

    class Config:
        from_attributes = True

