import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

export default function GoldParticles() {
  return (
    <>
      <Animated.View
        entering={ZoomIn.delay(300)}
        className="
 absolute
 right-12
 top-32
 h-3
 w-3
 rounded-full
 bg-[#F5C542]
 "
      />

      <Animated.View
        entering={FadeIn.delay(600)}
        className="
 absolute
 left-16
 bottom-44
 h-2
 w-2
 rounded-full
 bg-[#F5C542]
 "
      />

      <Animated.View
        entering={FadeIn.delay(900)}
        className="
 absolute
 right-20
 bottom-56
 h-4
 w-4
 rounded-full
 bg-[#F5C542]
 "
      />
    </>
  );
}
