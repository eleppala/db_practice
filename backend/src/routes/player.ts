import { FastifyInstance } from "fastify";
import pool from "../db";

export default async function playerRoutes(server: FastifyInstance) {

    // GET all players
    server.get("/players", async () => {
        const { rows } = await pool.query(`
        SELECT p.*, t.name as team_name
        FROM player p
        LEFT JOIN team t ON p.team_id = t.id
        ORDER BY p.name
        `);
        return rows;
    });

    // GET one player by id
    server.get("/players/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { rows } = await pool.query(`
        SELECT p.*, t.name as team_name
        FROM player p
        LEFT JOIN team t ON p.team_id = t.id
        WHERE p.id = $1
        `, [id]);
        if (rows.length === 0) {
        reply.code(404);
        return { error: "Not found" };
        }
        return rows[0];
    });

    // GET player stats (all games)
    server.get("/players/:id/stats", async (request) => {
        const { id } = request.params as { id: string };
        const { rows } = await pool.query(`
        SELECT
            s.*,
            g.played_at,
            ht.name as home_team,
            at.name as away_team,
            g.home_score,
            g.away_score
        FROM stat s
        JOIN game g ON s.game_id = g.id
        JOIN team ht ON g.home_team_id = ht.id
        JOIN team at ON g.away_team_id = at.id
        WHERE s.player_id = $1
        ORDER BY g.played_at DESC
        `, [id]);
        return rows;
    });

    // GET player career totals
    server.get("/players/:id/totals", async (request) => {
        const { id } = request.params as { id: string };
        const { rows } = await pool.query(`
        SELECT
            p.id,
            p.name,
            t.name as team_name,
            COUNT(s.id) as games_played,
            SUM(s.goals) as total_goals,
            SUM(s.assists) as total_assists,
            SUM(s.goals) + SUM(s.assists) as total_points,
            SUM(s.minutes_played) as total_minutes
        FROM player p
        LEFT JOIN team t ON p.team_id = t.id
        LEFT JOIN stat s ON p.id = s.player_id
        WHERE p.id = $1
        GROUP BY p.id, p.name, t.name
        `, [id]);
        return rows[0] || null;
    });

}