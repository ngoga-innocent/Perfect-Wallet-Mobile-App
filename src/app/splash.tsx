import { View } from "react-native";

import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";

import WalletLogo from "@/components/WalletLogo";
import GoldenParticles from "@/components/brand/GoldenParticles";
import { router } from "expo-router";
import { useEffect } from "react";

import { getStorageItem, STORAGE_KEYS } from "@/utils/storage";
export default function SplashScreen() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // wait for animation
        await new Promise((resolve) => setTimeout(resolve, 2500));

        const onboarding = await getStorageItem(
          STORAGE_KEYS.ONBOARDING_COMPLETED,
        );

        const token = await getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);

        // First time user

        if (!onboarding) {
          router.replace("/onboarding");

          return;
        }

        // User already logged in

        if (token) {
          //   router.replace("/(tabs)");

          return;
        }

        // Returning user but not authenticated

        router.replace("/(auth)/login");
      } catch (error) {
        console.log("Splash initialization error", error);
        // Navigate to Login
        // router.replace("/login");
      }
    };

    initializeApp();
  }, []);
  return (
    <LinearGradient
      colors={["#10644D", "#047857", "#064E3B"]}
      style={{
        flex: 1,
      }}
    >
      <View
        className="
          flex-1 flex flex-col
          items-center justify-center
        "
      >
        {/* background floating circles */}

        <Animated.View
          entering={FadeIn.duration(1500)}
          className="
            h-24 w-24
            bg-white/10
            rounded-full
            absolute top-32 right-10
          "
        />

        <Animated.View
          entering={FadeIn.delay(300)}
          className="
            h-40 w-40
            bg-white/5
            rounded-full
            absolute bottom-40 left-8
          "
        />

        {/* logo */}

        <WalletLogo />
        <GoldenParticles />
        {/* Brand */}

        <Animated.Text
          entering={FadeInDown.delay(700)}
          className="
            mt-10
            text-5xl font-bold tracking-wide text-white
          "
        >
          Wallet-Flow
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(1000)}
          className="
            mt-3
            text-base tracking-widest text-white/80
          "
        >
          SMART MONEY • SIMPLE LIFE
        </Animated.Text>
        {/* <FlowLine /> */}
        {/* Bottom loader */}

        <Animated.View
          entering={FadeInUp.delay(1500)}
          className="
            absolute bottom-20
          "
        >
          <View
            className="
              overflow-hidden
              h-1 w-32
              bg-white/20
              rounded-full
            "
          >
            <Animated.View
              entering={ZoomIn.delay(1800)}
              className="
                h-full w-28
                bg-white
                rounded-full
              "
            />
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
