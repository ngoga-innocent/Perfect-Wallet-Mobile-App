import { Dimensions, FlatList, Pressable, Text, View } from "react-native";

import { useRef, useState } from "react";

import Animated, { FadeIn } from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";

import OnboardingCard from "@/components/onboarding/OnboardingCard";
import Pagination from "@/components/onboarding/Pagination";

import { onboardingSlides } from "@/constants/onboarding";

import { setStorageItem, STORAGE_KEYS } from "@/utils/storage";
import { router } from "expo-router";
const { width } = Dimensions.get("window");

export default function index() {
  const [index, setIndex] = useState(0);

  const listRef = useRef<FlatList>(null);

  async function finishOnboarding() {
    await setStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETED, "true");

    router.replace("/(auth)/login");
  }

  function next() {
    if (index < onboardingSlides.length - 1) {
      listRef.current?.scrollToIndex({
        index: index + 1,
        animated: true,
      });
    } else {
      finishOnboarding();
    }
  }

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F6F8F7", "#E8F5EF"]}
      style={{
        flex: 1,
      }}
    >
      {/* floating decoration */}

      <Animated.View
        entering={FadeIn}
        className="
          h-48 w-48
          bg-[#10644D]/10
          rounded-full
          absolute right-[-40] top-32
        "
      />

      <Animated.View
        className="
          h-52 w-52
          bg-[#F5C542]/20
          rounded-full
          absolute left-[-50] bottom-60
        "
      />

      <View
        className="
          flex-1
        "
      >
        {/* Skip */}

        <Pressable
          onPress={finishOnboarding}
          className="
            z-20
            px-4 py-2
            bg-white
            rounded-full
            absolute right-6 top-16 shadow
          "
        >
          <Text
            className="
              text-[#10644D] font-semibold
            "
          >
            Skip
          </Text>
        </Pressable>

        <FlatList
          ref={listRef}
          data={onboardingSlides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={(e) => {
            const position = Math.round(e.nativeEvent.contentOffset.x / width);

            setIndex(position);
          }}
          renderItem={({ item }) => (
            <View
              style={{
                width,
              }}
            >
              <OnboardingCard {...item} />
            </View>
          )}
        />
      </View>

      {/* Bottom section */}

      <View
        className="
          pb-12
          items-center
        "
      >
        <Pagination current={index} total={onboardingSlides.length} />

        <Pressable
          onPress={next}
          style={{
            shadowColor: "#10644D",

            shadowOpacity: 0.25,

            shadowRadius: 15,
          }}
          className="
            h-16 w-[85%]
            mt-8
            bg-[#10644D]
            rounded-3xl
            items-center justify-center
          "
        >
          <Text
            className="
              text-white font-bold text-lg
            "
          >
            {index === onboardingSlides.length - 1
              ? "Start Your Journey"
              : "Continue"}
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
