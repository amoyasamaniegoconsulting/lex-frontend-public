from pydantic import BaseModel

class FrequencyBase(BaseModel):
    id: int
    name: str
    days: int
    active: bool

    class Config:
        from_attributes = True
