from api.schemas.balances.dailyBalance import DailyBalanceBase
from api.schemas.balances.weeklyBalance import WeeklyBalanceBase
from api.schemas.balances.monthlyBalance import MonthlyBalanceResponse
from api.schemas.balances.bimonthlyBalance import BimonthlyBalanceResponse
from api.schemas.balances.quarterlyBalance import QuarterlyBalanceResponse
from api.schemas.balances.semiannualBalance import SemiannualBalanceResponse
from api.schemas.balances.annualBalance import AnnualBalanceResponse
from sqlalchemy.ext.asyncio import AsyncSession
from api.repositories.balancesRepository import BalancesRepository
from typing import List
import pandas as pd
from api.utils.columns import FT003_COLUMNS_EN


class BalancesService:

    @staticmethod
    async def get_by_origin_id(db: AsyncSession, frequencyId: int, origin_id: str):
        print(origin_id)
        balances = await BalancesRepository.get_by_origin_id(db, frequencyId, origin_id)

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
    async def get_by_origin_ids(db: AsyncSession, frequencyId: int, origin_ids: List[str]):
        print(origin_ids)
        balances = await BalancesRepository.get_by_origin_ids(db, frequencyId, origin_ids)

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
    async def process_data(origin_ids: List[str], frequencyId: int, db: AsyncSession):
        balances = await BalancesRepository.get_by_origin_ids(db, frequencyId, origin_ids)

        # Convertir objetos ORM a diccionarios y limpiar metadata de SQLAlchemy
        raw_data = []
        for b in balances:
            d = b.__dict__.copy()
            d.pop("_sa_instance_state", None)
            raw_data.append(d)

        # Crear DataFrame con pandas
        df = pd.DataFrame(raw_data)

        # Limpieza: eliminar filas con credits nulo
        df = df[df["credits"].notna()]

        # Filtrar accountCode que empiece con "13" o "17"
        df["accountCode"] = df["accountCode"].astype(str)
        df = df[df["accountCode"].str.startswith(("13", "17"))]

        # Agregar columna "large" con longitud de accountCode
        df["large"] = df["accountCode"].str.len().astype(str)

        # Rellenar nulls de thirdParty con cadena vacía
        df["thirdParty"] = df["thirdParty"].fillna("")

        # Filtrar según reglas de Power BI:
        # Si thirdParty está vacío y closingBalance == 0, o si está lleno y closingBalance == 0
        condition = ~(
            ((df["thirdParty"].str.strip() == "") & (df["closingBalance"] == 0)) |
            ((df["thirdParty"].str.strip() != "") & (df["closingBalance"] == 0))
        )
        df = df[condition]

        # Rellenar NaNs en "large" con string vacío
        df["large"] = df["large"].fillna("")

        # Convertir a lista de diccionarios
        result = df.to_dict(orient="records")

        # Traducir las claves
        result_translated = []
        for row in result:
            translated_row = {FT003_COLUMNS_EN.get(k, k): v for k, v in row.items()}
            result_translated.append(translated_row)

        return result_translated
