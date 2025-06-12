import json

import requests

from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from requests.auth import HTTPBasicAuth

app = FastAPI()

QR_CODE_URL = "https://my.trainmore.nl/nox/v1/customerqrcode/"
LOGIN_URL = "https://my.trainmore.nl/login"
REGISTER_URL = "https://my.trainmore.nl/v2/public/register"

FACILITY_GROUP = "BRANDEDAPPTMBTYDONOTDELETE-A475E445911448AA852F4B86D904D3E2"
HEADERS = {
    "x-public-facility-group": FACILITY_GROUP,
    "x-nox-client-type": "APP_V5",
    "x-nox-client-version": "3.68.0",
}


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str


class QRResponse(BaseModel):
    expiry_date: datetime
    content: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    language: str = "en"


class TokenRequest(BaseModel):
    token: str


def get_err_message(text: str) -> str | None:
    """
    return error message if the payload looks like this:

    '[{"errorMessage": "...", ...}, ...]'

    otherwise, return None
    """
    try:
        parsed = json.loads(text)
    except Exception:
        return None
    if isinstance(parsed, list):
        parsed = parsed[0]
    if isinstance(parsed, dict):
        return parsed.get("errorMessage")
    return None


@app.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    basic = HTTPBasicAuth(request.username, request.password)
    r = requests.post(
        LOGIN_URL,
        json={"username": request.username, "password": request.password},
        headers=HEADERS,
        auth=basic,
    )
    if not r.ok:
        err_message = get_err_message(r.text)
        raise HTTPException(status_code=500, detail=err_message or f"Request failed: {r.text}")

    data = r.json()
    return LoginResponse(access_token=data["access_token"])


@app.post("/qr-code", response_model=QRResponse)
async def get_qr_code(request: TokenRequest):
    r = requests.get(QR_CODE_URL, headers={**HEADERS, "x-auth-token": request.token})
    if not r.ok:
        raise HTTPException(status_code=500, detail="Bad token")

    data = r.json()
    return QRResponse(expiry_date=datetime.fromisoformat(data["expiryDate"]), content=data["content"])


@app.post("/register")
async def register(request: RegisterRequest):
    payload = {
        "email": request.email,
        "password": request.password,
        "language": request.language,
        "registrationSource": "APP_WHITELABEL",
        "agreedToMarketing": False,
    }

    r = requests.post(REGISTER_URL, json=payload, headers=HEADERS)

    if not r.ok:
        err_message = get_err_message(r.text)
        raise HTTPException(status_code=500, detail=err_message or f"Request failed: {r.text}")

    return r.json()


@app.get("/")
async def serve_index():
    return FileResponse("index.html")


@app.get("/qrcode.min.js")
async def serve_qrcode():
    return FileResponse("qrcode.min.js")


if __name__ == "__main__":
    import uvicorn
    import sys

    uvicorn.run(app, host="0.0.0.0", port=8000 if len(sys.argv) == 1 else int(sys.argv[1]))
