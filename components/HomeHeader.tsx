import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HomeHeader = () => {
  return (
    <View className="flex-row justify-between items-center mb-6">
      {/* <Link href="/more">
        <Ionicons name="grid-outline" size={26} color="white" />
      </Link> */}
      <TouchableOpacity onPress={() => router.push("/more")}>
        <Ionicons name="grid-outline" size={24} color="white" />
      </TouchableOpacity>
      <Text className="text-white text-3xl font-bold">Habits</Text>

      <TouchableOpacity onPress={() => router.push("/newHabit")}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* <Link href="/newHabit">
        <Ionicons name="add" size={30} color="white" />
      </Link> */}
    </View>
  );
};

export default HomeHeader;
