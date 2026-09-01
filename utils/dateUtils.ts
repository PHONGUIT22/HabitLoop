// src/utils/dateUtils.ts
import { DateTime } from "luxon";

export type DateInfo = {
  now: DateTime;

  // Basic date info
  date: string; // "YYYY-MM-DD"
  weekday: number; // 1–7 (Mon–Sun)
  isoTimestamp: string | null; 

  // Week info
  weekStart: string; // Monday
  weekEnd: string; // Sunday

  // Month info
  monthStart: string; // 1st of month
  monthEnd: string; // last day of month

  // Year info
  yearStart: string; // Jan 01
  yearEnd: string; // Dec 31
};

export function getDateInfo(): DateInfo {
  const now = DateTime.local();

  const date = now.toFormat("yyyy-MM-dd");
  const weekday = now.weekday; // 1–7 (Mon–Sun)
  const isoTimestamp = now.toISO(); 

  // Calculate week start (Monday) and end (Sunday)
  // Luxon's weekday: 1=Monday, 7=Sunday
  const daysFromMonday = weekday === 7 ? 6 : weekday - 1; // If Sunday, go back 6 days
  const weekStart = now.minus({ days: daysFromMonday }).toFormat("yyyy-MM-dd");
  const weekEnd = now.plus({ days: 6 - daysFromMonday }).toFormat("yyyy-MM-dd");

  const monthStart = now.startOf("month").toFormat("yyyy-MM-dd");
  const monthEnd = now.endOf("month").toFormat("yyyy-MM-dd");

  const yearStart = now.startOf("year").toFormat("yyyy-MM-dd");
  const yearEnd = now.endOf("year").toFormat("yyyy-MM-dd");

  return {
    now,
    date,
    weekday,
    isoTimestamp: isoTimestamp ?? "", // Handle null case, or keep as null
    weekStart,
    weekEnd,
    monthStart,
    monthEnd,
    yearStart,
    yearEnd,
  };
}

// Helper function to check if a date is today or in the past
export function isDatePastOrToday(date: string): boolean {
  const dateInfo = getDateInfo();
  return date <= dateInfo.date;
}

// Helper function to get all dates in a week (Mon-Sun)
export function getWeekDates(): string[] {
  const dateInfo = getDateInfo();
  const dates: string[] = [];
  const start = DateTime.fromISO(dateInfo.weekStart);
  for (let i = 0; i < 7; i++) {
    dates.push(start.plus({ days: i }).toFormat("yyyy-MM-dd"));
  }
  return dates;
}

// Helper function to get weekday name (Mon, Tue, etc.)
export function getWeekdayName(date: string): string {
  const dt = DateTime.fromISO(date);
  return dt.toFormat("EEE"); // Returns "Mon", "Tue", etc.
}


