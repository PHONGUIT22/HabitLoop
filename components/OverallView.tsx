// OverallHeatmapSVG.global.tsx (Your OverallView component)
import HabitActionSheet from "@/components/HabitActionSheet";
import { useHabitActions } from "@/hooks/useHabitActions";
import { useHabits } from "@/hooks/useHabits";
import { useHeatmapOverall } from "@/hooks/useOverallHeatmap";
import { useToggleHabitEntry } from "@/hooks/useToggle";
import { getDateInfo } from "@/utils/dateUtils";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import OverallHabitCard from "./OverallHabitCard";

export default function OverallView() {
  const router = useRouter();

  const { overallData, isLoading, error } = useHeatmapOverall();
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

  const { date: todayIso, weekStart: todayWeekStart } = getDateInfo();

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

  const handleLongPressHabit = (habit: any) => openActions(habit);

  //console.log("overallData: ", JSON.stringify(overallData, null, 2));

  if (isLoading)
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Error loading heatmap</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={overallData ?? []}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <OverallHabitCard
            habit={item}
            todayIso={todayIso}
            todayWeekStart={todayWeekStart}
            toggleCheckGlobal={toggleCheckGlobal}
            onLongPressHabit={handleLongPressHabit}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
