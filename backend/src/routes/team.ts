import { FastifyInstance } from "fastify";
import pool from "../db";

export default async function teamRoutes(server: FastifyInstance) {

    // GET all teams
    server.get("/teams", async () => {
        const { rows } = await pool.query("SELECT * FROM team ORDER BY name");
        return rows;
    });

    // GET one team by id
    server.get("/teams/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { rows } = await pool.query("SELECT * FROM team WHERE id = $1", [id]);
        if (rows.length === 0) {
        reply.code(404);
        return { error: "Not found" };
        }
        return rows[0];
    });

    // GET team roster (players)
    server.get("/teams/:id/players", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { rows } = await pool.query(
        "SELECT * FROM player WHERE team_id = $1 ORDER BY jersey_number",
        [id]
        );
        return rows;
    });

}