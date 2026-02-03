CREATE TABLE game (
  id SERIAL PRIMARY KEY,
  home_team_id INT REFERENCES team(id),
  away_team_id INT REFERENCES team(id),
  played_at TIMESTAMP,
  home_score INT DEFAULT 0,
  away_score INT DEFAULT 0
);