import { View } from "react-native";

import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

import { WalletCards } from "lucide-react-native";

import FlowLine from "./FlowLine";

interface Props {
  size?: "small" | "medium" | "large";
}

export default function BrandLogo({ size = "large" }: Props) {
  const dimensions =
    size === "small"
      ? "h-16 w-16 rounded-2xl"
      : size === "medium"
        ? "h-24 w-24 rounded-3xl"
        : "h-32 w-32 rounded-[40px]";

  return (
    <View className="items-center">
      <Animated.View
        entering={ZoomIn.duration(800)}
        className={`
 ${dimensions}
 items-center
 justify-center
 bg-white
 `}
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 25,
        }}
      >
        <WalletCards
          size={size === "small" ? 32 : size === "medium" ? 45 : 60}
          color="#10644D"
          strokeWidth={2.5}
        />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(700)}>
        <FlowLine />
      </Animated.View>
    </View>
  );
}
