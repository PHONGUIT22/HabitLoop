export const MIGRATION_002_SQL = `

ALTER TABLE user ADD COLUMN streak_freeze_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user ADD COLUMN last_freeze_date TEXT;


CREATE TABLE IF NOT EXISTS user_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  notifications_enabled INTEGER NOT NULL DEFAULT 1,
  reminder_time TEXT DEFAULT '20:00',
  sound_enabled INTEGER NOT NULL DEFAULT 1,
  theme TEXT DEFAULT 'dark',
  updated_at TEXT NOT NULL
);


INSERT OR IGNORE INTO user_settings (id, notifications_enabled, reminder_time, sound_enabled, theme, updated_at)
VALUES (1, 1, '20:00', 1, 'dark', datetime('now'));


INSERT OR IGNORE INTO migrations (version) VALUES (2);
`;