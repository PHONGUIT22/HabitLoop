import "@/global.css";
import { useAuthStore } from "@/services/authStorage";
import { migrateDbIfNeeded } from "@/services/db";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { hasCompletedOnboarding, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [_hasHydrated]);

  if (!_hasHydrated) {
    return null;
  }

  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#171717" }}>
      <StatusBar hidden={true} />
      {/* <StatusBar className="bg-neutral-900" /> */}
      <SQLiteProvider
        databaseName="habitTrackerApp4.db"
        onInit={migrateDbIfNeeded}
        options={{ useNewConnection: false }}
      >
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#171717" },
              //animation: "none",
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
    </GestureHandlerRootView>
  );
}
