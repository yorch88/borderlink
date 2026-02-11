import os
import secrets
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

from app.core.lifespan import lifespan
from app.modules.onboarding.router import router as onboarding_router
from app.modules.auth.router import router as auth_router

# ==========================
# App Initialization
# ==========================

# app = FastAPI(
#     title="Borderlink API",
#     lifespan=lifespan,
#     docs_url=None,
#     redoc_url=None,
#     openapi_url=None
# )
app = FastAPI(
    title="Borderlink API",
    lifespan=lifespan
)
# ==========================
# CORS
# ==========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://mentalia.borderlink.mx",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://20.64.254.191:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# Routers
# ==========================

app.include_router(onboarding_router)
app.include_router(auth_router)

# ==========================
# Health Check
# ==========================

@app.get("/health")
def health():
    return {"status": "ok"}


# ==========================
# Protected Swagger
# ==========================

# security = HTTPBasic()

# SWAGGER_USER = os.getenv("SWAGGER_USER", "admin")
# SWAGGER_PASSWORD = os.getenv("SWAGGER_PASSWORD", "supersecret")

# def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
#     correct_username = secrets.compare_digest(credentials.username, SWAGGER_USER)
#     correct_password = secrets.compare_digest(credentials.password, SWAGGER_PASSWORD)

#     if not (correct_username and correct_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Unauthorized",
#             headers={"WWW-Authenticate": "Basic"},
#         )


# @app.get("/docs", include_in_schema=False)
# def protected_swagger(credentials: HTTPBasicCredentials = Depends(verify_credentials)):
#     return get_swagger_ui_html(
#         openapi_url="/api/openapi.json",
#         title="Borderlink API - Docs"
#     )


# @app.get("/openapi.json", include_in_schema=False)
# def openapi():
#     return get_openapi(
#         title=app.title,
#         version="1.0.0",
#         routes=app.routes,
#     )


