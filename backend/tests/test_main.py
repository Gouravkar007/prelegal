import pytest
from fastapi.testclient import TestClient
import os
import tempfile

from app.main import app
from app.database import init_db

@pytest.fixture(autouse=True)
def setup_temp_db():
    tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    db_path = tmp.name
    tmp.close()
    
    os.environ["DATABASE_PATH"] = db_path
    init_db(db_path)
    yield db_path
    
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
        except OSError:
            pass

@pytest.fixture
def client(setup_temp_db):
    with TestClient(app) as c:
        yield c

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "PreLegal Backend"

def test_list_users(client):
    response = client.get("/api/users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 1
    assert users[0]["email"] == "demo.user@prelegal.io"

def test_create_user(client):
    response = client.post(
        "/api/users",
        json={"email": "new.user@prelegal.io", "name": "New User"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "new.user@prelegal.io"
    assert data["name"] == "New User"

def test_login_auth(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "login.test@prelegal.io", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["user"]["email"] == "login.test@prelegal.io"
