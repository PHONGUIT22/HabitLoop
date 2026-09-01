import Colors from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const EmptyView = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-2xl font-semibold mb-2">
        No habit found !
      </Text>

      <Text className="text-gray-400 text-lg mb-6">
        Create a new habit to track progress
      </Text>

      <Link href="/newHabit" asChild>
        <TouchableOpacity
          className="bg-neutral-800 rounded-full px-10 py-3 flex-row items-center justify-center"
          style={{ borderWidth: 1, borderColor: Colors.borderColor }}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white ml-1 text-lg font-medium">Create</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default EmptyView;
