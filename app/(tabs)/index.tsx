import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import EmptyView from "@/components/EmptyView";
import HabitTabs from "@/components/HabitTabs";
import HomeHeader from "@/components/HomeHeader";
import MonthlyView from "@/components/MonthlyView";
import OverallView from "@/components/OverallView";
import TodayView from "@/components/TodayView";
import WeeklyView from "@/components/WeeklyView";

import PaywallModal from "@/components/PaywallModal";
import StreakCelebration from "@/components/StreakCelebration";
import { revenueCat } from "@/services/revenueCat";
import { oneSignal } from "@/services/oneSignal";
import { useHabits } from "@/hooks/useHabits";

const FILTERS = ["Today", "Weekly", "Monthly", "Overall"] as const;
type FilterType = (typeof FILTERS)[number];

export default function HabitsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterType>("Today");

  // Modal visibility and user state
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(1);

  const { habits } = useHabits();

  // 1. Check user's Pro subscription status via RevenueCat
  const checkUserPro = useCallback(async () => {
    const status = await revenueCat.checkProStatus();
    setIsPro(status.isPro);
  }, []);

  useEffect(() => {
    checkUserPro();
  }, [checkUserPro]);

  // 2. Sync habit tags with OneSignal for notification targeting
  useEffect(() => {
    if (habits) {
      oneSignal.syncUserHabitTags({
        is_pro: isPro,
        total_habits: habits.length,
        streak_count: streakCount,
        has_pending_habits: habits.length > 0,
      });
    }
  }, [habits, isPro, streakCount]);

  // 3. Handle habit creation with 3-habit limit validation for Free users
  const handleAddNewHabit = () => {
    const FREE_LIMIT = 3;
    if (!isPro && habits && habits.length >= FREE_LIMIT) {
      setShowPaywall(true);
      return;
    }
    router.push("/newHabit");
  };

  // 4. Trigger celebration when 100% of today's habits are completed
  const handleAllCompleted = (newStreak: number) => {
    setStreakCount(newStreak);
    setShowCelebration(true);
  };

  const renderContent = useMemo(() => {
    if (!habits || habits.length === 0) return null;

    switch (activeTab) {
      case "Today":
        return (
          <TodayView
            habits={habits}
            onAllCompleted={handleAllCompleted}
          />
        );
      case "Weekly":
        return <WeeklyView />;
      case "Monthly":
        return <MonthlyView />;
      case "Overall":
        return (
          <OverallView
            onOpenPaywall={() => setShowPaywall(true)}
          />
        );
      default:
        return null;
    }
  }, [activeTab, habits]);

  const isEmpty = !habits || habits.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <View className="flex-1 px-5 pt-4">
        {/* Header with Pro badge & Add action */}
        <HomeHeader
          isPro={isPro}
          onAddPress={handleAddNewHabit}
          onProPress={() => setShowPaywall(true)}
        />

        {/* Filter Tabs Component */}
        <HabitTabs
          filters={FILTERS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Main Content / Empty State */}
        {isEmpty ? (
          <EmptyView onAddPress={handleAddNewHabit} />
        ) : (
          renderContent
        )}
      </View>

      {/* Paywall Modal */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSuccess={() => {
          setIsPro(true);
          router.push("/newHabit");
        }}
      />

      {/* Streak Celebration Modal (Confetti + Haptics) */}
      <StreakCelebration
        visible={showCelebration}
        streakCount={streakCount}
        onClose={() => setShowCelebration(false)}
      />
    </SafeAreaView>
  );
}