// app/_layout.tsx
import "@/global.css";
import { useAuthStore } from "@/services/authStorage";
import { migrateDbIfNeeded } from "@/services/db";
import { oneSignal } from "@/services/oneSignal";
import { revenueCat } from "@/services/revenueCat";
import Colors from "@/utils/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Custom Navigation Light Theme
const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.lightGray,
    card: Colors.white,
    text: Colors.black,
    border: Colors.borderColor,
  },
};

export default function RootLayout() {
  const { hasCompletedOnboarding, _hasHydrated } = useAuthStore();

  useEffect(() => {
    oneSignal.init();
    oneSignal.requestPermission();
    revenueCat.init();
  }, []);

  useEffect(() => {
    if (_hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [_hasHydrated]);

  if (!_hasHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.lightGray }}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.lightGray} />
      <ThemeProvider value={MyLightTheme}>
        <SQLiteProvider
          databaseName="habitTrackerApp4.db"
          onInit={migrateDbIfNeeded}
          options={{ useNewConnection: false }}
        >
          <QueryClientProvider client={queryClient}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.lightGray },
              }}
            >
              <Stack.Protected guard={!hasCompletedOnboarding}>
                <Stack.Screen
                  name="(onboarding)"
                  options={{ headerShown: false }}
                />
              </Stack.Protected>

              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="newHabit"
                options={{
                  headerShown: false,
                  presentation: "transparentModal",
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen name="icon" />
              <Stack.Screen
                name="more"
                options={{
                  headerShown: false,
                  presentation: "transparentModal",
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="reorder"
                options={{
                  headerShown: false,
                  presentation: "transparentModal",
                  animation: "slide_from_bottom",
                }}
              />
            </Stack>
          </QueryClientProvider>
        </SQLiteProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}