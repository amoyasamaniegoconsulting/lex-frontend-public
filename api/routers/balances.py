from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from api.database import get_db
from api.services.balancesService import BalancesService
from typing import List

router = APIRouter()


@router.get("/balances/origin")
async def read_balances_by_origin(
    originId: List[str] = Query(...),  # Acepta una lista de originId
    frequencyId: int = Query(...),  
    db: AsyncSession = Depends(get_db)
):
    # Aquí va la lógica para procesar múltiples originId
    return await BalancesService.get_by_origin_ids(db,frequencyId, originId)
