import sqlite3
import os

def init_db(db_path: str = None):
    """
    Initializes SQLite database from scratch on startup.
    Dynamically reads DATABASE_PATH from environment.
    """
    if db_path is None:
        db_path = os.getenv("DATABASE_PATH", "prelegal.db")
        
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
    
    # Seed default demo user if table is empty
    cursor.execute("SELECT COUNT(*) FROM users;")
    if cursor.fetchone()[0] == 0:
        cursor.execute(
            "INSERT INTO users (email, name) VALUES (?, ?);",
            ("demo.user@prelegal.io", "Gourav Kar")
        )
    
    conn.commit()
    conn.close()

def get_db_connection(db_path: str = None):
    if db_path is None:
        db_path = os.getenv("DATABASE_PATH", "prelegal.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn
