from fastapi import FastAPI, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials
from .database import engine
from .models import Base
from .routers.admin import subjects, students, calculate_credits
from .firebase_auth import auth_required, security
import firebase_admin
from firebase_admin import auth
from firebase_admin import credentials

# FastAPI アプリケーションの初期化
app = FastAPI()

# データベースの初期化
Base.metadata.create_all(bind=engine)

# CORS ミドルウェアの追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # フロントエンドのURLに制限することが推奨される
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 認証が必要なエンドポイント
@app.get("/protected")
@auth_required
async def protected_route(credentials: HTTPAuthorizationCredentials = Security(security), user=None):
    return {"message": "This is a protected route", "user": user}

# ルーターの登録
app.include_router(subjects.router)
app.include_router(students.router)
app.include_router(calculate_credits.router)
