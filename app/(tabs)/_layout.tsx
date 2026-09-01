import Colors from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.darkGray,
          height: 50,
          borderWidth: 0.5,
          borderColor: Colors.white,
          position: "absolute",
          bottom: 20 + insets.bottom,
          marginHorizontal: 70,
          borderRadius: 40,
          paddingTop: 5,
        },

        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home-outline"
              size={26}
              color={focused ? Colors.white : Colors.mediumGray}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="bar-chart-outline"
              size={24}
              color={focused ? Colors.white : Colors.mediumGray}
            />
          ),
        }}
      />
    </Tabs>
  );
}
