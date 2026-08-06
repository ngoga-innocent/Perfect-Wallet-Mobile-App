import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import Svg, { Path } from "react-native-svg";

import { useEffect } from "react";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function FlowLine() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 2500,
      }),
      -1,
      false,
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: 120 * (1 - progress.value),
  }));

  return (
    <Svg width="220" height="80" viewBox="0 0 220 80">
      <AnimatedPath
        d="
        M10 50
        C60 10,
        130 90,
        210 30
        "
        stroke="#F5C542"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="20 20"
        animatedProps={animatedProps}
      />
    </Svg>
  );
}
