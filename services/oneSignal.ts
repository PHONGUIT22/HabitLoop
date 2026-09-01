import Constants, { ExecutionEnvironment } from "expo-constants";

// Check if the app is currently running inside the Expo Go client
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Safe import for OneSignal native module
let OneSignalModule: any = null;
let LogLevelEnum: any = {};

if (!isExpoGo) {
  try {
    const oneSignalPkg = require("react-native-onesignal");
    OneSignalModule = oneSignalPkg.OneSignal;
    LogLevelEnum = oneSignalPkg.LogLevel;
  } catch (error) {
    console.warn("[OneSignal] Native module could not be loaded.");
  }
}

const ONESIGNAL_APP_ID =
  process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID || "your-onesignal-app-id";

export type HabitUserTags = {
  streak_count?: number;
  has_pending_habits?: boolean;
  is_pro?: boolean;
  total_habits?: number;
  last_completed_date?: string;
};

class OneSignalService {
  private static instance: OneSignalService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): OneSignalService {
    if (!OneSignalService.instance) {
      OneSignalService.instance = new OneSignalService();
    }
    return OneSignalService.instance;
  }

  /**
   * Initialize OneSignal SDK (Mocked automatically in Expo Go)
   */
  public init(): void {
    if (this.isInitialized) return;

    if (isExpoGo || !OneSignalModule) {
      console.log(
        "[OneSignal] Running inside Expo Go - Native push features are mocked."
      );
      this.isInitialized = true;
      return;
    }

    if (__DEV__ && LogLevelEnum?.Verbose) {
      OneSignalModule.Debug.setLogLevel(LogLevelEnum.Verbose);
    }

    if (ONESIGNAL_APP_ID) {
      OneSignalModule.initialize(ONESIGNAL_APP_ID);
      this.isInitialized = true;
      console.log("[OneSignal] Initialized successfully");
    }
  }

  /**
   * Request push notification permissions
   */
  public async requestPermission(): Promise<boolean> {
    if (isExpoGo || !OneSignalModule) {
      return true;
    }

    try {
      const granted = await OneSignalModule.Notifications.requestPermission(true);
      return granted;
    } catch (error) {
      console.error("[OneSignal] Error requesting permission:", error);
      return false;
    }
  }

  /**
   * Associate user ID with OneSignal
   */
  public login(userId: string): void {
    if (isExpoGo || !OneSignalModule) return;
    OneSignalModule.login(userId);
  }

  /**
   * Log out user from OneSignal
   */
  public logout(): void {
    if (isExpoGo || !OneSignalModule) return;
    OneSignalModule.logout();
  }

  /**
   * Sync habit & streak tags with OneSignal
   */
  public async syncUserHabitTags(tags: HabitUserTags): Promise<void> {
    if (isExpoGo || !OneSignalModule) {
      console.log("[OneSignal Mock] Tags updated:", tags);
      return;
    }

    try {
      const formattedTags: Record<string, string> = {};

      if (tags.streak_count !== undefined) {
        formattedTags.streak_count = tags.streak_count.toString();
      }
      if (tags.has_pending_habits !== undefined) {
        formattedTags.has_pending_habits = tags.has_pending_habits
          ? "true"
          : "false";
      }
      if (tags.is_pro !== undefined) {
        formattedTags.is_pro = tags.is_pro ? "true" : "false";
      }
      if (tags.total_habits !== undefined) {
        formattedTags.total_habits = tags.total_habits.toString();
      }
      if (tags.last_completed_date) {
        formattedTags.last_completed_date = tags.last_completed_date;
      }

      OneSignalModule.User.addTags(formattedTags);
    } catch (error) {
      console.error("[OneSignal] Error updating tags:", error);
    }
  }
}

export const oneSignal = OneSignalService.getInstance();