import sqlite3
import os

DB_PATH = os.getenv("DATABASE_PATH", "prelegal.db")

def init_db(db_path: str = DB_PATH):
    """
    Initializes SQLite database from scratch on startup.
    If database file exists, it removes it or resets tables to ensure a clean state
    each time the application or container starts up.
    """
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Seed default demo user if not present
    cursor.execute("SELECT COUNT(*) FROM users;")
    if cursor.fetchone()[0] == 0:
        cursor.execute(
            "INSERT INTO users (email, name) VALUES (?, ?);",
            ("demo.user@prelegal.io", "Gourav Kar")
        )
    
    conn.commit()
    conn.close()

def get_db_connection(db_path: str = DB_PATH):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn
