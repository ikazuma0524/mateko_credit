from fastapi import FastAPI
from .database import engine
from .models import Base
from .routers import subjects, students, calculate_credits
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

# ルーターの登録
app.include_router(subjects.router)
app.include_router(students.router)
app.include_router(calculate_credits.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # フロントエンドのURLに制限することも推奨
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)