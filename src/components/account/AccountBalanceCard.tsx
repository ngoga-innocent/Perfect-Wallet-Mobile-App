import { LinearGradient } from "expo-linear-gradient";
import { Wifi } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useState } from "react";
interface AccountBalanceCardProps {
  accountName: string;
  accountType: string;
  currency: string;
  balance: number;
  formatCurrency: (amount: number) => string;
}

export default function AccountBalanceCard({
  accountName,
  accountType,
  currency,
  balance,
  formatCurrency,
}: AccountBalanceCardProps) {
  const animatedBalance = useRef(new Animated.Value(0)).current;
  const [displayBalance, setDisplayBalance] = useState(0);
  const glowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const listenerId = animatedBalance.addListener(({ value }) => {
      setDisplayBalance(value);
    });

    Animated.timing(animatedBalance, {
      toValue: balance,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedBalance.removeListener(listenerId);
    };
  }, [balance, animatedBalance]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [glowAnimation]);

  const formattedAccountType = accountType.replace("_", " ").toUpperCase();

  return (
    <View className="mx-5 mt-5 overflow-hidden rounded-[28px]">
      <LinearGradient
        colors={["#10644D", "#087F5B", "#064E3B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          minHeight: 235,
          padding: 24,
        }}
      >
        {/* Decorative background */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: 140,
            right: -145,
            top: -125,
            backgroundColor: "rgba(255,255,255,0.055)",
            opacity: glowAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.65, 1],
            }),
            transform: [
              {
                scale: glowAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.08],
                }),
              },
            ],
          }}
        />

        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: 90,
            right: -80,
            bottom: -95,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        />

        {/* Top row */}
        <View className="flex-row items-center justify-between">
          <Text className="text-[13px] font-bold tracking-[2px] text-white">
            WALLET FLOW
          </Text>

          <View className="flex-row items-center rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
            <View className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />

            <Text className="text-[10px] font-semibold tracking-wide text-white/80">
              ACTIVE
            </Text>
          </View>
        </View>

        {/* Account identity */}
        <View className="mt-7">
          <Text className="text-[11px] font-medium tracking-[1.5px] text-white/55">
            {formattedAccountType}
          </Text>

          <Text
            numberOfLines={1}
            className="mt-1 text-[20px] font-bold text-white"
          >
            {accountName}
          </Text>
        </View>

        {/* Card chip + contactless */}
        <View className="absolute right-4 z-10 top-20 mt-6 flex-row items-center">
          <View className="h-[34px] w-[47px] overflow-hidden rounded-[7px] border border-white/25 bg-white/15">
            <View className="flex-1 flex-row">
              <View className="w-1/2 border-r border-white/20" />

              <View className="flex-1">
                <View className="flex-1 border-b border-white/20" />
              </View>
            </View>

            <View className="absolute left-0 right-0 top-1/2 border-t border-white/20" />
          </View>

          <Wifi
            size={18}
            color="rgba(255,255,255,0.55)"
            strokeWidth={1.7}
            style={{
              marginLeft: 12,
              transform: [{ rotate: "90deg" }],
            }}
          />
        </View>

        {/* Balance */}
        <View className="mt-5">
          <Text className="text-[10px] font-medium uppercase tracking-[1.5px] text-white/55">
            Available balance
          </Text>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            className="mt-1 text-[30px] font-bold tracking-tight text-white"
          >
            {formatCurrency(displayBalance)}
          </Text>
        </View>

        {/* Bottom row */}
        <View className="mt-auto flex-row items-end justify-between pt-5">
          <View>
            <Text className="text-[9px] uppercase tracking-[1.5px] text-white/40">
              Currency
            </Text>

            <Text className="mt-0.5 text-xs font-bold tracking-widest text-white/75">
              {currency}
            </Text>
          </View>

          {/* Decorative card lines */}
          <View className="flex-row items-center">
            <View className="h-2 w-2 rounded-full border border-white/30" />
            <View className="-ml-1 h-2 w-2 rounded-full border border-white/30" />
            <View className="-ml-1 h-2 w-2 rounded-full border border-white/30" />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
