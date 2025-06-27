from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL_PYTHON: str = "postgresql://postgres:BpWwOSll%40+a1@18.219.4.38:5432/dbLexReporting"


settings = Settings()