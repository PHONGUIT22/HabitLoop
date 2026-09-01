import React from "react";
import { View, useWindowDimensions } from "react-native";

// Breakpoint for foldable devices (Galaxy Z Fold unfolded / Tablets)
export const FOLDABLE_BREAKPOINT = 600;

interface FoldableContainerProps {
  children?: React.ReactNode;
  /** Content displayed on the left pane (or full screen on phones) */
  leftPane?: React.ReactNode;
  /** Content displayed on the right pane (only on wide screens >= 600px) */
  rightPane?: React.ReactNode;
  /** Width ratio for the left pane (e.g. 0.45 = 45% width). Default is 0.5 (50/50) */
  leftPaneRatio?: number;
  className?: string;
}

/**
 * Custom hook to detect if the device is currently in wide/dual-pane mode
 */
export function useIsDualPane(): boolean {
  const { width } = useWindowDimensions();
  return width >= FOLDABLE_BREAKPOINT;
}

export default function FoldableContainer({
  children,
  leftPane,
  rightPane,
  leftPaneRatio = 0.5,
  className = "",
}: FoldableContainerProps) {
  const { width } = useWindowDimensions();
  const isDualPane = width >= FOLDABLE_BREAKPOINT;

  // 1. Dual-Pane Layout (Galaxy Z Fold unfolded / Galaxy Tab)
  if (isDualPane && (leftPane || rightPane)) {
    const rightPaneRatio = 1 - leftPaneRatio;

    return (
      <View className={`flex-1 flex-row bg-neutral-900 ${className}`}>
        {/* Left Pane (e.g., Habit List / Today View) */}
        <View
          style={{ flex: leftPaneRatio }}
          className="h-full border-r border-neutral-800 pr-4"
        >
          {leftPane}
        </View>

        {/* Right Pane (e.g., Overall Heatmap / Detailed Analytics) */}
        <View style={{ flex: rightPaneRatio }} className="h-full pl-4">
          {rightPane}
        </View>
      </View>
    );
  }

  // 2. Single-Column Layout (Standard phones / Galaxy Z Fold folded)
  return (
    <View className={`flex-1 bg-neutral-900 ${className}`}>
      {leftPane || children}
    </View>
  );
}