from pydantic import BaseModel
from typing import List, Optional



# 🟢 Schema para TypeNode
class TypeNodeBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = ""
    active: Optional[bool] = True


class TypeNodeCreate(TypeNodeBase):
    pass


class TypeNodeResponse(TypeNodeBase):
    id: int

    class Config:
        from_attributes = True
