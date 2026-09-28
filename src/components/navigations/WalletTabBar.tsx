import { useEffect } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import {
  ArrowLeftRight,
  Ellipsis,
  House,
  WalletCards,
} from "lucide-react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColorScheme } from "nativewind";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ICON_SIZE = 21;

const TAB_CONFIG = {
  index: {
    label: "Home",
    icon: House,
  },

  accounts: {
    label: "Accounts",
    icon: WalletCards,
  },

  transactions: {
    label: "Transactions",
    icon: ArrowLeftRight,
  },

  more: {
    label: "More",
    icon: Ellipsis,
  },
} as const;

function WalletTabItem({
  route,
  index,
  focused,
  onPress,
  onLongPress,
  isDark,
}: {
  route: any;
  index: number;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  isDark: boolean;
}) {
  const config = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG];

  const Icon = config?.icon;

  const progress = useSharedValue(focused ? 1 : 0);
  const activeColor = isDark ? "#34D399" : "#10644D";

  const inactiveColor = isDark ? "#64748B" : "#94A3B8";
  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, {
      damping: 16,
      stiffness: 180,
      mass: 0.7,
    });
  }, [focused]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      flexGrow: interpolate(progress.value, [0, 1], [1, 1.55]),
    };
  });

  const iconContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [0.92, 1]),
        },
      ],
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(focused ? 1 : 0, {
        duration: 160,
      }),

      maxWidth: withTiming(focused ? 90 : 0, {
        duration: 180,
      }),

      marginLeft: withTiming(focused ? 7 : 0, {
        duration: 180,
      }),
    };
  });

  if (!config || !Icon) {
    return null;
  }

  return (
    <AnimatedPressable
      accessibilityRole="tab"
      accessibilityState={{
        selected: focused,
      }}
      accessibilityLabel={config.label}
      onPress={onPress}
      onLongPress={onLongPress}
      className="h-12 flex-row items-center justify-center overflow-hidden rounded-2xl px-3"
      style={[
        containerStyle,
        {
          backgroundColor: focused ? "rgba(16, 100, 77, 0.13)" : "transparent",
        },
      ]}
    >
      <Animated.View
        style={iconContainerStyle}
        className="h-9 w-9 items-center justify-center rounded-xl"
      >
        <Icon
          size={ICON_SIZE}
          color={focused ? activeColor : inactiveColor}
          strokeWidth={focused ? 2.5 : 2}
        />
      </Animated.View>

      <Animated.Text
        numberOfLines={1}
        style={[
          labelStyle,
          {
            color: activeColor,
            fontSize: 12,
            fontWeight: "700",
          },
        ]}
      >
        {config.label}
      </Animated.Text>
    </AnimatedPressable>
  );
}

export default function WalletTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  const visibleRoutes = state.routes.filter(
    (route: any) => descriptors[route.key]?.options?.href !== null,
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    // Intentionally kept here so the
    // container can react to measured
    // dimensions later if needed.
    const { width } = event.nativeEvent.layout;

    console.log("Wallet tab width:", width);
  };

  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-0 left-0 right-0 items-center"
      style={{
        paddingBottom: Math.max(insets.bottom, 8),
        paddingHorizontal: 12,
      }}
    >
      <View
        onLayout={handleLayout}
        className="
          w-full
          max-w-[520px]
          flex-row
          items-center
          rounded-[28px]
          px-2
          py-2
        "
        style={{
          backgroundColor: isDark
            ? "rgba(15, 23, 42, 0.96)"
            : "rgba(255, 255, 255, 0.96)",

          borderWidth: 1,

          borderColor: isDark
            ? "rgba(255,255,255,0.07)"
            : "rgba(15,23,42,0.06)",

          shadowColor: "#000",

          shadowOffset: {
            width: 0,
            height: 8,
          },

          shadowOpacity: isDark ? 0.35 : 0.1,

          shadowRadius: 24,

          elevation: 16,
        }}
      >
        {visibleRoutes.map((route: any, index: any) => {
          const descriptor = descriptors[route.key];

          const options = descriptor.options;

          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <WalletTabItem
              key={route.key}
              route={route}
              index={index}
              focused={focused}
              onPress={onPress}
              isDark={isDark}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}
