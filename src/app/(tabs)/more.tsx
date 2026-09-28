import { router } from "expo-router";
import {
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Settings,
  Tag,
  WalletCards,
} from "lucide-react-native";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const sections = [
  {
    title: "Money",
    items: [
      {
        title: "Loans",
        subtitle: "Money you owe and money owed to you",
        icon: CircleDollarSign,
        onPress: () => router.navigate("/(tabs)/more/loans"),
      },
    ],
  },
  {
    title: "Planning",
    items: [
      {
        title: "Financial Calendar",
        subtitle: "Upcoming payments and expected income",
        icon: CalendarDays,
        onPress: () => router.navigate("/(tabs)/more/financial-calendar"),
      },
      {
        title: "Categories",
        subtitle: "Manage income and expense categories",
        icon: Tag,
        onPress: () => console.log("Category"),
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        title: "Settings",
        subtitle: "Manage your WalletFlow preferences",
        icon: Settings,
        onPress: () => router.navigate("/(tabs)/more/settings"),
      },
    ],
  },
];

function MoreMenuItem({
  title,
  subtitle,
  icon: Icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      className="flex-row items-center px-4 py-4"
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-softGreen dark:bg-softGreen-dark">
        <Icon size={21} color="#10644D" strokeWidth={2} />
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-base font-semibold text-text dark:text-text-dark">
          {title}
        </Text>

        <Text className="mt-1 pr-3 text-sm leading-5 text-textMuted dark:text-textMuted-dark">
          {subtitle}
        </Text>
      </View>

      <View className="h-8 w-8 items-center justify-center rounded-full bg-background dark:bg-background-dark">
        <ChevronRight size={17} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom * 3.5,
          paddingTop: insets.top,
        }}
      >
        {/* Header */}
        <View className="px-5 pt-6">
          {/*<Text className="text-sm font-medium text-textMuted dark:text-textMuted-dark">
            WalletFlow
          </Text>*/}

          <Text className="mt-1 text-3xl font-bold tracking-tight text-text dark:text-text-dark">
            More
          </Text>

          <Text className="mt-2 max-w-[330px] text-sm leading-5 text-textMuted dark:text-textMuted-dark">
            Manage your financial tools, planning and preferences.
          </Text>
        </View>

        {/* Financial tools highlight */}
        <View className="mx-5 mt-6 overflow-hidden rounded-[28px] bg-primary">
          <View className="relative p-5">
            {/* Decorative circles */}
            <View className="absolute -right-10 -top-12 h-36 w-36 rounded-full border border-white/10" />
            <View className="absolute -right-1 -top-3 h-20 w-20 rounded-full border border-white/10" />

            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <WalletCards size={22} color="#FFFFFF" />
            </View>

            <Text className="mt-5 text-xl font-bold text-white">
              Your financial toolkit
            </Text>

            <Text className="mt-1 max-w-[290px] text-sm leading-5 text-white/65">
              Everything you need to understand, plan and manage your money.
            </Text>

            <View className="mt-5 flex-row">
              <View className="mr-2 rounded-full bg-white/10 px-3 py-2">
                <Text className="text-xs font-medium text-white/80">Loans</Text>
              </View>

              <View className="mr-2 rounded-full bg-white/10 px-3 py-2">
                <Text className="text-xs font-medium text-white/80">
                  Planning
                </Text>
              </View>

              <View className="rounded-full bg-white/10 px-3 py-2">
                <Text className="text-xs font-medium text-white/80">
                  Categories
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu sections */}
        <View className="mt-7">
          {sections.map((section) => (
            <View key={section.title} className="mb-6">
              <Text className="mb-3 px-5 text-xs font-semibold uppercase tracking-wider text-textMuted dark:text-textMuted-dark">
                {section.title}
              </Text>

              <View className="mx-5 overflow-hidden rounded-[24px] bg-white dark:bg-surface-dark">
                {section.items.map((item, index) => (
                  <View key={item.title}>
                    <MoreMenuItem
                      title={item.title}
                      subtitle={item.subtitle}
                      icon={item.icon}
                      onPress={item.onPress}
                    />

                    {index !== section.items.length - 1 && (
                      <View className="ml-[76px] h-px bg-border dark:bg-border-dark" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View className="items-center px-5 pt-2">
          <Text className="text-xs font-medium text-textMuted dark:text-textMuted-dark">
            WalletFlow
          </Text>

          <Text className="mt-1 text-xs text-textMuted/60 dark:text-textMuted-dark/60">
            Your money. Your flow.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
