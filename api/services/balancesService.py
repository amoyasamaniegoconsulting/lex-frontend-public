from api.schemas.balances.dailyBalance import DailyBalanceBase
from api.schemas.balances.weeklyBalance import WeeklyBalanceBase
from api.schemas.balances.monthlyBalance import MonthlyBalanceResponse
from api.schemas.balances.bimonthlyBalance import BimonthlyBalanceResponse
from api.schemas.balances.quarterlyBalance import QuarterlyBalanceResponse
from api.schemas.balances.semiannualBalance import SemiannualBalanceResponse
from api.schemas.balances.annualBalance import AnnualBalanceResponse
from sqlalchemy.ext.asyncio import AsyncSession
from api.repositories.balancesRepository import BalancesRepository
from pyspark.sql.functions import col, trim, length
from typing import List
from api.spark_session import spark
from api.utils.columns import FT003_COLUMNS_EN

class BalancesService:

    @staticmethod
    async def get_by_origin_id(db: AsyncSession, frequencyId: int, origin_id: str):
        print(origin_id)
        balances = await BalancesRepository.get_by_origin_id(db, frequencyId, origin_id)
        
         # Aplica filtro según frequencyId
        if frequencyId == 1:
            return [DailyBalanceBase.model_validate(balance) for balance in balances]
        elif frequencyId == 2:
            return [WeeklyBalanceBase.model_validate(balance) for balance in balances]
        elif frequencyId == 3:
            return [MonthlyBalanceResponse.model_validate(balance) for balance in balances]

        elif frequencyId == 4:
            return [BimonthlyBalanceResponse.model_validate(balance) for balance in balances]

        elif frequencyId == 5:
            return [QuarterlyBalanceResponse.model_validate(balance) for balance in balances]

        elif frequencyId == 6:
            return [SemiannualBalanceResponse.model_validate(balance) for balance in balances]

        elif frequencyId == 7:
            return [AnnualBalanceResponse.model_validate(balance) for balance in balances]


    @staticmethod
    async def get_by_origin_ids(db: AsyncSession,  frequencyId: int, origin_ids: List[str]):  # Aceptamos una lista de origin_ids
        print(origin_ids)  # Ahora origin_ids será una lista, no un solo string
        balances = await BalancesRepository.get_by_origin_ids(db,frequencyId, origin_ids)  # Cambié la llamada al repositorio
                 # Aplica filtro según frequencyId
        if frequencyId == 1:
            return [DailyBalanceBase.model_validate(balance) for balance in balances]
        elif frequencyId == 2:
            return [WeeklyBalanceBase.model_validate(balance) for balance in balances]
        elif frequencyId == 3:
            return [MonthlyBalanceResponse.model_validate(balance) for balance in balances]

        elif frequencyId == 4:
            return [BimonthlyBalanceResponse.model_validate(balance) for balance in balances]

        elif frequencyId == 5:
            return [QuarterlyBalanceResponse.model_validate(balance) for balance in balances]

        elif frequencyId == 6:
            return [SemiannualBalanceResponse.model_validate(balance) for balance in balances]

        elif frequencyId == 7:
            return [AnnualBalanceResponse.model_validate(balance) for balance in balances]

    @staticmethod
    async def process_data(origin_ids: List[str],frequencyId: int, db: AsyncSession):
        # Obtener datos de la base
        balances = await BalancesRepository.get_by_origin_ids(db, frequencyId, origin_ids)

        # Convertir los objetos ORM a diccionarios
        raw_data = [b.__dict__ for b in balances]

        # Limpiar campos internos de SQLAlchemy
        for row in raw_data:
            row.pop("_sa_instance_state", None)

        # Crear DataFrame de Spark
        df = spark.createDataFrame(raw_data)

        # Proceso de limpieza de datos: realizar los filtros de Power BI en PySpark

        # Eliminar valores nulos o vacíos en la columna "creditos"
        df_cleaned = df.filter(
            col("credits").isNotNull() # Eliminamos los valores nulos o vacíos
        )

        # Filtrar solo las filas donde el "codigo" empieza con "13" o "17"
        df_cleaned = df_cleaned.filter(
            (col("accountCode").cast("string").startswith("13")) | 
            (col("accountCode").cast("string").startswith("17"))
        )

        # Agregar la columna "Largo" con la longitud de "codigo"
        df_cleaned = df_cleaned.withColumn("large", length(col("accountCode").cast("string")))

        # Reemplazar valores nulos en "tercero" con un valor vacío
        df_cleaned = df_cleaned.fillna({"thirdParty": ""})

        # Filtrar condiciones adicionales, según el comportamiento en Power BI
        df_cleaned = df_cleaned.filter(
            ~(
                (trim(col("thirdParty")) == "") & (col("closingBalance") == 0) |
                (trim(col("thirdParty")) != "") & (col("closingBalance") == 0)
            )
        )

        # Transformar tipo de "Largo" a string
        df_cleaned = df_cleaned.withColumn("large", col("large").cast("string"))

        # Reemplazar valores de error en "Largo" con una cadena vacía
        df_cleaned = df_cleaned.na.fill({"large": ""})

        # Convertir el DataFrame a un formato más útil, como un diccionario
        result = df_cleaned.toPandas().to_dict(orient="records")

        # Traducir claves de inglés a español
        result_translated = []
        for row in result:
            translated_row = {FT003_COLUMNS_EN.get(k, k): v for k, v in row.items()}
            result_translated.append(translated_row)
            
        

        return result_translated
