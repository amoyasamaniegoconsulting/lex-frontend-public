from pydantic import BaseModel
from typing import Optional

# 🟢 Schema para FlowNode
class FlowNodeBase(BaseModel):
    name: str
    description: Optional[str] = ""
    type: str
    label: str
    status: str
    positionX: int
    positionY: int
    flowId: Optional[int] = None
    typeNodeId: int
    active: Optional[bool] = True


class FlowNodeCreate(FlowNodeBase):
    pass


class FlowNodeResponse(FlowNodeBase):
    id: int

    class Config:
        from_attributes = True

