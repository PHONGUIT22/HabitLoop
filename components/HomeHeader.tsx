import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HomeHeaderProps {
  isPro?: boolean;
  onAddPress?: () => void;
  onProPress?: () => void;
}

const HomeHeader = ({ isPro, onAddPress, onProPress }: HomeHeaderProps) => {
  // Trigger custom add action if provided; otherwise fallback to default navigation
  const handleAdd = () => {
    if (onAddPress) {
      onAddPress();
    } else {
      router.push("/newHabit");
    }
  };

  return (
    <View className="flex-row justify-between items-center mb-6">
      {/* Settings / More button */}
      <TouchableOpacity onPress={() => router.push("/more")}>
        <Ionicons name="grid-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Screen Title & Pro Badge */}
      <View className="flex-row items-center gap-2">
        <Text className="text-white text-3xl font-bold">Habits</Text>
        {isPro && (
          <TouchableOpacity
            onPress={onProPress}
            className="bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40"
          >
            <Text className="text-amber-400 font-bold text-xs tracking-wider">
              PRO
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Add new habit button */}
      <TouchableOpacity onPress={handleAdd}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;