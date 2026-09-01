import Colors from "@/utils/colors";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface ConfirmSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
}

const ConfirmSheet = ({
  visible,
  onClose,
  title,
  message,
  confirmText,
  onConfirm,
}: ConfirmSheetProps) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* Backdrop */}
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      {/* Sheet */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-neutral-900 p-6 rounded-t-3xl"
        style={{
          borderWidth: 1,
          borderColor: Colors.borderColor,
          borderBottomWidth: 0, // hide bottom border
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,

          overflow: "hidden", // keeps curves clean
        }}
      >
        <View className="mb-4 mt-4 items-center">
          {/* <View className="w-12 h-1.5 bg-neutral-700 rounded-full mb-4" /> */}
          <Text className="text-white text-xl font-semibold mb-2">{title}</Text>
          <Text className="text-neutral-300 text-center">{message}</Text>
        </View>

        <TouchableOpacity
          className="bg-white p-4 rounded-2xl mb-3"
          onPress={onConfirm}
        >
          <Text className="text-center text-black font-semibold text-lg">
            {confirmText}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-neutral-800 p-4 rounded-2xl"
          onPress={onClose}
        >
          <Text className="text-center text-white font-semibold text-lg">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ConfirmSheet;
