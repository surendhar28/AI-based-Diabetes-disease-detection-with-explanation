import hashlib
import hmac
import secrets
from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from models.schemas import LoginRequest, UserCreate
from services.database import get_connection, utc_now


security = HTTPBearer(auto_error=False)
_sessions: dict[str, str] = {}


@dataclass(frozen=True)
class CurrentUser:
    email: str
    role: str


def _hash_password(password: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 120_000).hex()
    return f"{salt}${digest}"


def _verify_password(password: str, stored_hash: str) -> bool:
    salt, expected = stored_hash.split("$", 1)
    actual = _hash_password(password, salt).split("$", 1)[1]
    return hmac.compare_digest(actual, expected)


def register_user(payload: UserCreate) -> str:
    password_hash = _hash_password(payload.password)
    try:
        with get_connection() as conn:
            conn.execute(
                "INSERT INTO users (email, full_name, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
                (payload.email.lower(), payload.full_name, password_hash, payload.role, utc_now()),
            )
    except Exception as exc:
        raise HTTPException(status_code=409, detail="User already exists") from exc
    return create_session(payload.email.lower())


def login_user(payload: LoginRequest) -> str:
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM users WHERE email = ?", (payload.email.lower(),)).fetchone()
    if not row or not _verify_password(payload.password, row["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return create_session(payload.email.lower())


def create_session(email: str) -> str:
    token = secrets.token_urlsafe(32)
    _sessions[token] = email
    return token


def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security)) -> CurrentUser | None:
    if credentials is None:
        return None
    email = _sessions.get(credentials.credentials)
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    with get_connection() as conn:
        row = conn.execute("SELECT role FROM users WHERE email = ?", (email,)).fetchone()
    role = row["role"] if row else "patient"
    return CurrentUser(email=email, role=role)
