
import { Habit } from "@/types/dbTypes";
import { useState } from "react";

export function useHabitActions() {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [confirmSheet, setConfirmSheet] = useState<{
    visible: boolean;
    type: "archive" | "delete" | null;
  }>({ visible: false, type: null });

  const openActions = (habit: Habit) => {
    setSelectedHabit(habit);
    setActionSheetOpen(true);
  };

  const closeActions = () => {
    setActionSheetOpen(false);
  };

  const showConfirm = (type: "archive" | "delete") => {
    closeActions();
    setConfirmSheet({ visible: true, type });
  };

  const closeConfirm = () => {
    setConfirmSheet({ visible: false, type: null });
  };

  const handleConfirm = (
    onArchive?: (habit: Habit) => void,
    onDelete?: (habit: Habit) => void
  ) => {
    if (!selectedHabit) return;

    if (confirmSheet.type === "archive") {
      onArchive?.(selectedHabit);
    } else if (confirmSheet.type === "delete") {
      onDelete?.(selectedHabit);
    }

    closeConfirm();
  };

  return {
    selectedHabit,
    actionSheetOpen,
    confirmSheet,
    openActions,
    closeActions,
    showConfirm,
    closeConfirm,
    handleConfirm,
  };
}
