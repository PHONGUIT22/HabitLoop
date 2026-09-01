import React, { useEffect } from "react";
import { Dimensions, Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

interface StreakCelebrationProps {
  visible: boolean;
  onClose: () => void;
  streakCount: number;
}

const { width } = Dimensions.get("window");

export default function StreakCelebration({
  visible,
  onClose,
  streakCount,
}: StreakCelebrationProps) {
  useEffect(() => {
    if (visible && Platform.OS !== "web") {
      // Trigger haptic feedback only on native devices
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const timer = setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        {/* Confetti Animation */}
        {visible && (
          <ConfettiCannon
            count={100}
            origin={{ x: width / 2, y: -20 }}
            fadeOut={true}
            fallSpeed={3000}
          />
        )}

        {/* Celebration Dialog Card */}
        <View className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-3xl p-6 items-center shadow-2xl">
          {/* Flame Icon */}
          <View className="w-20 h-20 rounded-full bg-orange-500/20 border border-orange-500/40 items-center justify-center mb-3">
            <Ionicons name="flame" size={46} color="#f97316" />
          </View>

          {/* Title & Description */}
          <Text className="text-xl font-bold text-white text-center">
            ALL DONE FOR TODAY! 🎉
          </Text>

          <Text className="text-neutral-400 text-xs text-center mt-1.5 px-2">
            You've completed all your habits. Your streak is on fire!
          </Text>

          {/* Streak Counter Badge */}
          <View className="bg-neutral-800/70 border border-neutral-700/50 rounded-xl py-2.5 px-5 my-4 flex-row items-center gap-2">
            <Ionicons name="flash" size={20} color="#eab308" />
            <Text className="text-white font-bold text-sm">
              Current Streak: <Text className="text-yellow-400">{streakCount} Days</Text> 🔥
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onClose();
            }}
            className="w-full bg-orange-500 py-3 rounded-xl items-center justify-center active:opacity-90"
          >
            <Text className="text-white font-bold text-sm tracking-wide">
              Keep It Up ✨
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}