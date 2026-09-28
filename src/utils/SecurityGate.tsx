import { useEffect, useState } from "react";

import { ActivityIndicator, View } from "react-native";

import { router } from "expo-router";

import {
  useLazyGetCurrentUserQuery,
  useRefreshTokenMutation,
} from "@/api/authApi";

import { tokenStorage } from "./storage";

import { useAppDispatch } from "@/store/hooks";

import { setCredentials, setHydrated, logout } from "@/store/slices/authSlice";

export default function SecurityGate() {
  const dispatch = useAppDispatch();

  const [getCurrentUser] = useLazyGetCurrentUserQuery();

  const [refreshTokenRequest] = useRefreshTokenMutation();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    initializeSession();
  }, []);

  const clearSessionAndLogin = async () => {
    await tokenStorage.clearTokens();

    dispatch(logout());
    dispatch(setHydrated(true));

    router.replace("/(auth)/login");
  };

  const initializeSession = async () => {
    try {
      setChecking(true);

      const storedAccessToken = await tokenStorage.getAccessToken();

      const storedRefreshToken = await tokenStorage.getRefreshToken();

      /*
       * --------------------------------------------------
       * CASE 1:
       * No tokens at all.
       * --------------------------------------------------
       */

      if (!storedAccessToken && !storedRefreshToken) {
        await clearSessionAndLogin();
        return;
      }

      /*
       * --------------------------------------------------
       * CASE 2:
       * Access token is missing.
       *
       * We still have a refresh token, so attempt
       * to obtain a new access token.
       * --------------------------------------------------
       */

      if (!storedAccessToken && storedRefreshToken) {
        console.log("Access token missing. Refreshing session...");

        const refreshResult = await refreshTokenRequest({
          refresh: storedRefreshToken,
        }).unwrap();

        if (!refreshResult?.access) {
          console.log("Refresh did not return an access token.");

          await clearSessionAndLogin();
          return;
        }

        /*
         * Store the new access token.
         *
         * If backend rotates the refresh token,
         * also store the new refresh token.
         */
        await tokenStorage.setTokens(
          refreshResult.access,
          refreshResult.refresh,
        );
      }

      /*
       * --------------------------------------------------
       * At this point we should have an access token.
       * --------------------------------------------------
       */

      const accessToken = await tokenStorage.getAccessToken();

      const refreshToken = await tokenStorage.getRefreshToken();

      if (!accessToken) {
        await clearSessionAndLogin();
        return;
      }

      /*
       * --------------------------------------------------
       * Restore current user.
       *
       * /me/ validates the access token.
       *
       * If it returns 401, our baseQuery automatically
       * uses the refresh token and retries /me/.
       * --------------------------------------------------
       */

      console.log("Restoring current user...");

      const userResult = await getCurrentUser().unwrap();

      console.log("Current user restored:", userResult);

      const user = userResult?.data;

      if (!user) {
        console.log("No user returned from /me/");

        await clearSessionAndLogin();
        return;
      }

      /*
       * --------------------------------------------------
       * Store the complete authenticated session
       * in Redux.
       * --------------------------------------------------
       */

      const latestAccessToken = await tokenStorage.getAccessToken();

      const latestRefreshToken = await tokenStorage.getRefreshToken();

      if (!latestAccessToken) {
        await clearSessionAndLogin();
        return;
      }

      dispatch(
        setCredentials({
          access: latestAccessToken,
          refresh: latestRefreshToken ?? "",
          user,
        }),
      );

      dispatch(setHydrated(true));

      /*
       * --------------------------------------------------
       * Session is valid.
       *
       * Now move to security verification.
       * --------------------------------------------------
       */

      router.replace("/(auth)/security-verify");
    } catch (error) {
      console.log("Session restoration failed:", error);

      await clearSessionAndLogin();
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
