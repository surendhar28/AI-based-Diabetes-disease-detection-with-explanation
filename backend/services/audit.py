import json

from services.database import get_connection, utc_now


def record_event(event_type: str, payload: dict, user_email: str | None = None) -> None:
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO prediction_events (user_email, event_type, payload, created_at) VALUES (?, ?, ?, ?)",
            (user_email, event_type, json.dumps(payload, default=str), utc_now()),
        )
