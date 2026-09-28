import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function getExpoPushToken(): Promise<string | null> {
  try {
    if (!Device.isDevice) {
      // console.log("Push notifications require a physical device.");

      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification permission was not granted.");

      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.error("Expo project ID could not be found.");

      return null;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    return tokenResponse.data;
  } catch (error) {
    // console.error("Failed to get Expo push token:", error);

    return null;
  }
}

export async function configureNotificationChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "PWallet Notifications",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
  });
}
