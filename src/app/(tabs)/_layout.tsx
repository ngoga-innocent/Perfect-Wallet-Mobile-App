import { Tabs } from "expo-router";
import WalletTabBar from "@/components/navigations/WalletTabBar";
import { useEffect } from "react";
import { Platform } from "react-native";

import {
  configureNotificationChannel,
  getExpoPushToken,
} from "@/constants/notification";

import { useRegisterDeviceMutation } from "@/api/deviceApi";

export default function TabsLayout() {
  const [registerDevice] = useRegisterDeviceMutation();

  useEffect(() => {
    let mounted = true;

    const registerPushDevice = async () => {
      try {
        // Notification channels are only required on Android.
        if (Platform.OS === "android") {
          await configureNotificationChannel();
        }

        const token = await getExpoPushToken();

        if (!token || !mounted) {
          return;
        }

        const platform =
          Platform.OS === "ios"
            ? "ios"
            : Platform.OS === "android"
              ? "android"
              : "unknown";

        await registerDevice({
          expo_push_token: token,
          platform,
        }).unwrap();

        if (mounted) {
          console.log("Perfect Wallet device registered successfully.");
        }
      } catch (error) {
        console.error("Push registration failed:", error);
      }
    };

    registerPushDevice();

    return () => {
      mounted = false;
    };
  }, [registerDevice]);

  return (
    <Tabs
      tabBar={(props) => <WalletTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="accounts"
        options={{
          title: "Accounts",
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: "More",
        }}
      />
    </Tabs>
  );
}
