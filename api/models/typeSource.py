from sqlalchemy import Boolean, Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from api.database import Base  # Asegúrate de importar Base desde tu setup


class TypeSource(Base):
    __tablename__ = "TypeSource"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    active = Column(Boolean, default=True)
    sources = relationship("Source", back_populates="typeSource")