// screens/MonthlyView.tsx
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useHabits } from "@/hooks/useHabits";
import { useMonthlyHeatmap } from "@/hooks/useMonthlyHeatmap";
import { useToggleHabitEntry } from "@/hooks/useToggle";
import { getDateInfo } from "@/utils/dateUtils";

import HabitActionSheet from "@/components/HabitActionSheet";
import MonthlyHabitCard from "@/components/MonthlyHabitCard";
import { useHabitActions } from "@/hooks/useHabitActions";

export default function MonthlyView() {
  const router = useRouter();

  const { monthlyData, isLoading, error } = useMonthlyHeatmap();
  const { toggleCheck } = useToggleHabitEntry();
  const { archiveHabit, deleteHabit } = useHabits();

  const {
    selectedHabit,
    actionSheetOpen,
    confirmSheet,
    openActions,
    closeActions,
    showConfirm,
    closeConfirm,
    handleConfirm,
  } = useHabitActions();

  const { date: todayIso } = getDateInfo();

  const toggleCheckGlobal = (
    habitId: number,
    dateIso: string,
    curStatus: 0 | 1 | null
  ) => toggleCheck(habitId, dateIso, curStatus);

  if (isLoading)
    return (
      <View style={styles.center}>
        <Text style={styles.txt}>Loading...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.txt}>Error loading monthly heatmap</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={monthlyData ?? []}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        // estimatedItemSize={250}
        renderItem={({ item }) => (
          <MonthlyHabitCard
            habit={item}
            todayIso={todayIso}
            toggleCheckGlobal={toggleCheckGlobal}
            onLongPressHabit={openActions}
          />
        )}
      />

      <HabitActionSheet
        selectedHabit={selectedHabit}
        actionSheetOpen={actionSheetOpen}
        confirmSheet={confirmSheet}
        onCloseActions={closeActions}
        onShowConfirm={showConfirm}
        onCloseConfirm={closeConfirm}
        onConfirm={() =>
          handleConfirm(
            (habit) => archiveHabit(habit.id),
            (habit) => deleteHabit(habit.id)
          )
        }
        onEdit={(habit) =>
          router.push({
            pathname: "/newHabit",
            params: { habitId: habit.id.toString() },
          })
        }
        onReorder={() => router.push("/reorder")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  txt: { color: "white" },
});
