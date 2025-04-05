-- init.sql
CREATE TABLE IF NOT EXISTS high_scores (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  score INT NOT NULL
);