from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.models.flowEdge import FlowEdge
from api.errors import AppError


class FlowEdgeRepository:
    @staticmethod
    async def get_all_source_edges(db: AsyncSession):
        try:
            result = await db.execute(select(FlowEdge))
            return result.scalars().all()
        except Exception:
            raise AppError.DATABASE_ERROR()  # Si hay un error en la base de datos, se lanza una excepción de base de datos

    @staticmethod
    async def get_source_edge_by_id(db: AsyncSession, edge_id: int):
        if edge_id <= 0:
            raise AppError.INVALID_ID("SourceEdge", edge_id)  # Si el ID es inválido, se lanza una excepción
        
        result = await db.execute(select(FlowEdge).where(FlowEdge.id == edge_id))
        edge = result.scalars().first()

        if not edge:
            raise AppError.NOT_FOUND("SourceEdge", edge_id)  # Si no se encuentra el objeto, se lanza una excepción

        return edge
