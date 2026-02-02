import pool from "./db";
import fs from "fs";
import path from "path";

const migrate = async () => {
  // Create the migrationstable - if not existed
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Read migration files in order 
  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    // check if already ran
    const { rows } = await pool.query(
      "SELECT id FROM migrations WHERE name = $1",
      [file]
    );

    if (rows.length === 0) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      await pool.query(sql);
      await pool.query(
        "INSERT INTO migrations (name) VALUES ($1)",
        [file]
      );
      console.log(`Migrated: ${file}`);
    }
  }

  console.log("All migrations complete");
  await pool.end();
};

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});