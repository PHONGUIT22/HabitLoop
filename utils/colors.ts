// utils/colors.ts
const Colors = {
  // Base neutral palette (Slate)
  black: "#0F172A", // Primary text (Slate 900 - high contrast, soft on eyes)
  darkGray: "#334155", // Secondary text, subtitles (Slate 700)
  mediumGray: "#94A3B8", // Placeholder text, inactive icons (Slate 400)
  lightGray: "#F1F5F9", // Overall application background (Slate 100)
  white: "#FFFFFF", // Card / Modal surface background

  // Component-specific tokens
  habitCardBackground: "#FFFFFF", // Habit card surface
  habitIconBackground: "#F8FAFC", // Habit icon circle background (Slate 50)
  checkBoxBackground: "#E2E8F0", // Checkbox background when uncompleted (Slate 200)
  cellColor: "#E2E8F0", // Heatmap cell background when uncompleted
  disabledCellColor: "#F8FAFC", // Future heatmap cells
  checkMarkColor: "#10B981", // Active checkmark & streak color (Emerald Green)
  borderColor: "#E2E8F0", // Subtle card/container border
} as const;

export default Colors;