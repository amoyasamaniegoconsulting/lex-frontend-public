# api/routers/balance_router.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from api.database import get_db
from api.services.balancesService import BalancesService
from typing import List

router = APIRouter(prefix="/flow", tags=["Flow"])


@router.get("/data/clean", response_model=List[dict])
async def get_balances(
    originId: List[str] = Query(...), 
    frequencyId: int = Query(...), 
    db: AsyncSession = Depends(get_db)
):
    # Validación de que el campo 'originId' tenga elementos
    if not originId or any(item is None or item.strip() == '' for item in originId):
        raise HTTPException(status_code=400, detail="Las fuentes están vacías")
    
        # Validación de que el campo 'originId' tenga elementos
    if not frequencyId:
        raise HTTPException(status_code=400, detail="La frecuencia no esta especificada")
    
    try:
        
        # Si la validación es exitosa, procesamos la solicitud
        return await BalancesService.process_data(originId,frequencyId, db)
    except Exception as e:
        # Si ocurre algún error inesperado, devolvemos un 500
        raise HTTPException(status_code=500, detail=str(e))

