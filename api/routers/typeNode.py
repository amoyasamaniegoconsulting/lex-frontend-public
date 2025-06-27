from api.schemas.typeNode import TypeNodeResponse
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.database import get_db
from api.services.typeNodeService import TypeNodeService

router = APIRouter(prefix="/type-node", tags=["TypeNodes"])

# Ruta para obtener todos los TypeNodes
@router.get("/")
async def read_type_nodes(db: AsyncSession = Depends(get_db)):
    return await TypeNodeService.get_all_type_nodes(db) 

# Ruta para obtener un TypeNode por ID
@router.get("/{type_id}", response_model=TypeNodeResponse)
async def read_type_node(type_id: int, db: AsyncSession = Depends(get_db)):
    return await TypeNodeService.get_type_node_by_id(db, type_id) 
