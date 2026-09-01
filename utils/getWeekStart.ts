import { DateTime } from "luxon";

/**
 * Get the Monday (week start) for any given date
 * @param date - Date string in YYYY-MM-DD format
 * @returns Monday date string in YYYY-MM-DD format
 */
export function getWeekStart(date: string): string {
  return DateTime.fromISO(date)
    .startOf("week")
    .plus({ days: 1 })
    .toFormat("yyyy-MM-dd");
}
