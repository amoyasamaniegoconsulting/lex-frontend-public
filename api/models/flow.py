from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from api.database import Base

class Flow(Base):
    __tablename__ = "Flow"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    active = Column(Boolean, default=True)

    flowNodes = relationship("FlowNode", back_populates="flow")
    # workflows = relationship("Workflow", back_populates="flow")
