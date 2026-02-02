import { FastifyInstance } from "fastify";
import pool from "../db";

export default async function exampleRoutes(server: FastifyInstance) {

    // GET all examples
    server.get("/examples", async () => {
        const { rows } = await pool.query("SELECT * FROM example ORDER BY id");
        return rows;
    });

    // GET one example by id
    server.get("/examples/:id", async (request) => {
        const { id } = request.params as { id: string };
        const { rows } = await pool.query("SELECT * FROM example WHERE id = $1", [id]);
        if (rows.length === 0) {
        return { error: "Not found" };
        }
        return rows[0];
    });

    // POST create a new example
    server.post("/examples", async (request, reply) => {
        const { title, description } = request.body as { title: string; description?: string };
        const { rows } = await pool.query(
        "INSERT INTO example (title, description) VALUES ($1, $2) RETURNING *",
        [title, description]
        );
        reply.code(201);
        return rows[0];
    });

    // PUT update an example by id
    server.put("/examples/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { title, description } = request.body as { title: string; description?: string };
        const { rows } = await pool.query(
        "UPDATE example SET title = $1, description = $2 WHERE id = $3 RETURNING *",
        [title, description, id]
        );
        if (rows.length === 0) {
        reply.code(404);
        return { error: "Not found" };
        }
        return rows[0];
    });

    // DELETE an example by id
    server.delete("/examples/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { rows } = await pool.query(
        "DELETE FROM example WHERE id = $1 RETURNING *",
        [id]
        );
        if (rows.length === 0) {
        reply.code(404);
        return { error: "Not found" };
        }
        reply.code(200);
        return { deleted: rows[0] };
    });

}
