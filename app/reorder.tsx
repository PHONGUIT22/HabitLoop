import HabitIcon from "@/components/HabitIcon";
import { useHabits } from "@/hooks/useHabits";
import { Habit } from "@/types/dbTypes";
import Colors from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

export default function ReorderScreen() {
  const router = useRouter();
  const { habits, reorderHabits } = useHabits();
  const [orderedHabits, setOrderedHabits] = useState<Habit[]>([]);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (habits && !isDraggingRef.current) {
      // Sort by order field
      const sorted = [...habits].sort((a, b) => {
        const orderA = a.order ?? 0;
        const orderB = b.order ?? 0;
        return orderA - orderB;
      });
      setOrderedHabits(sorted);
    }
  }, [habits]);

  const handleDragBegin = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = ({ data }: { data: Habit[] }) => {
    // Update local state immediately for smooth UI
    setOrderedHabits(data);

    // Extract IDs in new order
    const habitIds = data.map((habit) => habit.id);

    // Call reorder after a small delay to let animation complete
    setTimeout(() => {
      reorderHabits(habitIds);
      // Reset dragging flag after a delay to allow query to update
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 300);
    }, 100);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Habit>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          className={`flex-row items-center  rounded-2xl p-4 mb-4 ${
            isActive ? "opacity-50" : ""
          }`}
          style={{
            transform: [{ scale: isActive ? 0.98 : 1 }],
            backgroundColor: Colors.habitCardBackground,
            borderWidth: 1,
            borderColor: Colors.borderColor,
          }}
        >
          {/* Icon */}
          <View
            className="rounded-2xl p-4 mr-3"
            style={{ backgroundColor: item.color || "#3b82f6" }}
          >
            <HabitIcon name={item.icon || "help-outline"} size={24} />
          </View>

          {/* Name */}
          <Text className="flex-1 text-white text-lg">{item.name}</Text>

          {/* Drag Handle */}
          <View className="ml-3">
            <Ionicons name="reorder-three-outline" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <View className="flex-1 bg-neutral-900">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-12 ">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-semibold ml-4">
          Reorder habits
        </Text>
      </View>
      <Text className="text-gray-400 text-lg px-5 py-5 mb-2">
        Long press an item to reorder.
      </Text>
      {/* Habits List */}
      <View className="flex-1 px-5">
        <DraggableFlatList
          data={orderedHabits}
          onDragBegin={handleDragBegin}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          activationDistance={10}
          dragItemOverflow={true}
        />
      </View>
    </View>
  );
}
