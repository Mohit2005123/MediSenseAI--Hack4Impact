from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    II_MEDICAL_ENDPOINT_URL: str | None = None
    GPT_SS_ENDPOINT_URL: str | None = None
    HF_TOKEN: str | None = None

    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8080
    ENV: str = "dev"
    LOG_LEVEL: str = "INFO"
    CORS_ORIGINS: str = "*"

    class Config:
        env_file = ".env"

settings = Settings()
