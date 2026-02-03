CREATE TABLE player (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(50),
  jersey_number INT,
  team_id INT REFERENCES team(id),
  birthdate DATE
);