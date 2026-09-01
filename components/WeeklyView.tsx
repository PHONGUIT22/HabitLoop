import { FlashList } from "@shopify/flash-list";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";

import HabitActionSheet from "@/components/HabitActionSheet";
import { useHabitActions } from "@/hooks/useHabitActions";
import { useHabits } from "@/hooks/useHabits";
import { useToggleHabitEntry } from "@/hooks/useToggle";
import { useWeeklyHeatmap } from "@/hooks/useWeeklyHeatmap";
import { getDateInfo } from "@/utils/dateUtils";
import { router } from "expo-router";
import WeeklyHabitCard from "./WeeklyHabitCard";

export default function WeeklyView() {
  const { date: todayIso } = getDateInfo();
  const { toggleCheck } = useToggleHabitEntry();
  const { archiveHabit, deleteHabit } = useHabits();
  const { weeklyData } = useWeeklyHeatmap();

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

  const toggleCheckGlobal = useCallback(
    (habitId: number, dateIso: string, curStatus: 0 | 1 | null) => {
      toggleCheck(habitId, dateIso, curStatus);
    },
    [toggleCheck]
  );

  const handleEdit = (habit: any) =>
    router.push({
      pathname: "/newHabit",
      params: { habitId: habit.id.toString() },
    });

  if (!weeklyData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={weeklyData}
        keyExtractor={(i) => i.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <WeeklyHabitCard
            habit={item}
            todayIso={todayIso}
            toggleCheckGlobal={toggleCheckGlobal}
            onLongPressHabit={openActions}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
        onEdit={handleEdit}
        onReorder={() => router.push("/reorder")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
