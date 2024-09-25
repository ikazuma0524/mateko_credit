import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base
from app.models import Student
from app.schemas.student import StudentCreate

# テスト用のデータベース設定
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# テスト用のデータベースセッションを取得する関数
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# テスト用のクライアントとデータベース設定
@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

# テストケース
def test_create_student(client):
    student_data = {"name": "Test Student", "course": "A", "completed_subjects": [1, 2, 3]}
    response = client.post("/students/", json=student_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == student_data["name"]
    assert data["course"] == student_data["course"]
    assert data["completed_subjects"] == student_data["completed_subjects"]
    assert "id" in data

def test_read_students(client):
    response = client.get("/students/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_update_student(client):
    # まず学生を作成
    student_data = {"name": "Update Test", "course": "B", "completed_subjects": [4, 5]}
    create_response = client.post("/students/", json=student_data)
    created_student = create_response.json()

    # 学生情報を更新
    update_data = {"name": "Updated Name", "course": "C", "completed_subjects": [6, 7, 8]}
    response = client.put(f"/students/{created_student['id']}", json=update_data)
    assert response.status_code == 200
    updated_student = response.json()
    assert updated_student["name"] == update_data["name"]
    assert updated_student["course"] == update_data["course"]
    assert updated_student["completed_subjects"] == update_data["completed_subjects"]

def test_delete_student(client):
    # まず学生を作成
    student_data = {"name": "Delete Test", "course": "A", "completed_subjects": [1]}
    create_response = client.post("/students/", json=student_data)
    created_student = create_response.json()

    # 学生を削除
    response = client.delete(f"/students/{created_student['id']}")
    assert response.status_code == 200
    assert response.json() == {"detail": "Student deleted successfully"}

    # 削除した学生が取得できないことを確認
    get_response = client.get(f"/students/{created_student['id']}")
    assert get_response.status_code == 404

def test_create_invalid_student(client):
    invalid_student_data = {"name": "Invalid Student", "course": "D", "completed_subjects": [1]}
    response = client.post("/students/", json=invalid_student_data)
    assert response.status_code == 422  # Unprocessable Entity

def test_update_nonexistent_student(client):
    update_data = {"name": "Nonexistent", "course": "A", "completed_subjects": [1]}
    response = client.put("/students/9999", json=update_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Student not found"}