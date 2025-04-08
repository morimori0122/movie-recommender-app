-- 🎬 movies テーブル作成と読み込み
DROP TABLE IF EXISTS movies;
CREATE TABLE movies (
  movieId INTEGER PRIMARY KEY,
  title TEXT,
  genres TEXT
);
\COPY movies(movieId, title, genres) FROM PROGRAM 'gunzip -c /shared/movies.csv.gz' DELIMITER ',' CSV HEADER;

-- ⭐️ rating テーブル作成と読み込み
DROP TABLE IF EXISTS rating;
CREATE TABLE rating (
  userId INTEGER,
  movieId INTEGER,
  rating NUMERIC,
  timestamp BIGINT
);
\COPY rating(userId, movieId, rating, timestamp) FROM PROGRAM 'gunzip -c /shared/rating.csv.gz' DELIMITER ',' CSV HEADER;

-- 🏷 tag テーブル作成と読み込み
DROP TABLE IF EXISTS tag;
CREATE TABLE tag (
  userId INTEGER,
  movieId INTEGER,
  tag TEXT,
  timestamp BIGINT
);
\COPY tag(userId, movieId, tag, timestamp) FROM PROGRAM 'gunzip -c /shared/tag.csv.gz' DELIMITER ',' CSV HEADER;