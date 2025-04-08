from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import torch
import pandas as pd
import os


# モデル定義（学習時と同じ）
class NCF(torch.nn.Module):
    def __init__(self, num_users, num_movies, embedding_dim=32):
        super().__init__()
        self.user_embedding = torch.nn.Embedding(num_users, embedding_dim)
        self.movie_embedding = torch.nn.Embedding(num_movies, embedding_dim)
        self.fc1 = torch.nn.Linear(embedding_dim * 2, 64)
        self.fc2 = torch.nn.Linear(64, 1)

    def forward(self, user_idx, movie_idx):
        user_vec = self.user_embedding(user_idx)
        movie_vec = self.movie_embedding(movie_idx)
        x = torch.cat([user_vec, movie_vec], dim=1)
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x.squeeze()


# FastAPI アプリ初期化
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データとマッピングの準備
df = pd.read_csv("rating.csv")
user_id_map = {id: idx for idx, id in enumerate(df["userId"].unique())}
movie_id_map = {id: idx for idx, id in enumerate(df["movieId"].unique())}

# モデルロード
num_users = len(user_id_map)
num_movies = len(movie_id_map)

model = NCF(num_users, num_movies)
model.load_state_dict(torch.load("ncf_model.pth", map_location=torch.device("cpu")))
model.eval()


# リクエスト形式（1件）
class PredictRequest(BaseModel):
    userId: int
    movieId: int


# リクエスト形式（複数）
class PredictManyRequest(BaseModel):
    userId: int
    movieIds: List[int]


# 単発予測エンドポイント
@app.post("/predict")
def predict_rating(request: PredictRequest):
    if request.userId not in user_id_map or request.movieId not in movie_id_map:
        return {"error": "userId or movieId not found in map"}

    user_idx = torch.tensor([user_id_map[request.userId]], dtype=torch.long)
    movie_idx = torch.tensor([movie_id_map[request.movieId]], dtype=torch.long)

    with torch.no_grad():
        prediction = model(user_idx, movie_idx).item()

    return {"predicted_rating": round(prediction, 3)}


# 一括予測エンドポイント（新機能）
@app.post("/predict_many")
def predict_many(data: PredictManyRequest):
    user_id = data.userId
    movie_ids = data.movieIds

    if user_id not in user_id_map:
        return {"error": "userId not found in map"}

    user_idx = torch.tensor([user_id_map[user_id]] * len(movie_ids), dtype=torch.long)
    valid_movie_ids = [mid for mid in movie_ids if mid in movie_id_map]
    movie_idx = torch.tensor(
        [movie_id_map[mid] for mid in valid_movie_ids], dtype=torch.long
    )

    with torch.no_grad():
        predictions = model(user_idx[: len(movie_idx)], movie_idx).tolist()

    return [
        {"movieId": mid, "rating": round(pred, 3)}
        for mid, pred in zip(valid_movie_ids, predictions)
    ]
