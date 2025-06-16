import json

import requests

from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, computed_field
from requests.auth import HTTPBasicAuth

app = FastAPI()

QR_CODE_URL = "https://my.trainmore.nl/nox/v1/customerqrcode/"
CHECKIN_HISTORY_URL = "https://my.trainmore.nl/nox/v1/studios/checkin/history/report"
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



class GymVisit(BaseModel):
    checkin_time: datetime
    checkout_time: datetime
    studio_name: str

    @computed_field
    @property
    def duration_minutes(self) -> int:
        delta = self.checkout_time - self.checkin_time
        return int(delta.total_seconds() / 60)


    @staticmethod
    def from_raw_dict(data: dict[str, str]) -> 'GymVisit':
        return GymVisit(
            checkin_time=parse_datetime_with_timezone(data['checkinTime']),
            checkout_time=parse_datetime_with_timezone(data['checkoutTime']),
            studio_name=data['studioName']
        )
def parse_datetime_with_timezone(datetime_str: str) -> datetime:
    """
    Parse datetime string with timezone like '2025-06-16T11:55:09.534+02:00[Europe/Amsterdam]'
    """
    clean_datetime, _, _ = datetime_str.partition('[')
    return datetime.fromisoformat(clean_datetime)



@app.post("/checkin-history", response_model=list[GymVisit])
async def get_checkin_history(request: TokenRequest):
    r = requests.get(CHECKIN_HISTORY_URL, headers={**HEADERS, "x-auth-token": request.token})
    """
    [{
      "date": "2025-06-16",
      "checkinTime": "2025-06-16T11:00:00.000+02:00[Europe/Amsterdam]",
      "checkoutTime": "2025-06-16T13:00:00.000+02:00[Europe/Amsterdam]",
      "studioName": "Trainmore Amsterdam Scheldeplein B.V."
    }]
    """
    if not r.ok:
        raise HTTPException(status_code=500, detail="Bad token")

    data = r.json()
    visits = [GymVisit.from_raw_dict(item) for item in data]
    return [v for v in visits if v.duration_minutes > 0]


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


@app.get("/qr.min.js")
async def serve_qrcode():
    return FileResponse("qr.min.js")


if __name__ == "__main__":
    import uvicorn
    import sys

    uvicorn.run(app, host="0.0.0.0", port=8000 if len(sys.argv) == 1 else int(sys.argv[1]))
