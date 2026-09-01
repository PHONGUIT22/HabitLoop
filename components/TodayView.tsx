// components/TodayView.tsx
import HabitActionSheet from "@/components/HabitActionSheet";
import { useHabitActions } from "@/hooks/useHabitActions";
import {
  HabitWithEntry,
  useHabitEntriesByPeriod,
} from "@/hooks/useHabitEntriesByPeriod";
import { useHabits } from "@/hooks/useHabits";
import { useToggleHabitEntry } from "@/hooks/useToggle";
import { Habit } from "@/types/dbTypes";
import Colors from "@/utils/colors";
import { getDateInfo } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TodayViewProps {
  habits?: any[];
  onAllCompleted?: (newStreak: number) => void;
}

export default function TodayView({
  habits: _habits,
  onAllCompleted,
}: TodayViewProps) {
  const router = useRouter();
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

  const t = getDateInfo();

  const { archiveHabit, deleteHabit } = useHabits();
  const { toggleCheck } = useToggleHabitEntry();

  // Fetch habits with today's entry status
  const {
    data: habitsWithEntries,
    isLoading,
    error,
    refetch,
  } = useHabitEntriesByPeriod("today");

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const habitsData: HabitWithEntry[] =
    (habitsWithEntries as HabitWithEntry[]) || [];

  const handleArchive = (habit: Habit) => {
    archiveHabit(habit.id);
  };

  const handleDelete = (habit: Habit) => {
    deleteHabit(habit.id);
  };

  const handleEdit = (habit: Habit) => {
    router.push({
      pathname: "/newHabit",
      params: { habitId: habit.id.toString() },
    });
  };

  const handleReorder = () => {
    router.push("/reorder");
  };

  // Handle checkbox press and check if all habits are completed for celebration
  const handleCheckboxPress = async (habit: HabitWithEntry, e: any) => {
    e.stopPropagation();
    
    // Toggle entry status
    await toggleCheck(habit.id, t.date, habit.entry_status);

    // If changing from unchecked (0) to checked (1), check if all habits are completed
    if (habit.entry_status === 0 && onAllCompleted) {
      const otherHabitsCompleted = habitsData
        .filter((h) => h.id !== habit.id)
        .every((h) => h.entry_status === 1);

      if (otherHabitsCompleted && habitsData.length > 0) {
        onAllCompleted(1); // Trigger streak celebration callback
      }
    }
  };

  const handleCardPress = (habit: HabitWithEntry) => {
    // TODO: Navigate to habit detail screen
  };

  const handleCardLongPress = (habit: HabitWithEntry) => {
    openActions(habit as Habit);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">Error loading habits</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList<HabitWithEntry>
        data={habitsData}
        keyExtractor={(item, index) => `habit-${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const isChecked = item.entry_status === 1;
          const checkboxColor = isChecked
            ? item.color || "#fff"
            : Colors.checkBoxBackground;
          const checkmarkColor = isChecked ? "white" : Colors.checkMarkColor;

          return (
            <View
              className="flex-row items-center justify-between rounded-2xl p-4 mb-4"
              style={{
                backgroundColor: Colors.habitCardBackground,
                borderWidth: 1,
                borderColor: Colors.borderColor,
              }}
            >
              <TouchableOpacity
                onPress={() => handleCardPress(item)}
                onLongPress={() => handleCardLongPress(item)}
                className="flex-row items-center flex-1"
                activeOpacity={0.7}
              >
                <View
                  className="rounded-2xl p-4 mr-3"
                  style={{ backgroundColor: Colors.habitIconBackground }}
                >
                  <Ionicons
                    name={(item.icon as any) ?? "help-outline"}
                    size={24}
                    color="#fff"
                  />
                </View>
                <Text className="flex-1 text-white text-lg">{item.name}</Text>
              </TouchableOpacity>

              {/* Checkbox item */}
              <Pressable
                onPress={(e) => handleCheckboxPress(item, e)}
                className="rounded-2xl items-center justify-center"
                style={{
                  backgroundColor: checkboxColor,
                  width: 48,
                  height: 48,
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="checkmark" size={25} color={checkmarkColor} />
              </Pressable>
            </View>
          );
        }}
      />

      <HabitActionSheet
        selectedHabit={selectedHabit}
        actionSheetOpen={actionSheetOpen}
        confirmSheet={confirmSheet}
        onCloseActions={closeActions}
        onShowConfirm={showConfirm}
        onCloseConfirm={closeConfirm}
        onConfirm={() => handleConfirm(handleArchive, handleDelete)}
        onEdit={handleEdit}
        onReorder={handleReorder}
      />
    </View>
  );
}