import pandas as pd
from scipy.sparse import coo_matrix
import torch
from torch.utils.data import Dataset, DataLoader

df = pd.read_csv("/Users/miyashitayataiki/Desktop/movie-recommender-app/database/rating.csv")
df = df[['userId', 'movieId', 'rating']]

user_id_map = {id: idx for idx, id in enumerate(df['userId'].unique())}
movie_id_map = {id: idx for idx, id in enumerate(df['movieId'].unique())}

df['user_idx'] = df['userId'].map(user_id_map)
df['movie_idx'] = df['movieId'].map(movie_id_map)

# rating_matrix = coo_matrix(
#     (df['rating'], (df['user_idx'], df['movie_idx']))
# )

batch_size = 1024
epochs = 20
learning_rate = 0.001

class RatingDataset(Dataset):
    def __init__(self, user_indices, movie_indices, ratings):
        self.user_indices = user_indices
        self.movie_indices = movie_indices
        self.ratings = ratings
    
    def __len__(self):
        return len(self.ratings)
    
    def __getitem__(self, idx):
        return (
        torch.tensor(self.user_indices[idx], dtype=torch.long),
        torch.tensor(self.movie_indices[idx], dtype=torch.long),
        torch.tensor(self.ratings[idx], dtype=torch.float)
    )

class NCF(torch.nn.Module):
    def __init__(self, num_users, num_movies, embedding_dim=32):
        super().__init__()
        self.user_embedding = torch.nn.Embedding(num_users, embedding_dim)
        self.movie_embedding = torch.nn.Embedding(num_movies, embedding_dim)
        self.fc1 = torch.nn.Linear(embedding_dim*2, 64)
        self.fc2 = torch.nn.Linear(64, 1)

    
    def forward(self, user_idx, movie_idx):
        user_vec = self.user_embedding(user_idx)
        movie_vec = self.movie_embedding(movie_idx)
        x = torch.cat([user_vec, movie_vec], dim=1)
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x.squeeze()


dataset = RatingDataset(
    df['user_idx'].values,
    df['movie_idx'].values,
    df['rating'].values
)

num_users = df['user_idx'].nunique()
num_movies = df['movie_idx'].nunique()

model = NCF(num_users, num_movies)
loss_fn = torch.nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

print(1)

for epoch in range(epochs):
    total_loss = 0
    for user_idx, movie_idx, rating in dataloader:
        pred = model(user_idx, movie_idx)
        loss = loss_fn(pred, rating)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
    
    print(f"Epoch {epoch+1}/{epochs}, Loss: {total_loss:.4f}")

torch.save(model.state_dict(), "ncf_model.pth")