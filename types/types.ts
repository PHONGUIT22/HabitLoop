
import { IconName } from "./icons";

export type UUID = string;

/* Habit table */
export interface Habit {
  id: number; // from SQLite AUTOINCREMENT
  title: string;
  description?: string;
  icon?: IconName; // icon name (ex: "alarm-outline")
  color?: string; // hex color string
  active: number; // 1 active, 0 inactive
  created_at: string; // ISO timestamp
}

/* habit_entries table */
export interface HabitEntry {
  id: number;
  habit_id: number;
  date: string; // "YYYY-MM-DD"
  status: number; // 1 completed
  created_at: string;
}

/* For queries where we join habits + status for today */
export interface HabitWithStatus extends Habit {
  todayCompleted?: boolean;
}
