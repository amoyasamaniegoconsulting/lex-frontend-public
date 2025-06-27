from typing import List, Dict, Optional
from .columns import FT003_COLUMNS_EN
from io import BytesIO
import pandas as pd

class Data:


    @staticmethod
    def read_file_data(file: BytesIO, file_extension: str, limit: Optional[int]) -> List[Dict[str, str]]:
        if file_extension == 'csv':
            df = pd.read_csv(file)
        elif file_extension == 'xlsx':
            df = pd.read_excel(file)
        else:
            raise ValueError("Unsupported file type")

        # Aplicamos el límite de filas solo si es mayor que 0
        if limit and limit > 0:
            df = df.head(limit)
        
        # Resultado final en el formato requerido
        result = []
        
        for col in df.columns:
            normalized_col = col.lower()
            translated_col = FT003_COLUMNS_EN.get(normalized_col, col)  # usa traducción o valor original
            column_data = {
                'column': translated_col,
                'type': 'string' if df[col].dtype == 'object' else str(df[col].dtype),
                'values': df[col].fillna("").tolist()  # Reemplazamos NaN por ""
            }
            result.append(column_data)
        
        return result
    
