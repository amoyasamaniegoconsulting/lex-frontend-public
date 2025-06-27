from sqlalchemy.ext.asyncio import AsyncSession
from api.repositories.flowNodeRepository import FlowNodeRepository
from api.schemas.flowNode import FlowNodeResponse  # Asegúrate de tener este esquema

class FlowNodeService:
    @staticmethod
    async def get_all_source_nodes(db: AsyncSession):
        # Llamar al repositorio para obtener todos los SourceNodes
        source_nodes = await FlowNodeRepository.get_all_source_nodes(db)
        
        # Convertir los modelos SQLAlchemy en objetos Pydantic para la validación y respuesta
        return [FlowNodeResponse.model_validate(node) for node in source_nodes]
