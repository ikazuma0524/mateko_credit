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

ADMIN_UIDS = [
    "JnoKKgUQTVUKvIJr7JlKHvKSgUw1",
    # 複数の管理者を設定する場合は、ここにUIDを追加
]

# Firebase トークンを検証する関数
def verify_token(token: str):
    try:
        decoded_token = auth.verify_id_token(token)
        # カスタムクレームを明示的に取得
        
        if 'admin' not in decoded_token:
            # Firebase Admin SDKを使用して最新のカスタムクレームを取得
            user = auth.get_user(decoded_token['uid'])
            decoded_token['admin'] = user.custom_claims.get('admin', False) if user.custom_claims else False
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {str(e)}")
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

# 管理者アカウントにカスタムクレームを設定する関数
def set_admin_claim(uid: str):
    try:
        auth.set_custom_user_claims(uid, {"admin": True})
        print(f"Admin claim set for user {uid}")
    except Exception as e:
        print(f"Error setting admin claim: {str(e)}")

# 管理者権限チェック用のデコレータ
def admin_required(func):
    @wraps(func)
    async def wrapper(credentials: HTTPAuthorizationCredentials = Security(security), *args, **kwargs):
        if not credentials:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        token = credentials.credentials
        user = verify_token(token)
        
        if not user.get('admin', False):
            raise HTTPException(status_code=403, detail="Admin privileges required")
        
        kwargs["user"] = user
        return await func(*args, **kwargs)
    
    return wrapper

# 管理者権限をチェックする関数（エンドポイント用）
async def check_admin(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    user = verify_token(token)
    return {"is_admin": user.get('admin', False)}

# アプリケーション起動時に管理者クレームを設定する関数
def setup_admin_claims():
    for uid in ADMIN_UIDS:
        set_admin_claim(uid)

# アプリケーション起動時に実行
setup_admin_claims()