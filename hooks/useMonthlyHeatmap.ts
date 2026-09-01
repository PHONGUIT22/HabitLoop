import { getDateInfo } from "@/utils/dateUtils";
import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { DateTime } from "luxon";

type HeatmapRow = {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  created_at: string;
  frequency: string;
  target: number;
  active: number;
  order: number;
  week_start: string | null;
  statuses: string | null; 
};

const HEATMAP_QUERY = `
SELECT 
  h.*,
  hh.week_start,
  hh.statuses
FROM habits h
LEFT JOIN habit_heatmap hh
  ON hh.habit_id = h.id
  AND hh.week_start BETWEEN ? AND ?
WHERE h.active = 1
ORDER BY h."order" ASC, hh.week_start ASC;
`;

export function useMonthlyHeatmap() {
  const db = useSQLiteContext();

  const {
    data: monthlyData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["heatmap-monthly"],
    queryFn: async () => {
      const t = getDateInfo();

      // Compute all Mondays from year start → current week
      const monthStartWeek = DateTime.fromISO(t.monthStart)
        .startOf("week")
        .toFormat("yyyy-MM-dd");

      const monthEndWeek = DateTime.fromISO(t.monthEnd)
        .startOf("week")
        .toFormat("yyyy-MM-dd");

      const weeks: string[] = [];
      let cursor = DateTime.fromISO(monthStartWeek);
      const end = DateTime.fromISO(monthEndWeek);

      while (cursor <= end) {
        weeks.push(cursor.toFormat("yyyy-MM-dd"));
        cursor = cursor.plus({ weeks: 1 });
      }

      // Fetch heatmap data from DB
      const rows = await db.getAllAsync<HeatmapRow>(HEATMAP_QUERY, [
        monthStartWeek,
        monthEndWeek,
      ]);

      // Group by habit ID
      const habitMap = new Map<number, any>();
      for (const row of rows) {
        if (!habitMap.has(row.id)) {
          habitMap.set(row.id, {
            id: row.id,
            name: row.name,
            description: row.description,
            icon: row.icon,
            color: row.color,
            created_at: row.created_at,
            frequency: row.frequency,
            target: row.target,
            active: row.active,
            order: row.order,
            entriesMap: {}, // temporary map: week_start → statuses array
          });
        }

        const habit = habitMap.get(row.id);

        if (row.week_start && row.statuses) {
          habit.entriesMap[row.week_start] = JSON.parse(row.statuses) as (
            | 0
            | 1
            | null
          )[];
        }
      }

  
      const result = Array.from(habitMap.values()).map((habit) => {
        const entries: (0 | 1 | null)[][] = weeks.map((weekStart) => {
          return habit.entriesMap[weekStart] ?? Array(7).fill(null);
        });
        return {
          ...habit,
          entries,
          weeks, // <-- add this line (same weeks order for ALL habits)
        };

        // return {
        //   id: habit.id,
        //   name: habit.name,
        //   description: habit.description,
        //   icon: habit.icon,
        //   color: habit.color,
        //   created_at: habit.created_at,
        //   frequency: habit.frequency,
        //   target: habit.target,
        //   active: habit.active,
        //   order: habit.order,
        //   entries, // Option A: 2D array
        // };
      });

      return result;
    },
  });

  return { monthlyData, isLoading, error, refetch };
}
