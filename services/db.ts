import type { SQLiteDatabase } from "expo-sqlite";
import { INIT_SQL } from "./migrations/001_init";
import { MIGRATION_002_SQL } from "./migrations/002_add_streak_freeze";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 2; // Nâng version lên 2

  // Lấy version hiện tại của DB
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );

  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  // Bật chế độ WAL để tối ưu hiệu năng
  await db.execAsync(`PRAGMA journal_mode = 'wal';`);

  // Migration 001: Khởi tạo ban đầu
  if (currentDbVersion === 0) {
    await db.execAsync(INIT_SQL);
    currentDbVersion = 1;
  }

  // Migration 002: Thêm streak freeze và user_settings
  if (currentDbVersion === 1) {
    await db.execAsync(MIGRATION_002_SQL);
    currentDbVersion = 2;
  }

  // Cập nhật PRAGMA user_version lên phiên bản mới nhất
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}