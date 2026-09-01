import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesPackage,
} from "react-native-purchases";

// Check if app is running inside Expo Go client
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Replace with your real RevenueCat API keys when creating a development build
const API_KEYS = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY || "appl_mock_key",
  google: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY || "goog_mock_key",
};

export const ENTITLEMENT_ID = "pro";

// Mock packages displayed during Expo Go development
const MOCK_PACKAGES: any[] = [
  {
    identifier: "monthly_pro",
    packageType: "MONTHLY",
    product: {
      identifier: "habit_pro_monthly",
      title: "Gói Tháng (Monthly)",
      description: "Thanh toán tự động hàng tháng",
      priceString: "49.000đ / tháng",
      price: 49000,
    },
  },
  {
    identifier: "yearly_pro",
    packageType: "ANNUAL",
    product: {
      identifier: "habit_pro_yearly",
      title: "Gói Năm (Yearly - Tiết kiệm 40%)",
      description: "Thanh toán 1 lần mỗi năm",
      priceString: "349.000đ / năm",
      price: 349000,
    },
  },
  {
    identifier: "lifetime_pro",
    packageType: "LIFETIME",
    product: {
      identifier: "habit_pro_lifetime",
      title: "Gói Trọn Đời (Lifetime)",
      description: "Sở hữu vĩnh viễn không giới hạn",
      priceString: "599.000đ",
      price: 599000,
    },
  },
];

class RevenueCatService {
  private static instance: RevenueCatService;
  private isConfigured = false;
  private mockProStatus = false; // Local state for testing Pro purchases in Expo Go

  private constructor() {}

  public static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  /**
   * Initialize RevenueCat SDK safely
   */
  public async init(userId?: string): Promise<void> {
    if (this.isConfigured) return;

    if (isExpoGo) {
      console.log(
        "[RevenueCat] Running inside Expo Go - Purchases SDK is running in Mock Mode."
      );
      this.isConfigured = true;
      return;
    }

    try {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      const apiKey = Platform.OS === "ios" ? API_KEYS.apple : API_KEYS.google;

      if (!apiKey || apiKey.includes("mock_key")) {
        console.warn("[RevenueCat] Valid API Key not found. Falling back to mock.");
        return;
      }

      await Purchases.configure({ apiKey, appUserID: userId });
      this.isConfigured = true;
      console.log("[RevenueCat] Initialized successfully");
    } catch (error) {
      console.warn("[RevenueCat] Failed to configure Purchases:", error);
    }
  }

  /**
   * Check if the user has an active Pro subscription
   */
  public async checkProStatus(): Promise<{
    isPro: boolean;
    activeEntitlement?: string;
    expirationDate?: string | null;
  }> {
    if (isExpoGo || !this.isConfigured) {
      return { isPro: this.mockProStatus };
    }

    try {
      const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

      return {
        isPro: !!entitlement && entitlement.isActive,
        activeEntitlement: entitlement?.identifier,
        expirationDate: entitlement?.expirationDate,
      };
    } catch (error) {
      console.error("[RevenueCat] Error checking Pro status:", error);
      return { isPro: this.mockProStatus };
    }
  }

  /**
   * Get available packages / offerings
   */
  public async getOfferings(): Promise<PurchasesPackage[]> {
    if (isExpoGo || !this.isConfigured) {
      // Return mock packages in Expo Go so Paywall UI displays properly
      return MOCK_PACKAGES as PurchasesPackage[];
    }

    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current && offerings.current.availablePackages.length > 0) {
        return offerings.current.availablePackages;
      }
      return MOCK_PACKAGES as PurchasesPackage[];
    } catch (error) {
      console.warn("[RevenueCat] Error fetching offerings, returning fallback:", error);
      return MOCK_PACKAGES as PurchasesPackage[];
    }
  }

  /**
   * Purchase a subscription package
   */
  public async makePurchase(
    pkg: PurchasesPackage
  ): Promise<{ success: boolean; isPro: boolean; customerInfo?: CustomerInfo }> {
    if (isExpoGo || !this.isConfigured) {
      // Simulate successful purchase in Expo Go
      this.mockProStatus = true;
      console.log("[RevenueCat Mock] Purchased package:", pkg.identifier);
      return { success: true, isPro: true };
    }

    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const isPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID]?.isActive;
      return { success: true, isPro, customerInfo };
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error("[RevenueCat] Purchase Error:", error);
      }
      return { success: false, isPro: false };
    }
  }

  /**
   * Restore previous purchases
   */
  public async restorePurchases(): Promise<{
    success: boolean;
    isPro: boolean;
    customerInfo?: CustomerInfo;
  }> {
    if (isExpoGo || !this.isConfigured) {
      this.mockProStatus = true;
      return { success: true, isPro: true };
    }

    try {
      const customerInfo = await Purchases.restorePurchases();
      const isPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID]?.isActive;
      return { success: true, isPro, customerInfo };
    } catch (error) {
      console.error("[RevenueCat] Restore Error:", error);
      return { success: false, isPro: false };
    }
  }
}

export const revenueCat = RevenueCatService.getInstance();