import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: "onboarding_completed",
  ACCESS_TOKEN: "access_token",
};

export async function getStorageItem(key: string) {
  return await AsyncStorage.getItem(key);
}

export async function setStorageItem(key: string, value: string) {
  return await AsyncStorage.setItem(key, value);
}

const ACCESS_TOKEN_KEY = "walletflow_access_token";
const REFRESH_TOKEN_KEY = "walletflow_refresh_token";

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async setTokens(accessToken: string, refreshToken?: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};
