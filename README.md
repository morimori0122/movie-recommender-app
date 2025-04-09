# Movie Recommender App 
- A full stack movie recommendation app using Next.js, Node.js, FastAPI, Postgres SQL, and NCF(ML model)

## Features
- Movie search
- add your favorite movies to a list
- AI recommends some movies based on your favorites

## Getting started
```bash
docker compose up --build
docker exec -it postgres-db psql -U user -d moviedb
\i /shared/init_all_from_gzip.sql
```

## Project
- ./frontend: Next.js
- ./backend: Node.js + Express
- ./ml_api: FastAPI + Pytorch model

## Citation
This app uses machine learning model that was trained by NCF.
In the training process, this work uses the MovieLens dataset. https://grouplens.org/datasets/movielens/

