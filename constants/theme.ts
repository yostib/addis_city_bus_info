/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

// Enhanced Addis Bus App Theme
export const AppColors = {
  // Primary Brand Colors (Green & Red Theme)
  primary: "#1E8449", // Deep Forest Green
  secondary: "#C0392B", // Deep Red
  accent: "#F1C40F", // Golden Yellow
  purple: "#5B2C6F", // Deep Purple

  // Modern Color Palette
  emerald: "#10B981", // Modern Green
  crimson: "#DC2626", // Modern Red
  amber: "#F59E0B", // Warm Amber
  indigo: "#6366F1", // Modern Indigo
  slate: "#64748B", // Modern Gray

  // Background Colors
  background: "#FFFBEA", // Warm Cream
  surface: "#FFFFFF", // Pure White
  surfaceSecondary: "#F8FAFC", // Light Gray

  // Text Colors
  textPrimary: "#1E293B", // Dark Slate
  textSecondary: "#64748B", // Medium Gray
  textLight: "#94A3B8", // Light Gray

  // Status Colors
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",

  // Gradients
  gradients: {
    primary: ["#1E8449", "#2ECC71"],
    secondary: ["#C0392B", "#E74C3C"],
    accent: ["#F1C40F", "#F39C12"],
    background: ["#FFFBEA", "#FEF7CD"],
  },

  // Shadows
  shadows: {
    light: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    heavy: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 10,
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
