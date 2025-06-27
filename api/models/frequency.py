from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from api.database import Base

class Frequency(Base):
    __tablename__ = "Frequency"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    days = Column(Integer, nullable=False)
    active = Column(Boolean, default=True)

    # Relación con Origin (uno a muchos)
    origins = relationship("Origin", back_populates="frequency")

    # Relación con BalancesMensual (uno a muchos)
    dailyBalances = relationship("DailyBalance", back_populates="frequency")
    monthlyBalances = relationship("MonthlyBalance", back_populates="frequency")
    weeklyBalances = relationship("WeeklyBalance", back_populates="frequency")
    bimonthlyBalances = relationship("BimonthlyBalance", back_populates="frequency")
    quarterlyBalances = relationship("QuarterlyBalance", back_populates="frequency")
    semiannualBalances = relationship("SemiannualBalance", back_populates="frequency")
    annualBalances = relationship("AnnualBalance", back_populates="frequency")
