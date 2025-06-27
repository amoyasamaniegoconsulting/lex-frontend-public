import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

from config import settings

async def test_connection():
    
    print(settings.DATABASE_URL_PYTHON)
    engine = create_async_engine(
        settings.DATABASE_URL_PYTHON.replace("postgresql://", "postgresql+asyncpg://"),
        echo=True
    )

    async_session = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        try:
            result = await session.execute(text("SELECT 1"))
            print("✅ Conexión exitosa:", result.scalar_one())
        except Exception as e:
            print("❌ Error al conectar a la base de datos:", e)

if __name__ == "__main__":
    asyncio.run(test_connection())
