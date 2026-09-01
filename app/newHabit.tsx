import ColorOption from "@/components/ColorOption";
import HabitIcon from "@/components/HabitIcon";
import IconModal from "@/components/IconModal";
import { useHabits } from "@/hooks/useHabits";
import { habitColors } from "@/utils/habitColors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function NewHabitScreen() {
  const defaultIcon = "pulse-outline";
  const params = useLocalSearchParams<{ habitId?: string }>();
  const habitId = params.habitId ? parseInt(params.habitId) : undefined;
  const isEditMode = !!habitId;

  const { habits, addHabit, updateHabit } = useHabits();
  const router = useRouter();

  const existingHabit = isEditMode
    ? habits.find((h) => h.id === habitId)
    : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<string>(defaultIcon);
  const [color, setColor] = useState<string>(habitColors[0]);
  const [isIconModalVisible, setIsIconModalVisible] = useState(false);

  useEffect(() => {
    if (existingHabit) {
      setName(existingHabit.name || "");
      setDescription(existingHabit.description || "");
      setIcon(existingHabit.icon || defaultIcon);
      setColor(existingHabit.color || habitColors[0]);
    }
  }, [existingHabit]);

  const saveHabit = () => {
    if (!name.trim()) return;

    if (isEditMode && habitId) {
      updateHabit({
        id: habitId,
        name,
        description,
        icon,
        color,
        frequency: existingHabit?.frequency || "daily",
        target: existingHabit?.target || 1,
      });
    } else {
      addHabit({
        name,
        description,
        icon,
        color,
        frequency: "daily",
        target: 1,
      });
    }

    router.back();
  };

  const isSaveEnabled = name.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-neutral-900">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 bg-neutral-900">
          {/* HEADER */}
          <View className="flex-row items-center px-5 pb-5">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>

            <Text className="text-white text-2xl font-semibold ml-4">
              {isEditMode ? "Edit Habit" : "New Habit"}
            </Text>
          </View>

          {/* Allow taps to persist through the open keyboard so color taps still register */}
          <ScrollView
            className="flex-1 px-5"
            contentContainerStyle={{ paddingBottom: 120 }}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "none"}
          >
            {/* ICON */}
            <View className="items-center mb-6">
              <TouchableOpacity
                onPress={() => setIsIconModalVisible(true)}
                className="w-32 h-32 rounded-full bg-neutral-800 items-center justify-center border border-neutral-700"
              >
                <HabitIcon name={icon} size={60} />
              </TouchableOpacity>
            </View>

            {/* NAME */}
            <Text className="text-white text-lg font-bold mb-2 ">Name</Text>
            <TextInput
              className="bg-neutral-800 px-4 py-4 rounded-xl text-white mb-5 border border-neutral-700"
              placeholder="Enter habit name"
              placeholderTextColor="#777"
              value={name}
              onChangeText={setName}
            />

            {/* DESCRIPTION */}
            <Text className="text-white text-lg font-bold mb-2">
              Description
            </Text>
            <TextInput
              className="bg-neutral-800 px-4 py-6 rounded-xl text-white mb-5 border border-neutral-700"
              placeholder="Description"
              placeholderTextColor="#777"
              value={description}
              onChangeText={setDescription}
            />

            {/* COLOR */}
            <Text className="text-white mb-3">Color</Text>

            <View className="flex-row flex-wrap mb-5">
              {habitColors.map((c) => (
                <ColorOption
                  key={c}
                  color={c}
                  selected={c === color}
                  onPress={() => {
                    Keyboard.dismiss();
                    setColor(c);
                  }}
                />
              ))}
            </View>

            {/* ICON MODAL */}
            <IconModal
              visible={isIconModalVisible}
              onClose={() => setIsIconModalVisible(false)}
              onSelect={(selectedIcon) => setIcon(selectedIcon)}
            />
          </ScrollView>

          {/* SAVE BUTTON – moves above keyboard */}
          <View className="absolute bottom-0 w-full px-5 pb-2">
            <TouchableOpacity
              onPress={saveHabit}
              className="py-4 rounded-full bg-white"
            >
              <Text className="text-center text-lg font-semibold text-black">
                {isEditMode ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
