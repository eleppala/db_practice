import { FastifyInstance } from "fastify";
import pool from "../db";

export default async function statsRoutes(server: FastifyInstance) {

  // GET standings
  server.get("/standings", async () => {
    const { rows } = await pool.query(`
      SELECT
        t.id,
        t.name,
        COUNT(g.id) as games_played,
        SUM(CASE
          WHEN (g.home_team_id = t.id AND g.home_score > g.away_score)
            OR (g.away_team_id = t.id AND g.away_score > g.home_score)
          THEN 1 ELSE 0
        END) as wins,
        SUM(CASE
          WHEN (g.home_team_id = t.id AND g.home_score < g.away_score)
            OR (g.away_team_id = t.id AND g.away_score < g.home_score)
          THEN 1 ELSE 0
        END) as losses,
        SUM(CASE WHEN g.home_score = g.away_score THEN 1 ELSE 0 END) as ties,
        SUM(CASE
          WHEN (g.home_team_id = t.id AND g.home_score > g.away_score)
            OR (g.away_team_id = t.id AND g.away_score > g.home_score)
          THEN 3
          WHEN g.home_score = g.away_score THEN 1
          ELSE 0
        END) as points
      FROM team t
      LEFT JOIN game g ON t.id = g.home_team_id OR t.id = g.away_team_id
      GROUP BY t.id, t.name
      ORDER BY points DESC, wins DESC
    `);
    return rows;
  });

  // GET scoring leaders 
  server.get("/leaders", async () => {
    const { rows } = await pool.query(`
      SELECT
        p.id,
        p.name,
        t.name as team_name,
        COUNT(s.id) as games_played,
        SUM(s.goals) as goals,
        SUM(s.assists) as assists,
        SUM(s.goals) + SUM(s.assists) as points
      FROM player p
      JOIN team t ON p.team_id = t.id
      JOIN stat s ON p.id = s.player_id
      WHERE p.position != 'G'
      GROUP BY p.id, p.name, t.name
      ORDER BY points DESC, goals DESC
      LIMIT 20
    `);
    return rows;
  });

  // GET goal leaders
  server.get("/leaders/goals", async () => {
    const { rows } = await pool.query(`
      SELECT
        p.id,
        p.name,
        t.name as team_name,
        SUM(s.goals) as goals
      FROM player p
      JOIN team t ON p.team_id = t.id
      JOIN stat s ON p.id = s.player_id
      WHERE p.position != 'G'
      GROUP BY p.id, p.name, t.name
      ORDER BY goals DESC
      LIMIT 20
    `);
    return rows;
  });

}