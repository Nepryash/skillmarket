import fs from "node:fs/promises";
import path from "node:path";
import initSqlJs, { type Database } from "sql.js";

let cachedDb: Database | undefined;

export async function getDb() {
  if (cachedDb) return cachedDb;

  const databasePath = process.env.SKILLMARKET_DB_PATH
    ? path.resolve(process.env.SKILLMARKET_DB_PATH)
    : path.join(process.cwd(), "data", "skillmarket.db");

  const SQL = await initSqlJs();
  const fileBuffer = await fs.readFile(databasePath);
  cachedDb = new SQL.Database(fileBuffer);
  cachedDb.run("PRAGMA foreign_keys = ON");
  return cachedDb;
}
