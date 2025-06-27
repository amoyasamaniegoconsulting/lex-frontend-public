from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.models.flow import Flow
from api.errors import AppError
import logging

logger = logging.getLogger(__name__)

class FlowRepository:
    @staticmethod
    async def get_all(db: AsyncSession):
        try:
            result = await db.execute(select(Flow))
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Database error in get_all: {e}", exc_info=True)
            raise AppError.DATABASE_ERROR()  # Lanza un error de base de datos si ocurre algún problema

    @staticmethod
    async def get_by_id(db: AsyncSession, process_id: int):
        if process_id <= 0:
            raise AppError.INVALID_ID("Process", process_id)  # Lanza un error si el ID no es válido
        
        result = await db.execute(select(Flow).where(Flow.id == process_id))
        process = result.scalars().first()

        if not process:
            raise AppError.NOT_FOUND("Process", process_id)  # Lanza un error si el proceso no se encuentra

        return process
