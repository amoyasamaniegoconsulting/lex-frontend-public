from sqlalchemy.ext.asyncio import AsyncSession
from api.repositories.typeNodeRepository import TypeNodeRepository
from api.schemas.typeNode import TypeNodeResponse  # Asegúrate de tener este esquema

class TypeNodeService:
    @staticmethod
    async def get_all_type_nodes(db: AsyncSession):
        # Llamar al repositorio para obtener todos los TypeNodes
        type_nodes = await TypeNodeRepository.get_all_type_nodes(db)
        
        # Convertir los modelos SQLAlchemy en objetos Pydantic para la validación y respuesta
        return [TypeNodeResponse.model_validate(node) for node in type_nodes]

    @staticmethod
    async def get_type_node_by_id(db: AsyncSession, type_id: int):
        # Llamar al repositorio para obtener un TypeNode por ID
        type_node = await TypeNodeRepository.get_type_node_by_id(db, type_id)
        
        # Convertir el modelo SQLAlchemy en un objeto Pydantic para la respuesta
        return TypeNodeResponse.model_validate(type_node)
