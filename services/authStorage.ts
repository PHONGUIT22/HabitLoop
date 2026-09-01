import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserState = {
  hasCompletedOnboarding: boolean;
  _hasHydrated: boolean;
  completedOnboarding: () => void;
  resetOnboarding: () => void;
  setHasHydrated: (value: boolean) => void;
};

// Safe storage engine for both Web (localStorage) and Native (SecureStore)
const getStorageEngine = () => {
  if (Platform.OS === "web") {
    return {
      getItem: async (key: string) => {
        if (typeof window !== "undefined") {
          return localStorage.getItem(key);
        }
        return null;
      },
      setItem: async (key: string, value: string) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(key, value);
        }
      },
      removeItem: async (key: string) => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(key);
        }
      },
    };
  }

  return {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) =>
      SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
  };
};

export const useAuthStore = create(
  persist<UserState>(
    (set) => ({
      hasCompletedOnboarding: false,
      _hasHydrated: false,

      completedOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
      setHasHydrated: (value: boolean) => set({ _hasHydrated: value }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => getStorageEngine()),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.warn("[AuthStore] Hydration error:", error);
          }
          state?.setHasHydrated(true);
        };
      },
    }
  )
);