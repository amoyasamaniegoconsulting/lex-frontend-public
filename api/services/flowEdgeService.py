from sqlalchemy.ext.asyncio import AsyncSession
from api.repositories.flowEdgeRepository import FlowEdgeRepository
from api.schemas.flowEdge import FlowEdgeResponse  # Asegúrate de tener este esquema

class FlowEdgeService:
    @staticmethod
    async def get_all_source_edges(db: AsyncSession):
        # Llamar al repositorio para obtener todos los SourceEdges
        source_edges = await FlowEdgeRepository.get_all_source_edges(db)
        
        # Puedes convertir los modelos SQLAlchemy en objetos Pydantic para la validación y respuesta
        return [FlowEdgeResponse.model_validate(edge) for edge in source_edges]

    @staticmethod
    async def get_source_edge_by_id(db: AsyncSession, edge_id: int):
        # Llamar al repositorio para obtener un SourceEdge por ID
        source_edge = await FlowEdgeRepository.get_source_edge_by_id(db, edge_id)
        
        # Convertirlo a un objeto Pydantic para la respuesta
        return FlowEdgeResponse.model_validate(source_edge)
