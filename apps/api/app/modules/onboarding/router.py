from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.modules.onboarding.schemas import RegisterIn, RegisterOut, ApproveIn, ApproveOut
from app.modules.onboarding.service import OnboardingService
from app.security.captcha import verify_captcha
from app.security.rate_limit import enforce_register_limit
from app.core.config import settings
from app.services.mailer import send_mail

router = APIRouter(prefix="/v1/onboarding", tags=["onboarding"])
templates = Jinja2Templates(directory="app/modules/onboarding/templates")

svc = OnboardingService()

@router.post("/register", response_model=RegisterOut)
async def register(body: RegisterIn, request: Request):
    # rate-limit: por ip + email (puedes ajustar)
    ip = request.client.host if request.client else "unknown"
    key = f"register:{ip}:{body.email}"
    try:
        await enforce_register_limit(key, settings.REGISTER_RATE_LIMIT_SECONDS)
    except ValueError:
        raise HTTPException(status_code=429, detail="Solo 1 registro cada 5 minutos")

    ok = await verify_captcha(body.captcha_token, remoteip=ip)
    if not ok:
        raise HTTPException(status_code=400, detail="Captcha inválido")

    try:
        result = await svc.register(body.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    link = f"{settings.FRONTEND_VERIFY_URL}?token={result['approval_token']}"
    recipients = [email.strip() for email in settings.EMAIL_TO.split(",")]
    await send_mail(
        subject="Borderlink - Activa tu cuenta",
        html=f"<p>Activa tu cuenta aquí:</p><p><a href='{link}'>{link}</a></p>"
    )


    return {"client_code": result["client_code"], "db_name": result["db_name"], "status": "pending"}

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
