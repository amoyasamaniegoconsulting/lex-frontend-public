from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from api.config import settings

# Usar 'postgresql+asyncpg://' para conexión asíncrona
engine = create_async_engine(settings.DATABASE_URL_PYTHON.replace("postgresql://", "postgresql+asyncpg://"), echo=True)

# Crear la sesión asíncrona
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

# Dependencia para obtener una sesión asíncrona
async def get_db():
    async with SessionLocal() as session:
        yield session


