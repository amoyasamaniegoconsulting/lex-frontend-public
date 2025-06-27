from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.database import get_db
from api.services.flowEdgeService import FlowEdgeService

router = APIRouter(prefix="/source-edge", tags=["SourceEdges"])

# Ruta para obtener todos los SourceEdges
@router.get("/")
async def read_source_edges(db: AsyncSession = Depends(get_db)):
    return await FlowEdgeService.get_all_source_edges(db)

# Ruta para obtener un SourceEdge por ID
@router.get("/{edge_id}")
async def read_source_edge(edge_id: int, db: AsyncSession = Depends(get_db)):
    return await FlowEdgeService.get_source_edge_by_id(db, edge_id)
