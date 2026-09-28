import { AlertProvider } from "@/components/ui/Alert/AlertProvider";
import { ThemeProvider } from "@/constants/theme/ThemeProvider";
import { store } from "@/store/store";
import { Stack, router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { AppDrawerProvider } from "@/components/navigations/AppDrawerContext";
import "../global.css";

import * as Notifications from "expo-notifications";
import * as Application from "expo-application";
import { Platform } from "react-native";
import { useEffect } from "react";

import { useGetCurrentAppVersionQuery } from "@/api/authApi";
import { isVersionBelow } from "@/utils/version";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const platform = Platform.OS === "ios" ? "ios" : "android";

  const { data: appVersion, isLoading: isCheckingVersion } =
    useGetCurrentAppVersionQuery(platform);

  useEffect(() => {
    if (!appVersion) {
      return;
    }

    const currentVersion = Application.nativeApplicationVersion ?? "0.0.0";

    const mustUpdate = isVersionBelow(
      currentVersion,
      appVersion.minimum_version,
    );

    if (mustUpdate) {
      router.replace({
        pathname: "/update-required",
        params: {
          current: currentVersion,
          latest: appVersion.latest_version,
          url: appVersion.update_url,
        },
      });
    }
  }, [appVersion]);

  useEffect(() => {
    if (isCheckingVersion) {
      return;
    }

    if (!appVersion) {
      return;
    }

    const currentVersion = Application.nativeApplicationVersion ?? "0.0.0";

    const mustUpdate = isVersionBelow(
      currentVersion,
      appVersion.minimum_version,
    );

    // Don't process notification navigation
    // if an update is required.
    if (mustUpdate) {
      return;
    }

    const navigateToFinancialCalendar = () => {
      router.push("/(tabs)/more/financial-calendar");
    };

    // App running/background
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification clicked:", response);

        navigateToFinancialCalendar();
      },
    );

    // App completely closed
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();

      if (response) {
        console.log("App opened from notification:", response);

        setTimeout(() => {
          navigateToFinancialCalendar();
        }, 700);
      }
    };

    checkInitialNotification();

    return () => {
      subscription.remove();
    };
  }, [appVersion, isCheckingVersion]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppDrawerProvider>
        <Provider store={store}>
          <ThemeProvider>
            <AlertProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </AlertProvider>
          </ThemeProvider>
        </Provider>
      </AppDrawerProvider>
    </GestureHandlerRootView>
  );
}
