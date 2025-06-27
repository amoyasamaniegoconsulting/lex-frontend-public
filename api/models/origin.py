from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from api.database import Base
from .source import Source

class Origin(Base):
    __tablename__ = "Origin"  # Mantener la mayúscula, ya que así se llama la tabla
    
    id = Column(String, primary_key=True, default=str(uuid.uuid4()))
    originName = Column(String)

    createdDate = Column(DateTime, server_default=func.now())
    userId = Column(String, default="bot")
    lastModified = Column(DateTime, server_default=func.now(), onupdate=func.now())
    extension = Column(String)
    url = Column(String)
    cutOffDate = Column(DateTime, nullable=True)

    sourceId = Column(String, ForeignKey("Source.id"))
    source = relationship("Source",foreign_keys=[sourceId],  back_populates="origins")
    
    frequencyId = Column(Integer, ForeignKey("Frequency.id"), nullable=True)
    frequency = relationship("Frequency", foreign_keys=[frequencyId], back_populates="origins")

    version = Column(Integer, default=1)
    active = Column(Boolean, default=False)

    dailyBalances = relationship("DailyBalance", back_populates="origin")
    monthlyBalances = relationship("MonthlyBalance", back_populates="origin")
    weeklyBalances = relationship("WeeklyBalance", back_populates="origin")
    bimonthlyBalances = relationship("BimonthlyBalance", back_populates="origin")
    quarterlyBalances = relationship("QuarterlyBalance", back_populates="origin")
    semiannualBalances = relationship("SemiannualBalance", back_populates="origin")
    annualBalances = relationship("AnnualBalance", back_populates="origin")
