import { CustomerInfo, PurchasesPackage } from "react-native-purchases";

export type SubscriptionPlanType = "monthly" | "yearly" | "lifetime" | "free";

export interface UserProStatus {
  isPro: boolean;
  activeEntitlement?: string;
  expirationDate?: string | null;
  planType?: SubscriptionPlanType;
}

export interface PurchaseResult {
  success: boolean;
  isPro: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}

export interface SubscriptionState {
  isProMember: boolean;
  isLoading: boolean;
  isPaywallVisible: boolean;
  maxHabitsAllowed: number;
  openPaywall: () => void;
  closePaywall: () => void;
  checkSubscription: () => Promise<boolean>;
  canCreateHabit: (currentHabitCount: number) => boolean;
}

export const FREE_HABIT_LIMIT = 3;
export const UNLIMITED_HABITS = Infinity;