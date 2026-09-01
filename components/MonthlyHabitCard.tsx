// components/MonthlyHabitCard.tsx
import Colors from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { Canvas, Rect as SkRect } from "@shopify/react-native-skia";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CELL = 14;
const GAP = 4;
const STRIDE = CELL + GAP;

const getColor = (val: 0 | 1 | null, color: string | null) =>
  val === 1 ? (color ?? "#40c463") : Colors.cellColor;

export interface MonthlyHabitCardProps {
  habit: any;
  todayIso: string;
  toggleCheckGlobal: (
    habitId: number,
    dateIso: string,
    curStatus: 0 | 1 | null
  ) => void;
  onLongPressHabit: (habit: any) => void;
}

export default function MonthlyHabitCard({
  habit,
  todayIso,
  toggleCheckGlobal,
  onLongPressHabit,
}: MonthlyHabitCardProps) {
  const weekStartDates: string[] = habit.weeks ?? [];
  const weeks: (0 | 1 | null)[][] = habit.entries ?? [];

  // Build rects for the heatmap grid
  const rects = useMemo(() => {
    const arr: {
      x: number;
      y: number;
      status: 0 | 1 | null;
      opacity: number;
      color: string;
      dateIso?: string;
    }[] = [];

    if (!weekStartDates.length) return arr;

    const middleIndex = Math.floor(weekStartDates.length / 2);
    const currentMonth = DateTime.fromISO(weekStartDates[middleIndex]).month;

    for (let w = 0; w < weeks.length; w++) {
      const week = weeks[w] ?? [];
      const weekStartIso = weekStartDates[w];
      if (!weekStartIso) continue;

      const weekStart = DateTime.fromISO(weekStartIso);

      for (let d = 0; d < 7; d++) {
        const cellDate = weekStart.plus({ days: d });
        //const iso = cellDate.toISODate(); // YYYY-MM-DD
        const iso = cellDate.toISO()?.substring(0, 10) ?? "";

        const isOutside = cellDate.month !== currentMonth;

        const status = isOutside ? null : (week[d] ?? null);

        arr.push({
          x: d * STRIDE,
          y: w * STRIDE,
          status,
          opacity: isOutside ? 0 : 1,
          color: isOutside
            ? "transparent"
            : getColor(status, habit.color ?? null),
          dateIso: iso,
        });
      }
    }

    return arr;
  }, [weekStartDates, weeks, habit.color]);

  const width = 7 * STRIDE - GAP;
  const height = (weeks.length || 1) * STRIDE - GAP;

  // Helper: find week index that contains a given dateIso (YYYY-MM-DD)
  const findWeekIndexForDate = (dateIso: string) => {
    // Iterate weekStartDates and check if dateIso is between weekStart and weekStart + 6 days
    for (let i = 0; i < weekStartDates.length; i++) {
      const start = DateTime.fromISO(weekStartDates[i]);
      const end = start.plus({ days: 6 });
      const date = DateTime.fromISO(dateIso);
      if (date >= start.startOf("day") && date <= end.endOf("day")) {
        return i;
      }
    }
    // fallback to last week index if not found
    return Math.max(0, weekStartDates.length - 1);
  };

  // Helper: get status for a dateIso (0|1|null)
  const getStatusForDate = (dateIso: string): 0 | 1 | null => {
    if (!weekStartDates.length || !weeks.length) return null;
    const wkIdx = findWeekIndexForDate(dateIso);
    const date = DateTime.fromISO(dateIso);
    const weekdayIdx = date.weekday - 1; // 0..6
    const week = weeks[wkIdx] ?? [];
    return (week[weekdayIdx] as 0 | 1 | null) ?? null;
  };

  // Use the helper to compute today's status (ensures correct week lookup)
  const todayStatus = getStatusForDate(todayIso);

  const onPressToday = () => {
    // Use the same getStatusForDate for current value and pass the actual dateIso
    toggleCheckGlobal(habit.id, todayIso, todayStatus);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onLongPress={() => onLongPressHabit(habit)}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons
            name={habit.icon ?? "help-outline"}
            size={20}
            color="#fff"
          />
        </View>

        <Text numberOfLines={1} style={styles.habitName}>
          {habit.name}
        </Text>

        <TouchableOpacity
          onPress={onPressToday}
          style={[
            styles.checkButton,
            {
              backgroundColor:
                todayStatus === 1
                  ? (habit.color ?? "#40c463")
                  : Colors.checkBoxBackground,
            },
          ]}
        >
          <Ionicons name="checkmark" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={{ width, height }}>
          <Canvas style={{ width, height }}>
            {rects.map((r, i) => (
              <SkRect
                key={i}
                x={r.x}
                y={r.y}
                width={CELL}
                height={CELL}
                opacity={r.opacity}
                color={r.color}
              />
            ))}
          </Canvas>
        </View>
      </ScrollView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.habitCardBackground,
    padding: 14,
    borderRadius: 18,
    flex: 1,
    margin: 6,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    alignContent: "center",
    justifyContent: "center",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  iconWrap: {
    backgroundColor: Colors.habitIconBackground,
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },

  habitName: { color: "white", fontSize: 13, flex: 1, paddingRight: 2 },

  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
