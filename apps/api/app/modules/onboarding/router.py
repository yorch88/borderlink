from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.modules.onboarding.schemas import RegisterIn, RegisterOut, ApproveIn, ApproveOut
from app.services.antibot_service import generate_nonce
from app.db.redis_client import store_nonce
from app.modules.onboarding.service import OnboardingService
from app.security.captcha import verify_captcha
from app.security.rate_limit import enforce_register_limit
from app.core.config import settings
from app.services.mailer import send_mail
from app.services.antibot_service import is_valid_pow
from app.db.redis_client import get_nonce, mark_nonce_used

router = APIRouter(prefix="/v1/onboarding", tags=["onboarding"])
templates = Jinja2Templates(directory="app/modules/onboarding/templates")

svc = OnboardingService()

DIFFICULTY = 4
TTL_SECONDS = 120

@router.post("/register", response_model=RegisterOut)
async def register(body: RegisterIn, request: Request):

    # ---------------------------
    # 1️⃣ Rate limit
    # ---------------------------
    ip = request.client.host if request.client else "unknown"
    key = f"register:{ip}:{body.email}"

    try:
        await enforce_register_limit(key, settings.REGISTER_RATE_LIMIT_SECONDS)
    except ValueError:
        raise HTTPException(
            status_code=429,
            detail="Solo 1 registro cada 5 minutos"
        )

    # ---------------------------
    # 2️⃣ Verificar PoW (antibot)
    # ---------------------------
    nonce_data = get_nonce(body.pow.nonce)

    if not nonce_data:
        raise HTTPException(
            status_code=400,
            detail="Challenge inválido o expirado"
        )

    if nonce_data.get("used"):
        raise HTTPException(
            status_code=400,
            detail="Challenge ya utilizado"
        )

    if not is_valid_pow(
        nonce=body.pow.nonce,
        counter=body.pow.counter,
        difficulty=4
    ):
        raise HTTPException(
            status_code=400,
            detail="Verificación antibot fallida"
        )

    # Marcar nonce como usado
    mark_nonce_used(body.pow.nonce)

    # ---------------------------
    # 3️⃣ Crear tenant
    # ---------------------------
    try:
        result = await svc.register(body.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # ---------------------------
    # 4️⃣ Enviar email activación
    # ---------------------------
    link = f"{settings.FRONTEND_VERIFY_URL}?token={result['approval_token']}"

    await send_mail(
        subject="Borderlink - Activa tu cuenta",
        html=f"<p>Activa tu cuenta aquí:</p><p><a href='{link}'>{link}</a></p>"
    )

    # ---------------------------
    # 5️⃣ Respuesta
    # ---------------------------
    return {
        "client_code": result["client_code"],
        "db_name": result["db_name"],
        "status": "pending"
    }

@router.post("/approve", response_model=ApproveOut)
async def approve(body: ApproveIn):
    try:
        out = await svc.approve(body.token)
        return out
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Página HTML (dev)
@router.get("/verify", response_class=HTMLResponse, include_in_schema=False)
async def verify_page(request: Request, token: str):
    # solo render simple; en prod esto lo moverás al frontend
    return templates.TemplateResponse(
        "verify.html",
        {"request": request, "token": token}
    )


@router.get("/challenge")
async def get_antibot_challenge():

    nonce = generate_nonce()

    # Guardar nonce en Redis con expiración
    store_nonce(nonce, TTL_SECONDS)

    return {
        "nonce": nonce,
        "difficulty": DIFFICULTY,
        "expires_in": TTL_SECONDS
    }