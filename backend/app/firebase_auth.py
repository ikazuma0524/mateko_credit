import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from functools import wraps

# Firebase Admin SDKの認証情報を読み込む
cred = credentials.Certificate("/Users/ishiikazuma/Desktop/Mateko_credit/backend/app/mateko-cresit-firebase-adminsdk.json")
firebase_admin.initialize_app(cred)

# FastAPI の HTTP 認証用のセキュリティスキーム
security = HTTPBearer()

# Firebase トークンを検証する関数
def verify_token(token: str):
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# 認証が必要なエンドポイント用のデコレータ
def auth_required(func):
    @wraps(func)
    async def wrapper(credentials: HTTPAuthorizationCredentials = Security(security), *args, **kwargs):
        if not credentials:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        token = credentials.credentials  # トークンの取得
        user = verify_token(token)  # トークンの検証
        kwargs["user"] = user  # ユーザ情報を追加

        # 非同期関数をラップして実行
        return await func(*args, **kwargs)
    
    return wrapper
