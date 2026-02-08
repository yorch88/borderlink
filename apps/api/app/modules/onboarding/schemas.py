from pydantic import BaseModel, EmailStr, Field
from typing import List

class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    giro: str  # psychology, dentist, etc.
    org_name: str
    modules: List[str] = []  # ["MetalIA MS", "DentIA MS"]
    #captcha_token: str

class RegisterOut(BaseModel):
    client_code: str
    db_name: str
    status: str = "pending"

class ApproveIn(BaseModel):
    token: str

class ApproveOut(BaseModel):
    status: str
    tenant_db: str


class PowPayload(BaseModel):
    nonce: str
    counter: int


class RegisterIn(BaseModel):
    email: str
    password: str
    giro: str
    org_name: str
    modules: list[str]
    pow: PowPayload