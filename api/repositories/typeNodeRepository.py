from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.models.typeNode import TypeNode
from api.errors import AppError


class TypeNodeRepository:
    @staticmethod
    async def get_all_type_nodes(db: AsyncSession):
        try:
            result = await db.execute(select(TypeNode))
            return result.scalars().all()
        except Exception:
            raise AppError.DATABASE_ERROR()  # Es importante llamar a la función con paréntesis
    
    @staticmethod
    async def get_type_node_by_id(db: AsyncSession, type_id: int):
        if type_id <= 0:
            raise AppError.INVALID_ID("TypeNode", type_id)  # 🔹 Llama la función correctamente
        
        result = await db.execute(select(TypeNode).where(TypeNode.id == type_id))
        type_node = result.scalars().first()
        
        if not type_node:
            raise AppError.NOT_FOUND("TypeNode", type_id)  # 🔹 Llama la función correctamente
        
        return type_node
