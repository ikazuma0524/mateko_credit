# ベースイメージ
FROM python:3.9-slim

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をインストールするために requirements.txt をコンテナにコピー
COPY requirements.txt .

# 依存関係をインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコードをコンテナにコピー
COPY . .

# PYTHONPATHを設定して、appディレクトリをモジュール検索パスに含める
ENV PYTHONPATH=/app/backend

# テストを実行
CMD ["pytest", "tests/"]
