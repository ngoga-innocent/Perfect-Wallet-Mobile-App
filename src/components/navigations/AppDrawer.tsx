import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight, X } from "lucide-react-native";

import AppView from "@/components/ui/Views/AppView";
import Text from "@/components/ui/Text/Text";
import { useAppDrawer } from "./AppDrawerContext";
import type { AppDrawerItem } from "./types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.84, 360);

const PRIMARY = "#10644D";
const MUTED = "#64748B";
const DANGER = "#DC2626";

interface AppDrawerProps {
  title?: string;
  subtitle?: string;

  /**
   * Menu items displayed in the drawer.
   */
  items?: AppDrawerItem[];

  /**
   * Optional custom content displayed above menu items.
   */
  header?: React.ReactNode;

  /**
   * Optional custom content displayed below menu items.
   */
  footer?: React.ReactNode;

  /**
   * Whether pressing an item should close the drawer first.
   */
  closeOnItemPress?: boolean;
}

export default function AppDrawer({
  title = "Perfect Wallet",
  subtitle = "Personal finance",
  items = [],
  header,
  footer,
  closeOnItemPress = true,
}: AppDrawerProps) {
  const { isOpen, closeDrawer } = useAppDrawer();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 24,
          stiffness: 180,
          mass: 0.8,
        }),

        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),

        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, slideAnim, backdropAnim]);

  const handleItemPress = (item: AppDrawerItem) => {
    if (item.disabled) {
      return;
    }

    if (closeOnItemPress) {
      closeDrawer();
    }

    // Wait until the drawer begins closing before
    // executing navigation/modal actions.
    requestAnimationFrame(() => {
      item.onPress?.();
    });
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeDrawer}
    >
      <View className="flex-1">
        {/* BACKDROP */}

        <Animated.View
          className="absolute inset-0"
          style={{
            opacity: backdropAnim,
          }}
        >
          <Pressable onPress={closeDrawer} className="flex-1 bg-black/50" />
        </Animated.View>

        {/* DRAWER */}

        <Animated.View
          className="absolute bottom-0 left-0 top-0 overflow-hidden bg-background dark:bg-background-dark"
          style={{
            width: DRAWER_WIDTH,
            transform: [
              {
                translateX: slideAnim,
              },
            ],
            shadowColor: "#000",
            shadowOffset: {
              width: 5,
              height: 0,
            },
            shadowOpacity: 0.18,
            shadowRadius: 20,
            elevation: 24,
          }}
        >
          <SafeAreaView edges={["top", "bottom"]} className="flex-1">
            {/* HEADER */}

            {header ?? (
              <AppView className="border-b border-gray-100 px-5 pb-5 pt-4 dark:border-gray-800">
                <AppView className="flex-row items-center justify-between">
                  <AppView className="flex-1">
                    <Text className="text-2xl font-extrabold tracking-tight text-text dark:text-text-dark">
                      Perfect<Text className="text-primary">Wallet</Text>
                    </Text>

                    {subtitle ? (
                      <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {subtitle}
                      </Text>
                    ) : null}
                  </AppView>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={closeDrawer}
                    className="ml-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    <X size={20} color={PRIMARY} strokeWidth={2.3} />
                  </TouchableOpacity>
                </AppView>
              </AppView>
            )}

            {/* MENU */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
            >
              {title && header ? (
                <Text className="mb-3 px-1 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  {title}
                </Text>
              ) : null}

              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <React.Fragment key={item.id}>
                    {/* DIVIDER */}

                    {item.dividerBefore ? (
                      <View className="my-3 h-px bg-gray-100 dark:bg-gray-800" />
                    ) : null}

                    {/* ITEM */}

                    <TouchableOpacity
                      activeOpacity={0.7}
                      disabled={item.disabled}
                      onPress={() => handleItemPress(item)}
                      className={`mb-1 flex-row items-center rounded-2xl px-3 py-3.5 ${
                        item.disabled
                          ? "opacity-40"
                          : item.destructive
                            ? "active:bg-red-50 dark:active:bg-red-950"
                            : "active:bg-primary/5"
                      }`}
                    >
                      {/* ICON */}

                      {Icon ? (
                        <View
                          className={`mr-3 h-10 w-10 items-center justify-center rounded-xl ${
                            item.destructive
                              ? "bg-red-50 dark:bg-red-950"
                              : "bg-primary/10"
                          }`}
                        >
                          <Icon
                            size={20}
                            color={item.destructive ? DANGER : PRIMARY}
                            strokeWidth={2}
                          />
                        </View>
                      ) : null}

                      {/* LABEL + DESCRIPTION */}

                      <View className="min-w-0 flex-1">
                        <Text
                          numberOfLines={1}
                          className={`font-semibold ${
                            item.destructive
                              ? "text-red-600"
                              : "text-text dark:text-text-dark"
                          }`}
                        >
                          {item.label}
                        </Text>

                        {item.description ? (
                          <Text
                            numberOfLines={2}
                            className="mt-0.5 text-xs text-gray-500 dark:text-gray-400"
                          >
                            {item.description}
                          </Text>
                        ) : null}
                      </View>

                      {/* BADGE */}

                      {item.badge !== undefined ? (
                        <View className="mr-2 min-w-[24px] items-center rounded-full bg-primary/10 px-2 py-1">
                          <Text className="text-xs font-bold text-primary">
                            {item.badge}
                          </Text>
                        </View>
                      ) : null}

                      {/* CHEVRON */}

                      {item.showChevron ? (
                        <ChevronRight size={18} color={MUTED} strokeWidth={2} />
                      ) : null}
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </ScrollView>

            {/* FOOTER */}

            {footer ? (
              <AppView className="border-t border-gray-100 px-5 pt-4 dark:border-gray-800">
                {footer}
              </AppView>
            ) : null}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}
