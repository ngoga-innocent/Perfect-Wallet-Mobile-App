import { ActivityIndicator, Text } from "react-native";

import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

interface Props {
  visible: boolean;

  message?: string;
}

export default function AppLoader({ visible, message }: Props) {
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
      style={{ zIndex: 9999999 }}
      className="
       
        absolute
        inset-0

        bg-black/40

        items-center
        justify-center
      "
    >
      <Animated.View
        entering={ZoomIn.duration(200)}
        exiting={ZoomOut.duration(150)}
        className="
          px-8
          py-6

          bg-surface
          dark:bg-surface-dark

          rounded-3xl

          items-center
        "
      >
        <ActivityIndicator size="large" color="#10644D" />

        {message && (
          <Text
            className="
                mt-4

                text-textPrimary
                dark:text-textPrimary-dark

                font-semibold
              "
          >
            {message}
          </Text>
        )}
      </Animated.View>
    </Animated.View>
  );
}
