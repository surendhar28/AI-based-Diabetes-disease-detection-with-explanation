from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from services.database import init_db
from utils.config import settings


from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run database initialization once on server startup
    init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Agentic General Medicine and Diabetes CDSS API",
        version="1.0.0",
        description="FastAPI backend for a modular AI healthcare decision-support system.",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router)

    return app


app = create_app()


if __name__ == "__main__":
    print("\n[Server Startup] Starting development server...")
    print("[Server Startup] Please wait, loading machine learning packages (numpy, pandas, scipy, sklearn, xgboost)...\n")
    
    import uvicorn
    from pathlib import Path

    current_dir = Path(__file__).resolve().parent

    # Absolute paths to directories we want to completely exclude
    exclude_dirs = [
        current_dir / ".venv",
        current_dir / ".pytest_cache",
    ]

    # Dynamically exclude any existing pytest-cache-files directories
    for path in current_dir.glob("pytest-cache-files-*"):
        if path.is_dir():
            exclude_dirs.append(path)

    reload_excludes = [str(d) for d in exclude_dirs if d.is_dir()]

    # Add general file glob patterns as fallback exclusions
    reload_excludes.extend([
        "*.sqlite3",
        "*.sqlite3-journal",
        "**/.venv/**/*",
        "**/.pytest_cache/**/*",
        "**/pytest-cache-files-*/**/*",
    ])

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_excludes=reload_excludes,
    )



