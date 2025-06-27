from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.models.balances.dailyBalance import DailyBalance
from api.models.balances.weeklyBalance import WeeklyBalance
from api.models.balances.monthlyBalance import MonthlyBalance
from api.models.balances.bimonthlyBalance import BimonthlyBalance
from api.models.balances.quarterlyBalance import QuarterlyBalance
from api.models.balances.semiannualBalance import SemiannualBalance
from api.models.balances.annualBalance import AnnualBalance

from api.errors import AppError
import logging
from typing import List

logger = logging.getLogger(__name__)

class BalancesRepository:
    @staticmethod
    async def get_by_origin_id(db: AsyncSession, frequencyId: int, origin_id: str):
        if not origin_id:
            raise AppError.INVALID_ID("Origin", origin_id)
        
        try:
            
            # Aplica filtro según frequencyId
            if frequencyId == 1:
                result = await db.execute(
                    select(DailyBalance).where(DailyBalance.originId == origin_id)
                )
            elif frequencyId == 2:
                result = await db.execute(
                    select(WeeklyBalance).where(WeeklyBalance.originId == origin_id)
                )
            elif frequencyId == 3:
                result = await db.execute(
                    select(MonthlyBalance).where(MonthlyBalance.originId == origin_id)
                )
            elif frequencyId == 4:
                result = await db.execute(
                    select(BimonthlyBalance).where(BimonthlyBalance.originId == origin_id)
                )
            elif frequencyId == 5:
                result = await db.execute(
                    select(QuarterlyBalance).where(QuarterlyBalance.originId == origin_id)
                )
            elif frequencyId == 6:
                result = await db.execute(
                    select(SemiannualBalance).where(SemiannualBalance.originId == origin_id)
                )
            elif frequencyId == 7:
                result = await db.execute(
                    select(AnnualBalance).where(AnnualBalance.originId == origin_id)
                )
            else:
                raise AppError.INVALID_ID("Frecuencia", frequencyId)
            
            
            balances = result.scalars().all()

            if not balances:
                raise AppError.NOT_FOUND("Balances by Origin", origin_id)
            
            return balances

        except Exception as e:
            logger.error(f"Database error in get_by_origin_id: {e}", exc_info=True)
            raise AppError.DATABASE_ERROR()
        
    @staticmethod
    async def get_by_origin_ids(db: AsyncSession, frequencyId: int, origin_ids: List[str]):  # Cambiamos origin_id a origin_ids
        if not origin_ids:
            raise AppError.INVALID_ID("Origin", origin_ids)
        
        try:
            
                # Aplica filtro según frequencyId
            if frequencyId == 1:
                result = await db.execute(
                    select(DailyBalance).where(DailyBalance.originId.in_(origin_ids))  # Aquí buscamos múltiples originIds
                )
            elif frequencyId == 2:
                result = await db.execute(
                    select(WeeklyBalance).where(WeeklyBalance.originId.in_(origin_ids))  # Aquí buscamos múltiples originIds
                )
            elif frequencyId == 3:
                result = await db.execute(
                    select(MonthlyBalance).where(MonthlyBalance.originId.in_(origin_ids))  # Aquí buscamos múltiples originIds
                )
            elif frequencyId == 4:
                result = await db.execute(
                    select(BimonthlyBalance).where(BimonthlyBalance.originId.in_(origin_ids))  # Aquí buscamos múltiples originIds
                )
            elif frequencyId == 5:
                result = await db.execute(
                    select(QuarterlyBalance).where(QuarterlyBalance.originId.in_(origin_ids))  # Aquí buscamos múltiples originIds
                )
            elif frequencyId == 6:
                result = await db.execute(
                    select(SemiannualBalance).where(SemiannualBalance.originId.in_(origin_ids))  # Aquí buscamos múltiples originIds
                )
            elif frequencyId == 7:
                result = await db.execute(
                    select(AnnualBalance).where(AnnualBalance.originId.in_(origin_ids))  # Aquí buscamos múltiples originIds
                )
            else:
                raise AppError.INVALID_ID("Frecuencia", frequencyId)
            
            

            balances = result.scalars().all()

            if not balances:
                raise AppError.NOT_FOUND("Balances by Origin", origin_ids)
            
            return balances

        except Exception as e:
            logger.error(f"Database error in get_by_origin_ids: {e}", exc_info=True)
            raise AppError.DATABASE_ERROR()

