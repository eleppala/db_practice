import Fastify from "fastify";
import pool from "./db";
import teamRoutes from "./routes/team";
import playerRoutes from "./routes/player";
import statsRoutes from "./routes/stats";

const server = Fastify({ logger: true });

server.get("/health", async () => {
  const result = await pool.query("SELECT NOW()");
  return { status: "ok", time: result.rows[0].now };
});

server.register(teamRoutes);
server.register(playerRoutes);
server.register(statsRoutes);

const start = async () => {
  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();