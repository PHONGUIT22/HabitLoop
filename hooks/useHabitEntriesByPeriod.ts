
import { Habit } from "@/types/dbTypes";
import { getDateInfo } from "@/utils/dateUtils";
import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { DateTime } from "luxon";

export type HabitWithEntry = Habit & {
  entry_status: 0 | 1 | null; // null if no entry exists
  entry_date: string | null;
};

export const useHabitEntriesByPeriod = (
  period: "today" | "weekly" | "monthly" | "overall"
) => {
  const db = useSQLiteContext();
  const dateInfo = getDateInfo();

  // Helper to ensure today's entries exist (for midnight reset)
  const ensureTodayEntries = async (habits: Habit[]) => {
    const today = dateInfo.date;
    const now = DateTime.local().toISO() ?? "";

    for (const habit of habits) {
      const existing = await db.getFirstAsync<{ id: number }>(
        "SELECT id FROM habits_entry WHERE habit_id = ? AND date = ?",
        [habit.id, today]
      );

      if (!existing) {
        // Create entry with status 0 (unchecked) for new day
        await db.runAsync(
          "INSERT INTO habits_entry (habit_id, date, status, created_at) VALUES (?, ?, 0, ?)",
          [habit.id, today, now]
        );
      }
    }
  };

  // TODAY view - single entry per habit for today
  const todayQuery = useQuery<HabitWithEntry[]>({
    queryKey: ["habits-entries-today", dateInfo.date],
    queryFn: async () => {
      // First get all active habits
      const habits = await db.getAllAsync<Habit>(
        'SELECT * FROM habits WHERE active = 1 ORDER BY "order" ASC, id DESC'
      );

      // Ensure today's entries exist (midnight reset logic)
      await ensureTodayEntries(habits);

      // Fetch habits with today's entry status
      // Use a subquery to get the latest entry status for each habit
      const results = await db.getAllAsync<HabitWithEntry>(
        `
        SELECT 
          h.*,
          (SELECT he.status FROM habits_entry he 
           WHERE he.habit_id = h.id AND he.date = ? 
           ORDER BY he.updated_at DESC, he.created_at DESC 
           LIMIT 1) as entry_status,
          ? as entry_date
        FROM habits h
        WHERE h.active = 1
        ORDER BY h."order" ASC, h.id DESC
        `,
        [dateInfo.date, dateInfo.date]
      );

      // Map and ensure proper types
      const mapped = results.map((r) => ({
        ...r,
        entry_status: r.entry_status ?? null,
        entry_date: r.entry_date ?? null,
      }));

      // Final deduplication by habit ID (safety net)
      const habitMap = new Map<number, HabitWithEntry>();
      mapped.forEach((habit) => {
        if (!habitMap.has(habit.id)) {
          habitMap.set(habit.id, habit);
        }
      });

      return Array.from(habitMap.values());
    },
  });

  // you can add more periods here if you need it
  switch (period) {
    case "today":
      return todayQuery;
    default:
      return todayQuery;
  }
};
