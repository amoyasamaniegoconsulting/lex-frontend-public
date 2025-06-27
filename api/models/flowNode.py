from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from api.database import Base


class FlowNode(Base):
    __tablename__ = "FlowNode"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, default="")

    type = Column(String, nullable=False)
    label = Column(String, nullable=False)
    status = Column(String, nullable=False)
    positionX = Column(Integer, nullable=False)
    positionY = Column(Integer, nullable=False)

    flowId = Column(Integer, ForeignKey("Flow.id"), nullable=True)
    flow = relationship("Flow", back_populates="flowNodes")
    
    typeNodeId = Column(Integer, ForeignKey("TypeNode.id"), nullable=False)
    typeNode = relationship("TypeNode", back_populates="flowNodes")

    active = Column(Boolean, default=True)

    # Relaciones
    sourceEdges = relationship("FlowEdge", foreign_keys="[FlowEdge.sourceNodeId]", back_populates="sourceNode")
    targetEdges = relationship("FlowEdge", foreign_keys="[FlowEdge.targetNodeId]", back_populates="targetNode")


