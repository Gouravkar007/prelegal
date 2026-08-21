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

def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "registered.user@prelegal.io", "name": "Registered User", "password": "secretpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["user"]["email"] == "registered.user@prelegal.io"

    # Duplicate registration attempt should fail
    dup_res = client.post(
        "/api/auth/register",
        json={"email": "registered.user@prelegal.io", "name": "Registered User", "password": "secretpassword"}
    )
    assert dup_res.status_code == 400

def test_document_crud(client):
    # Save a document
    doc_payload = {
        "user_id": 1,
        "title": "Acme vs Beta MNDA",
        "document_type": "Common Paper Mutual NDA",
        "data": {"purpose": "Evaluating Partnership", "governingLawState": "Delaware"}
    }
    create_res = client.post("/api/documents", json=doc_payload)
    assert create_res.status_code == 200
    doc = create_res.json()
    assert doc["id"] > 0
    assert doc["title"] == "Acme vs Beta MNDA"

    # List documents
    list_res = client.get("/api/documents?user_id=1")
    assert list_res.status_code == 200
    docs = list_res.json()
    assert len(docs) >= 1
    assert docs[0]["title"] == "Acme vs Beta MNDA"

    # Get single document
    get_res = client.get(f"/api/documents/{doc['id']}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == doc["id"]

    # Delete document
    del_res = client.delete(f"/api/documents/{doc['id']}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "success"

def test_ai_chat(client):
    response = client.post(
        "/api/chat",
        json={
            "messages": [{"role": "user", "content": "Set Party 1 to Acme Corp"}],
            "current_data": {}
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "reply" in data
    assert "updated_fields" in data

