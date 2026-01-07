import "dotenv/config";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { db } from "../db/mysql";

dotenv.config();

const MIGRATIONS_DIR = path.resolve(
  __dirname,
  "../../../database/migrations"
);

async function ensureMigrationsTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getExecutedMigrations(): Promise<Set<string>> {
  const [rows] = await db.query<any[]>(
    "SELECT filename FROM schema_migrations"
  );
  return new Set(rows.map(r => r.filename));
}

async function runMigration(filename: string) {
  const filePath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filePath, "utf-8");

  console.log(`▶ Running migration: ${filename}`);
  await db.query(sql);
  await db.query(
    "INSERT INTO schema_migrations (filename) VALUES (?)",
    [filename]
  );
}

async function migrate() {
  try {
    console.log("📦 Starting database migrations...");

    await ensureMigrationsTable();
    const executed = await getExecutedMigrations();

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      if (!executed.has(file)) {
        await runMigration(file);
      } else {
        console.log(`✔ Skipping migration: ${file}`);
      }
    }

    console.log("✅ Database migrations completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed", error);
    process.exit(1);
  }
}

migrate();
