import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PurchasesPackage } from "react-native-purchases";
import { revenueCat } from "@/services/revenueCat";
import * as Haptics from "expo-haptics";

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PRO_FEATURES = [
  {
    icon: "infinite-outline",
    title: "Unlimited Habits",
    desc: "Break free from the 3-habit limit",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Streak Freeze",
    desc: "Protect your streak if you miss a day",
  },
  {
    icon: "bar-chart-outline",
    title: "Advanced Analytics",
    desc: "Detailed heatmaps and performance insights",
  },
  {
    icon: "notifications-outline",
    title: "Smart Reminders",
    desc: "Flexible, customizable alerts",
  },
];

export default function PaywallModal({
  visible,
  onClose,
  onSuccess,
}: PaywallModalProps) {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // Fetch offerings when modal becomes visible
  useEffect(() => {
    if (visible) {
      fetchOfferings();
    }
  }, [visible]);

  const fetchOfferings = async () => {
    setLoading(true);
    const availablePackages = await revenueCat.getOfferings();
    setPackages(availablePackages);
    if (availablePackages.length > 0) {
      // Default to the second package (usually Annual) or the first available
      setSelectedPackage(availablePackages[1] || availablePackages[0]);
    }
    setLoading(false);
  };

  // Handle subscription purchase
  const handlePurchase = async () => {
    if (!selectedPackage) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPurchasing(true);

    const result = await revenueCat.makePurchase(selectedPackage);
    setPurchasing(false);

    if (result.success && result.isPro) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success! 🎉", "You have unlocked all Habit Pro features.");
      onSuccess?.();
      onClose();
    } else if (!result.success) {
      Alert.alert("Notice", "The purchase was canceled or could not be completed.");
    }
  };

  // Handle purchase restoration
  const handleRestore = async () => {
    setPurchasing(true);
    const result = await revenueCat.restorePurchases();
    setPurchasing(false);

    if (result.isPro) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Restored! 🎉", "Your Pro access has been successfully restored.");
      onSuccess?.();
      onClose();
    } else {
      Alert.alert("Notice", "No active Pro subscription found for this account.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-neutral-900 rounded-t-[32px] p-6 max-h-[88%] border-t border-neutral-800">
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full bg-neutral-800 items-center justify-center"
          >
            <Ionicons name="close" size={18} color="#a3a3a3" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header Badge & Title */}
            <View className="items-center mt-1 mb-4">
              <View className="bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 mb-2">
                <Text className="text-amber-400 font-bold text-xs tracking-wider">
                  ★ HABIT PRO ★
                </Text>
              </View>
              <Text className="text-2xl font-bold text-white text-center">
                Unlock Your Potential
              </Text>
              <Text className="text-neutral-400 text-xs text-center mt-1">
                Build consistent habits without limitations
              </Text>
            </View>

            {/* Feature List */}
            <View className="bg-neutral-800/50 rounded-2xl p-3.5 mb-5 border border-neutral-800">
              {PRO_FEATURES.map((item, index) => (
                <View
                  key={index}
                  className={`flex-row items-center py-2 ${
                    index !== PRO_FEATURES.length - 1
                      ? "border-b border-neutral-800/80"
                      : ""
                  }`}
                >
                  <View className="w-8 h-8 rounded-full bg-amber-500/10 items-center justify-center mr-3">
                    <Ionicons name={item.icon as any} size={18} color="#f59e0b" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-sm">
                      {item.title}
                    </Text>
                    <Text className="text-neutral-400 text-xs mt-0.5">
                      {item.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Package Options */}
            {loading ? (
              <ActivityIndicator color="#f59e0b" className="py-6" />
            ) : (
              <View className="gap-2.5 mb-5">
                {packages.map((pkg) => {
                  const isSelected = selectedPackage?.identifier === pkg.identifier;
                  return (
                    <TouchableOpacity
                      key={pkg.identifier}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedPackage(pkg);
                      }}
                      className={`p-3.5 rounded-2xl border-2 flex-row justify-between items-center ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-neutral-800 bg-neutral-800/30"
                      }`}
                    >
                      <View className="flex-1 pr-2">
                        <Text className="text-white font-bold text-sm">
                          {pkg.product.title}
                        </Text>
                        <Text className="text-neutral-400 text-[11px] mt-0.5">
                          {pkg.product.description}
                        </Text>
                      </View>
                      <Text
                        className={`font-bold text-base ${
                          isSelected ? "text-amber-400" : "text-white"
                        }`}
                      >
                        {pkg.product.priceString}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* CTA Button */}
            <TouchableOpacity
              disabled={purchasing}
              onPress={handlePurchase}
              className="bg-amber-500 py-3.5 rounded-2xl items-center justify-center active:opacity-90"
            >
              {purchasing ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-neutral-950 font-bold text-sm tracking-wide">
                  Continue with Pro
                </Text>
              )}
            </TouchableOpacity>

            {/* Footer Links */}
            <View className="flex-row justify-center items-center gap-3 mt-3.5 pb-2">
              <TouchableOpacity onPress={handleRestore}>
                <Text className="text-neutral-500 text-xs">Restore Purchases</Text>
              </TouchableOpacity>
              <Text className="text-neutral-600 text-xs">•</Text>
              <TouchableOpacity>
                <Text className="text-neutral-500 text-xs">Terms & Privacy</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}