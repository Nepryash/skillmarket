import fs from "node:fs/promises";
import path from "node:path";
import initSqlJs, { type Database } from "sql.js";

let cachedDb: Database | undefined;
let cachedDatabasePath: string | undefined;
let cachedDbPromise: Promise<Database> | undefined;

export function getDatabasePath() {
  return process.env.SKILLMARKET_DB_PATH
    ? path.resolve(process.env.SKILLMARKET_DB_PATH)
    : path.join(process.cwd(), "data", "skillmarket.db");
}

export async function getDb() {
  if (cachedDb) return cachedDb;
  if (cachedDbPromise) return cachedDbPromise;

  cachedDbPromise = loadDb();
  return cachedDbPromise;
}

async function loadDb() {
  const databasePath = getDatabasePath();
  const SQL = await initSqlJs();
  const fileBuffer = await fs.readFile(databasePath);
  cachedDb = new SQL.Database(fileBuffer);
  cachedDatabasePath = databasePath;
  cachedDb.run("PRAGMA foreign_keys = ON");
  return cachedDb;
}

export async function saveDb() {
  if (!cachedDb) return;
  if (process.env.SKILLMARKET_READONLY_DB === "1") return;
  const databasePath = cachedDatabasePath ?? getDatabasePath();
  await fs.writeFile(databasePath, Buffer.from(cachedDb.export()));
}
