from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Union

class DataFT(BaseModel):
    dataClean:List[Dict]= Field(..., description="Datos limpios")
    businessLine: Optional[str] = None
    debtorConcept: Optional[str] = None
    municipalCode: Optional[str] = None
    subsequentMeasurement: Optional[str] = None
    accountsEradicated: List[str] = []
    accountsIdentify: List[str] = []