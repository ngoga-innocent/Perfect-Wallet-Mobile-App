import { useEffect } from "react";

import { Pressable, Text, View } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import Animated, {
  SlideInDown,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react-native";

import { AlertType } from "./types";

interface Props {
  type: AlertType;

  title: string;

  message?: string;

  onClose: () => void;
}

const config = {
  success: {
    icon: CheckCircle,
    containerClass: "bg-green-100 dark:bg-green-900/30",
    iconColor: "#10B981",
  },

  error: {
    icon: XCircle,
    containerClass: "bg-red-100 dark:bg-red-900",
    iconColor: "#EF4444",
  },

  warning: {
    icon: AlertTriangle,
    containerClass: "bg-yellow-100 dark:bg-yellow-900",
    iconColor: "#F5C542",
  },

  info: {
    icon: Info,
    containerClass: "bg-blue-100 dark:bg-blue-900",
    iconColor: "#3B82F6",
  },
};

export default function AppAlert({ type, title, message, onClose }: Props) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(onClose, 10000);

    return () => clearTimeout(timer);
  }, []);

  const panGesture = Gesture.Pan()

    .onUpdate((event) => {
      translateX.value = event.translationX;
    })

    .onEnd((event) => {
      if (Math.abs(event.translationX) > 100) {
        translateX.value = withTiming(event.translationX > 0 ? 500 : -500, {
          duration: 200,
        });

        onClose();
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
    zIndex: 9999999,
  }));

  const Icon = config[type].icon;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        entering={SlideInDown.duration(250)}
        exiting={SlideOutUp.duration(200)}
        style={animatedStyle}
        className={`
          absolute
top-12

left-5
right-5


rounded-3xl

${config[type].containerClass}
        `}
      >
        <Pressable
          onPress={onClose}
          className="
            p-5
            rounded-3xl
          "
        >
          <View
            className="
              flex-row
              items-center gap-3
            "
          >
            <Icon size={28} color={config[type].iconColor} />

            <View
              className="
                flex-1
              "
            >
              <Text
                className="
                  text-textPrimary font-bold text-lg
                  dark:text-textPrimary-dark
                "
              >
                {title}
              </Text>

              {message && (
                <Text
                  className="
                    mt-1
                    text-textSecondary
                    dark:text-textSecondary-dark
                  "
                >
                  {message}
                </Text>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}
