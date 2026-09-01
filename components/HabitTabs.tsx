import Colors from "@/utils/colors";
import { Text, TouchableOpacity, View } from "react-native";

type FilterType = "Today" | "Weekly" | "Monthly" | "Overall";

type Props = {
  filters: readonly FilterType[];
  activeTab: FilterType;
  onChange: (tab: FilterType) => void; // FIXED TYPE
};

export default function HabitTabs({ filters, activeTab, onChange }: Props) {
  return (
    <View className="flex-row gap-2 mb-6">
      {filters.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => onChange(item)}
          className={`px-5 py-2 rounded-full ${
            activeTab === item ? "bg-white" : "bg-neutral-800"
          }`}
          style={{
            borderWidth: 1,
            borderColor: Colors.borderColor,
          }}
        >
          <Text
            className={`font-semibold ${
              activeTab === item ? "text-black" : "text-gray-300"
            }`}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
