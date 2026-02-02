import Fastify from "fastify";
import pool from "./db";

const server = Fastify({ logger: true });

server.get("/health", async () => {
  const result = await pool.query("SELECT NOW()");
  return { status: "ok", time: result.rows[0].now };
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();