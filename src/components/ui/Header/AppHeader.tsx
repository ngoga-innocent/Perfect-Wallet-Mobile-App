import React from "react";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Menu, ChevronLeft, UserCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { LucideIcon } from "lucide-react-native";

import AppView from "@/components/ui/Views/AppView";
import Text from "@/components/ui/Text/Text";
import { useAppDrawer } from "@/components/navigations/AppDrawerContext";

const PRIMARY = "#10644D";

interface AppHeaderProps {
  title?: string;

  showBack?: boolean;
  showProfile?: boolean;
  showMenu?: boolean;

  /**
   * Custom icon displayed on the right side.
   * When provided, it replaces the profile icon.
   */
  rightIcon?: LucideIcon;

  /**
   * Overrides the default drawer opening behavior.
   */
  onMenuPress?: () => void;

  /**
   * Overrides the default profile navigation.
   */
  onProfilePress?: () => void;

  /**
   * Overrides the default router.back().
   */
  onBackPress?: () => void;

  /**
   * Called when the custom right icon is pressed.
   */
  onRightPress?: () => void;

  /**
   * Accessibility label for the custom right action.
   */
  rightIconLabel?: string;
}

export default function AppHeader({
  title,
  showBack = false,
  showProfile = true,
  showMenu = true,
  rightIcon,
  onMenuPress,
  onProfilePress,
  onBackPress,
  onRightPress,
  rightIconLabel = "Open action",
}: AppHeaderProps) {
  const { openDrawer } = useAppDrawer();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.back();
  };

  const handleMenu = () => {
    if (onMenuPress) {
      onMenuPress();
      return;
    }

    openDrawer();
  };

  const handleProfile = () => {
    if (onProfilePress) {
      onProfilePress();
      return;
    }

    router.push("/(profile)");
  };

  return (
    <SafeAreaView
      edges={["top"]}
      className="bg-background dark:bg-background-dark"
    >
      <AppView className="border-b border-gray-100 bg-background px-5 pb-3 pt-2 dark:border-gray-800 dark:bg-background-dark">
        <AppView className="flex-row items-center justify-between">
          {/* LEFT ACTION */}
          {showBack ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleBack}
              className="h-11 w-11 items-center justify-center rounded-full"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ChevronLeft size={25} color={PRIMARY} strokeWidth={2.2} />
            </TouchableOpacity>
          ) : showMenu ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleMenu}
              className="h-11 w-11 items-center justify-center rounded-full"
              accessibilityRole="button"
              accessibilityLabel="Open menu"
            >
              <Menu size={24} color={PRIMARY} strokeWidth={2.2} />
            </TouchableOpacity>
          ) : (
            <AppView className="h-11 w-11" />
          )}

          {/* TITLE / BRAND */}
          <AppView className="flex-1 px-3">
            {title ? (
              <Text
                numberOfLines={1}
                className="text-lg font-bold text-text dark:text-text-dark"
              >
                {title}
              </Text>
            ) : (
              <Text className="text-xl font-extrabold tracking-tight text-text dark:text-text-dark">
                Wallet
                <Text className="text-primary">Flow</Text>
              </Text>
            )}
          </AppView>

          {/* RIGHT ACTION */}
          {rightIcon ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onRightPress}
              className="h-11 w-11 items-center justify-center rounded-full bg-primary/10"
              accessibilityRole="button"
              accessibilityLabel={rightIconLabel}
            >
              {React.createElement(rightIcon, {
                size: 25,
                color: PRIMARY,
                strokeWidth: 2,
              })}
            </TouchableOpacity>
          ) : showProfile ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleProfile}
              className="h-11 w-11 items-center justify-center rounded-full bg-primary/10"
              accessibilityRole="button"
              accessibilityLabel="Open profile"
            >
              <UserCircle size={25} color={PRIMARY} strokeWidth={2} />
            </TouchableOpacity>
          ) : (
            <AppView className="h-11 w-11" />
          )}
        </AppView>
      </AppView>
    </SafeAreaView>
  );
}
