export const INIT_SQL = `
-- User table: tracks free/pro status
CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  is_pro INTEGER NOT NULL DEFAULT 0,
  pro_type TEXT,  
  pro_expiry TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT
);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'custom')),
  target INTEGER,
  active INTEGER NOT NULL DEFAULT 1,
  "order" INTEGER NOT NULL DEFAULT 0
);


-- Habit entries table (only user interactions)
CREATE TABLE IF NOT EXISTS habits_entry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  status INTEGER NOT NULL CHECK (status IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_entry_habit_date 
  ON habits_entry (habit_id, date);


-- Heatmap cache table (weekly aggregation)
CREATE TABLE IF NOT EXISTS habit_heatmap (
  habit_id INTEGER NOT NULL,
  week_start TEXT NOT NULL,
  statuses TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (habit_id, week_start),
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_heatmap_habit_week 
  ON habit_heatmap (habit_id, week_start);


-- Subscription history (optional)
CREATE TABLE IF NOT EXISTS subscription_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('monthly', 'yearly', 'lifetime')),
  purchase_token TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  created_at TEXT NOT NULL
);

-- Migration version record (optional)
CREATE TABLE IF NOT EXISTS migrations (
  version INTEGER PRIMARY KEY
);
INSERT INTO migrations (version) VALUES (1);
`;
