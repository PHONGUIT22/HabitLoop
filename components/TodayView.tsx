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
  habits?: any[]; // Keep for backward compatibility, but we'll use hook data
}

export default function TodayView({ habits: _habits }: TodayViewProps) {
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

  // Fetch habits with today's entry status - explicitly type as HabitWithEntry[]
  const {
    data: habitsWithEntries,
    isLoading,
    error,
    refetch,
  } = useHabitEntriesByPeriod("today");

  // Refetch when screen comes into focus (e.g., returning from edit/reorder screens)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Type assertion to ensure TypeScript knows this is HabitWithEntry[]
  const habitsData: HabitWithEntry[] =
    (habitsWithEntries as HabitWithEntry[]) || [];

  //console.log("Data", JSON.stringify(habitsData, null, 2));

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

  // Handle checkbox press (only checkbox, not the whole card)
  const handleCheckboxPress = (habit: HabitWithEntry, e: any) => {
    e.stopPropagation(); // Prevent card press
    toggleCheck(habit.id, t.date, habit.entry_status); // Toggle today's entry
  };

  // Handle card press (for navigation - to be implemented later)
  const handleCardPress = (habit: HabitWithEntry) => {
    // TODO: Navigate to habit detail screen
    // router.push({ pathname: "/habitDetail", params: { habitId: habit.id.toString() } });
  };

  // Handle long press (for action sheet) - cast to Habit since HabitWithEntry extends Habit
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
            : Colors.checkBoxBackground; // Gray when unchecked
          const checkmarkColor = isChecked ? "white" : Colors.checkMarkColor; // Darker gray checkmark when unchecked

          return (
            <View
              className="flex-row items-center justify-between rounded-2xl  p-4 mb-4"
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
                  className="bg-neutral-800 rounded-2xl p-4 mr-3"
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

              {/* Checkbox - only this is pressable for toggle */}
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
