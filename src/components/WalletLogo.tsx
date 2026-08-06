import { WalletCards } from "lucide-react-native";

import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

export default function WalletLogo() {
  return (
    <Animated.View
      entering={ZoomIn.duration(900)}
      className="
        h-32 
        w-32
        items-center
        justify-center
        rounded-[40px]
        bg-white
      "
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 20,
      }}
    >
      <Animated.View entering={FadeIn.delay(500)}>
        <WalletCards size={60} color="#10644D" strokeWidth={2.5} />
      </Animated.View>
    </Animated.View>
  );
}
