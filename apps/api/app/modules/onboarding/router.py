from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from jinja2 import Environment, FileSystemLoader, select_autoescape
from datetime import datetime

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

email_env = Environment(
    loader=FileSystemLoader("app/templates/emails"),
    autoescape=select_autoescape(["html", "xml"])
)

svc = OnboardingService()

DIFFICULTY = 4
TTL_SECONDS = 120


@router.post("/register", response_model=RegisterOut)
async def register(body: RegisterIn, request: Request):

    ip = request.client.host if request.client else "unknown"
    key = f"register:{ip}:{body.email}"

    try:
        await enforce_register_limit(key, settings.REGISTER_RATE_LIMIT_SECONDS)
    except ValueError:
        raise HTTPException(
            status_code=429,
            detail="Solo 1 registro cada 5 minutos"
        )

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
        difficulty=DIFFICULTY
    ):
        raise HTTPException(
            status_code=400,
            detail="Verificación antibot fallida"
        )

    mark_nonce_used(body.pow.nonce)

    try:
        result = await svc.register(body.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # ---------------------------
    # Send styled HTML email
    # ---------------------------

    template = email_env.get_template("new_registration.html")

    html_content = template.render(
        email=body.email,
        org_name=body.org_name,
        giro=body.giro,
        modules=", ".join(body.modules) if body.modules else "N/A",
        token=result["approval_token"],
        year=datetime.utcnow().year
    )

    await send_mail(
        subject="BorderLink - Nueva organización registrada",
        html=html_content
    )

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


@router.get("/verify", response_class=HTMLResponse, include_in_schema=False)
async def verify_page(request: Request, token: str):
    return templates.TemplateResponse(
        "verify.html",
        {"request": request, "token": token}
    )


@router.get("/challenge")
async def get_antibot_challenge():

    nonce = generate_nonce()
    store_nonce(nonce, TTL_SECONDS)

    return {
        "nonce": nonce,
        "difficulty": DIFFICULTY,
        "expires_in": TTL_SECONDS
    }
