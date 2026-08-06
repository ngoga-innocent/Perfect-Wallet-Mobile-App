import { View } from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";

import { ChartNoAxesCombined, Rocket, WalletCards } from "lucide-react-native";

const icons = {
  wallet: WalletCards,
  chart: ChartNoAxesCombined,
  rocket: Rocket,
};

interface Props {
  title: string;
  description: string;
  icon: keyof typeof icons;
}

export default function OnboardingCard({ title, description, icon }: Props) {
  const Icon = icons[icon];

  return (
    <View
      className="
flex-1
items-center
justify-center
px-8
"
    >
      <Animated.View
        entering={FadeInDown.duration(800)}
        className="
h-56
w-56
items-center
justify-center
rounded-[70px]
bg-primary/10
"
        style={{
          shadowColor: "#10644D",
          shadowOpacity: 0.15,
          shadowRadius: 25,
        }}
      >
        <Icon size={90} color="#10644D" strokeWidth={2} />
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.delay(300)}
        className="
mt-12
text-center
text-4xl
font-bold
text-[#0F172A]
"
      >
        {title}
      </Animated.Text>

      <Animated.Text
        entering={FadeInDown.delay(500)}
        className="
mt-5
text-center
text-base
leading-6
text-gray-500
"
      >
        {description}
      </Animated.Text>
    </View>
  );
}
