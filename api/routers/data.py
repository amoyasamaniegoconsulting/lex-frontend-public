from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from fastapi.responses import StreamingResponse
from typing import Dict, List, Optional
from io import BytesIO

from api.utils.thread_executor import run_in_thread
from api.services.dataService import DataService
from api.models.data import DataFT
from api.utils.data import Data

router = APIRouter(prefix="/data", tags=["Data"])

@router.post("/ft")
async def process_data_ft(payload: DataFT):
    try:
        # Validación de campos obligatorios
        if not payload.dataClean:
            raise HTTPException(status_code=400, detail="El campo 'dataClean' es obligatorio.")

        resultData = DataService.process_data_ft(payload)
        return resultData

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/files/read")
async def files_read(
    file: UploadFile = File(...),
    limit: Optional[int] = Query(None, description="Cantidad de filas a leer (0 para todas)")
):
    try:
        if file is None:
            raise HTTPException(status_code=400, detail="El archivo es obligatorio.")

        content = await file.read()
        file_extension = file.filename.split('.')[-1]
        file_io = BytesIO(content)
        file_data = Data.read_file_data(file_io, file_extension, limit)
        return file_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/xml")
async def generate_xml(data: List[Dict]):
    try:
        if not data:
            raise HTTPException(status_code=400, detail="El parámetro 'data' es obligatorio.")

        file_stream, filename = await run_in_thread(DataService.export_to_xml, data)
        return StreamingResponse(file_stream, media_type="application/xml", headers={
            "Content-Disposition": f"attachment; filename={filename}"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/xlsx")
async def generate_xlsx(data: List[Dict]):
    try:
        if not data:
            raise HTTPException(status_code=400, detail="El parámetro 'data' es obligatorio.")

        file_stream, filename = await run_in_thread(DataService.export_to_xlsx, data)
        return StreamingResponse(file_stream, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={
            "Content-Disposition": f"attachment; filename={filename}"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/generate/pdf")
async def generate_pdf(data: List[Dict]):
    try:
        if not data:
            raise HTTPException(status_code=400, detail="El parámetro 'data' es obligatorio.")

        file_stream, filename = await run_in_thread(DataService.export_to_pdf, data)

        return StreamingResponse(
            file_stream,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate/csv")
async def generate_csv(data: List[Dict]):
    try:
        if not data:
            raise HTTPException(status_code=400, detail="El parámetro 'data' es obligatorio.")

        file_stream, filename = await run_in_thread(DataService.export_to_csv, data)

        return StreamingResponse(
            file_stream,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))