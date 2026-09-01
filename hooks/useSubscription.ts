import { create } from "zustand";
import { revenueCat } from "@/services/revenueCat";
import { oneSignal } from "@/services/oneSignal";
import {
  FREE_HABIT_LIMIT,
  SubscriptionState,
  UNLIMITED_HABITS,
} from "@/types/subscription";

// Global Zustand Store for Subscription & Paywall Modal state
interface SubscriptionStore {
  isProMember: boolean;
  isLoading: boolean;
  isPaywallVisible: boolean;
  setIsProMember: (isPro: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  openPaywall: () => void;
  closePaywall: () => void;
}

const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  isProMember: false,
  isLoading: true,
  isPaywallVisible: false,

  setIsProMember: (isPro) => set({ isProMember: isPro }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  openPaywall: () => set({ isPaywallVisible: true }),
  closePaywall: () => set({ isPaywallVisible: false }),
}));

/**
 * Custom hook to manage user's Pro membership, habit creation limits,
 * and trigger the Paywall popup from anywhere in the app.
 */
export function useSubscription(): SubscriptionState {
  const {
    isProMember,
    isLoading,
    isPaywallVisible,
    setIsProMember,
    setIsLoading,
    openPaywall,
    closePaywall,
  } = useSubscriptionStore();

  /**
   * Check and synchronize Pro status with RevenueCat & OneSignal
   */
  const checkSubscription = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { isPro } = await revenueCat.checkProStatus();
      setIsProMember(isPro);

      // Sync latest Pro tag with OneSignal
      oneSignal.syncUserHabitTags({ is_pro: isPro });
      return isPro;
    } catch (error) {
      console.error("[useSubscription] Error checking status:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Validate if the user is allowed to create another habit
   * @param currentHabitCount Current number of active habits
   * @returns true if allowed, false if limit reached
   */
  const canCreateHabit = (currentHabitCount: number): boolean => {
    if (isProMember) return true;
    return currentHabitCount < FREE_LIMIT_HABITS();
  };

  const FREE_LIMIT_HABITS = () => FREE_HABIT_LIMIT;

  return {
    isProMember,
    isLoading,
    isPaywallVisible,
    maxHabitsAllowed: isProMember ? UNLIMITED_HABITS : FREE_HABIT_LIMIT,
    openPaywall,
    closePaywall,
    checkSubscription,
    canCreateHabit,
  };
}