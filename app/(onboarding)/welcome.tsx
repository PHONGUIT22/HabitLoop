import { useAuthStore } from "@/services/authStorage";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const { completedOnboarding } = useAuthStore();

  const onGetStarted = async () => {
    completedOnboarding();
    router.replace("/(tabs)"); // Go to main app
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["bottom"]}>
      <View className="flex-1">
        {/* Full Top Image */}
        <Image
          source={require("../../assets/images/welcome-image.png")}
          style={{ width: width, height: width * 1.5 }}
          resizeMode="cover"
        />

        {/* Content pushed to bottom */}
        <View className="flex-1 justify-end">
          <View className="bg-black  px-6 pt-10 pb-10">
            {/* Title Text */}
            <Text className="text-white text-4xl font-bold text-center mb-3 leading-snug">
              Welcome to{"\n"}Habit tracker
            </Text>

            {/* Subtitle */}

            <Text className="text-gray-400 text-xl text-center mb-10 max-w-[260px] self-center">
              Small steps every day lead to big changes.
            </Text>

            {/* Bottom Button */}
            <TouchableOpacity
              onPress={onGetStarted}
              className="bg-white rounded-full py-4 w-full max-w-md self-center"
              activeOpacity={0.8}
            >
              <Text className="text-black text-lg font-semibold text-center">
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
