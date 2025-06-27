from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from api.database import Base
from .typeSource import TypeSource
from .historic import Historic


class Source(Base):
    __tablename__ = "Source"
    id = Column(String, primary_key=True)
    name = Column(String, unique=True)
    nameFather = Column(String, default="")
    createdDate = Column(DateTime, server_default=func.now())
    active = Column(Boolean, default=False)
    typeSourceId = Column(Integer, ForeignKey("TypeSource.id"), default=1)
    typeSource = relationship("TypeSource", back_populates="sources")
    origins = relationship("Origin", back_populates="source")
    historics = relationship("Historic", back_populates="source")
