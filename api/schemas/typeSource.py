from pydantic import BaseModel

class TypeSourceBase(BaseModel):
    id: int
    name: str
    active: bool

    class Config:
        from_attributes = True
