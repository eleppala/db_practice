CREATE TABLE team (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  founded_year INT
);