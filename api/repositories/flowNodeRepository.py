from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.models.flowNode import FlowNode
from api.errors import AppError


class FlowNodeRepository:
    @staticmethod
    async def get_all_source_nodes(db: AsyncSession):
        try:
            result = await db.execute(select(FlowNode))
            return result.scalars().all()
        except Exception:
            raise AppError.DATABASE_ERROR()  # Es importante llamar a la función con paréntesis
