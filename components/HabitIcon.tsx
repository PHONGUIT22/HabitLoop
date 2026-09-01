import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function HabitIcon({
  name,
  size = 40,
  onPress,
}: {
  name: string;
  size?: number;
  onPress?: () => void;
}) {
  const IconComp = (
    <View className="items-center justify-center">
      <Ionicons name={name as any} size={size} color="white" />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} className="p-2 rounded-full">
        {IconComp}
      </TouchableOpacity>
    );
  }

  return IconComp;
}
