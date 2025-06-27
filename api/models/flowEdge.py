from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from api.database import Base

class FlowEdge(Base):
    __tablename__ = "FlowEdge"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, default="")

    sourceNodeId = Column(Integer, ForeignKey("FlowNode.id"), nullable=True)
    targetNodeId = Column(Integer, ForeignKey("FlowNode.id"), nullable=True)

    active = Column(Boolean, default=True)

    sourceNode = relationship("FlowNode", foreign_keys=[sourceNodeId], back_populates="sourceEdges")
    targetNode = relationship("FlowNode", foreign_keys=[targetNodeId], back_populates="targetEdges")

