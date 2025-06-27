from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Boolean, func
from sqlalchemy.orm import relationship
from api.database import Base


class Historic(Base):
    __tablename__ = "Historic"
    id = Column(String, primary_key=True)
    origin = Column(String)
    createdDate = Column(DateTime, server_default=func.now())
    createdUser = Column(String, default="lex")
    url = Column(String)
    process = Column(String)
    
    sourceId = Column(String, ForeignKey("Source.id"))
    source = relationship("Source", back_populates="historics")