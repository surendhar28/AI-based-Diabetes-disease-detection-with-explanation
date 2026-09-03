import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Iterator

from utils.config import settings


def import_az_medicines(conn: sqlite3.Connection) -> None:
    import shutil
    import pandas as pd
    import kagglehub
    from pathlib import Path

    csv_name = "A_Z_medicines_dataset_of_India.csv"
    local_csv = settings.data_dir / csv_name

    if not local_csv.exists():
        print("Dataset not found locally. Searching cache/downloading...")
        try:
            cache_path = Path(kagglehub.dataset_download("shudhanshusingh/az-medicine-dataset-of-india"))
            csv_files = list(cache_path.glob("*.csv"))
            if csv_files:
                shutil.copy(csv_files[0], local_csv)
                print(f"Copied dataset to {local_csv}")
        except Exception as exc:
            print(f"Failed to download/copy AZ medicine dataset: {exc}")
            return

    if local_csv.exists():
        print(f"Loading {local_csv} into medicines table...")
        try:
            df = pd.read_csv(local_csv)
            df_db = df.rename(columns={
                "price(₹)": "price",
                "Is_discontinued": "is_discontinued"
            })
            df_db = df_db.dropna(subset=["name"])
            df_db.to_sql("medicines", conn, if_exists="append", index=False)
            print("Successfully loaded medicines into database!")
        except Exception as exc:
            print(f"Error loading CSV data: {exc}")


def init_db() -> None:
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(settings.sqlite_path) as conn:
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'patient',
                created_at TEXT NOT NULL
            )
            """
        )
        
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(users)")
        columns = [row[1] for row in cursor.fetchall()]
        if "role" not in columns:
            conn.execute("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'patient'")

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS patient_cases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_name TEXT,
                patient_email TEXT NOT NULL,
                doctor_email TEXT,
                symptoms TEXT NOT NULL,
                labs TEXT NOT NULL,
                general_prediction TEXT,
                diabetes_prediction TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (patient_email) REFERENCES users (email)
            )
            """
        )
        
        cursor.execute("PRAGMA table_info(patient_cases)")
        case_columns = [row[1] for row in cursor.fetchall()]
        if "patient_name" not in case_columns:
            conn.execute("ALTER TABLE patient_cases ADD COLUMN patient_name TEXT")

        conn.execute("CREATE INDEX IF NOT EXISTS idx_patient_cases_email ON patient_cases(patient_email)")
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS prediction_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT,
                event_type TEXT NOT NULL,
                payload TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS medicines (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL,
                is_discontinued INTEGER DEFAULT 0,
                manufacturer_name TEXT,
                type TEXT,
                pack_size_label TEXT,
                short_composition1 TEXT,
                short_composition2 TEXT
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_medicines_comp1 ON medicines(short_composition1)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_medicines_comp2 ON medicines(short_composition2)")

        # Populate medicines table if empty
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM medicines")
        count = cursor.fetchone()[0]
        if count == 0:
            import_az_medicines(conn)


@contextmanager
def get_connection() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(settings.sqlite_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()
