from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.database import get_db
from api.services.flowNodeService import FlowNodeService

router = APIRouter(prefix="/flowNode", tags=["FlowNodes"])

# Ruta para obtener todos los SourceNodes
@router.get("/", response_model=list)
async def read_source_nodes(db: AsyncSession = Depends(get_db)):
    return await FlowNodeService.get_all_source_nodes(db)
