CREATE TABLE stat (
  id SERIAL PRIMARY KEY,
  player_id INT REFERENCES player(id),
  game_id INT REFERENCES game(id),
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  minutes_played INT DEFAULT 0
);