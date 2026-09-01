export type Habit = {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at: string;
  frequency?: "daily" | "weekly" | "monthly" | "custom";
  target?: number; // how many times to perform a habit. e.g. 3 times pushups
  active: number; // 1 active, 0 archived
  order?: number; // order for sorting habits
};

// export type HabitEntry = {
//   id: number;
//   habit_id: number;
//   date: string; // YYYY-MM-DD
//   status: 0 | 1; // checked or unchecked
//   created_at: string;
//   updated_at?: string;
// };
export type HabitEntryRow = {
  id: number;
  habit_id: number;
  date: string;
  status: number; // 0 | 1 but SQLite will return number
  created_at: string;
  updated_at: string | null;
};

export type HeatmapRow = {
  id: number;
  habit_id: number;
  week_start: string; // YYYY-MM-DD
  statuses: 0 | 1 | null; // JSON string or null
};
export type ParsedHeatmapEntry = {
  week_start: string;
  statuses: string | null;
};
export type HabitWithWeeklyEntries = Habit & {
  entries: ParsedHeatmapEntry[];
};

export type User = {
  id: 1;
  is_pro: number; // 0 = free, 1 = pro
  pro_type?: "monthly" | "yearly" | "lifetime";
  pro_expiry?: string | null;
  created_at: string;
  updated_at?: string;
};

export type SubscriptionHistory = {
  id: number;
  purchase_type: "monthly" | "yearly" | "lifetime";
  purchase_token?: string;
  start_date: string;
  end_date?: string | null;
  created_at: string;
};
