import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function ColorOption({
  color,
  selected,
  onPress,
}: {
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-10 h-10 rounded-xl mx-1 my-1 items-center justify-center"
      style={{ backgroundColor: color }}
    >
      {selected && <View className="w-5 h-5 rounded-md bg-black/30" />}
    </TouchableOpacity>
  );
}
