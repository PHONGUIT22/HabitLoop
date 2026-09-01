import type { SQLiteDatabase } from "expo-sqlite";
import { INIT_SQL } from "./migrations/001_init";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  // Get current database version
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );

  // Handle null case - default to 0 if no version is set
  let currentDbVersion = result?.user_version ?? 0;

  // If already at or above target version, skip migration
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  // Migration 001: Initial schema
  if (currentDbVersion === 0) {
    // Enable WAL mode for better performance
    await db.execAsync(`PRAGMA journal_mode = 'wal';`);

    // Execute the initial schema from imported SQL
    await db.execAsync(INIT_SQL);

    currentDbVersion = DATABASE_VERSION;
  }

  // Future migrations can be added here:
  // if (currentDbVersion === 1) {
  //   const { INIT_SQL: MIGRATION_002_SQL } = await import('./migrations/002_add_feature');
  //   await db.execAsync(MIGRATION_002_SQL);
  //   currentDbVersion = 2;
  // }

  // Update database version
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
