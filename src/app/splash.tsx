import { useEffect, useState } from "react";

import { View } from "react-native";

import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";

import { router } from "expo-router";

import WalletLogo from "@/components/WalletLogo";
import GoldenParticles from "@/components/brand/GoldenParticles";

import { getStorageItem, STORAGE_KEYS } from "@/utils/storage";

import { tokenStorage } from "@/utils/storage";

import {
  useLazyGetCurrentUserQuery,
  useRefreshTokenMutation,
} from "@/api/authApi";

import { useAppDispatch } from "@/store/hooks";

import { setCredentials, setHydrated, logout } from "@/store/slices/authSlice";
import AppLoader from "@/components/ui/Loader/AppLoader";
import { configureNotificationChannel } from "@/constants/notification";
export default function SplashScreen() {
  const dispatch = useAppDispatch();
  const [appLoading, setAppLoading] = useState(false);
  const [getCurrentUser] = useLazyGetCurrentUserQuery();

  const [refreshTokenRequest] = useRefreshTokenMutation();
  useEffect(() => {
    configureNotificationChannel();
  }, []);
  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      try {
        /*
         * ------------------------------------------------
         * Keep splash visible while WalletFlow initializes
         * ------------------------------------------------
         */
        await new Promise((resolve) => setTimeout(resolve, 2500));

        if (!mounted) return;

        /*
         * ------------------------------------------------
         * Check onboarding
         * ------------------------------------------------
         */
        setAppLoading(true);
        const onboarding = await getStorageItem(
          STORAGE_KEYS.ONBOARDING_COMPLETED,
        );

        /*
         * First-time user.
         *
         * No authentication/session restoration should
         * happen before onboarding is completed.
         */
        if (!onboarding) {
          dispatch(setHydrated(true));

          router.replace("/onboarding");
          setAppLoading(false);
          return;
        }

        /*
         * ------------------------------------------------
         * Get stored authentication tokens
         * ------------------------------------------------
         */
        let accessToken = await tokenStorage.getAccessToken();

        let refreshToken = await tokenStorage.getRefreshToken();

        /*
         * ------------------------------------------------
         * No stored authentication session
         * ------------------------------------------------
         */
        if (!accessToken && !refreshToken) {
          dispatch(logout());
          dispatch(setHydrated(true));
          setAppLoading(false);
          router.replace("/(auth)/login");

          return;
        }

        /*
         * ------------------------------------------------
         * Access token doesn't exist but refresh token does.
         *
         * Recover the access token first.
         * ------------------------------------------------
         */
        if (!accessToken && refreshToken) {
          console.log("Access token missing. Refreshing session...");

          const refreshResult = await refreshTokenRequest({
            refresh: refreshToken,
          }).unwrap();

          /*
           * Refresh failed to return an access token.
           */
          if (!refreshResult?.access) {
            console.log("Unable to restore session.");

            await tokenStorage.clearTokens();

            dispatch(logout());
            dispatch(setHydrated(true));
            setAppLoading(false);
            router.replace("/(auth)/login");

            return;
          }

          /*
           * Save the new access token.
           *
           * If the backend rotates the refresh token,
           * setTokens will save that one too.
           */
          await tokenStorage.setTokens(
            refreshResult.access,
            refreshResult.refresh,
          );

          /*
           * Read the latest values.
           */
          accessToken = await tokenStorage.getAccessToken();

          refreshToken = await tokenStorage.getRefreshToken();
        }

        /*
         * ------------------------------------------------
         * We must have an access token at this point.
         * ------------------------------------------------
         */
        if (!accessToken) {
          await tokenStorage.clearTokens();

          dispatch(logout());
          dispatch(setHydrated(true));
          setAppLoading(false);
          router.replace("/(auth)/login");

          return;
        }

        /*
         * ------------------------------------------------
         * Validate the session AND restore the user.
         *
         * /me/ is better than /token/verify/ because
         * it both validates the token and gives us the
         * current user.
         *
         * If the access token has expired, baseQuery
         * should refresh it automatically and retry /me.
         * ------------------------------------------------
         */
        // console.log("Restoring WalletFlow session...");

        const userResult = await getCurrentUser().unwrap();

        const user = userResult?.data;

        if (!user) {
          console.log("No authenticated user returned.");

          await tokenStorage.clearTokens();

          dispatch(logout());
          dispatch(setHydrated(true));
          setAppLoading(false);
          router.replace("/(auth)/login");

          return;
        }

        /*
         * ------------------------------------------------
         * Get the latest tokens again.
         *
         * This is important because baseQuery may have
         * refreshed the access token automatically.
         * ------------------------------------------------
         */
        accessToken = await tokenStorage.getAccessToken();

        refreshToken = await tokenStorage.getRefreshToken();

        if (!accessToken) {
          await tokenStorage.clearTokens();

          dispatch(logout());
          dispatch(setHydrated(true));
          setAppLoading(false);
          router.replace("/(auth)/login");

          return;
        }

        /*
         * ------------------------------------------------
         * Restore authenticated user into Redux.
         * ------------------------------------------------
         */
        dispatch(
          setCredentials({
            access: accessToken,
            refresh: refreshToken ?? "",
            user,
          }),
        );

        dispatch(setHydrated(true));

        /*
         * ------------------------------------------------
         * Session is valid.
         *
         * IMPORTANT:
         * We do NOT set sessionVerified here.
         *
         * The user still has to pass biometric/PIN.
         * ------------------------------------------------
         */
        setAppLoading(false);
        router.replace("/(auth)/security-verify");
      } catch (error) {
        console.log("Splash initialization error:", error);

        /*
         * Something went wrong restoring the session.
         *
         * Treat it as an invalid session and require
         * a fresh login.
         */
        await tokenStorage.clearTokens();

        dispatch(logout());
        dispatch(setHydrated(true));

        if (mounted) {
          setAppLoading(false);
          router.replace("/(auth)/login");
        }
      }
    };

    initializeApp();

    return () => {
      mounted = false;
    };
  }, [dispatch, getCurrentUser, refreshTokenRequest]);

  return (
    <LinearGradient
      colors={["#10644D", "#047857", "#064E3B"]}
      style={{
        flex: 1,
      }}
    >
      <View
        className="
          flex-1
          flex
          flex-col
          items-center
          justify-center
        "
      >
        {/* Background floating circles */}

        <Animated.View
          entering={FadeIn.duration(1500)}
          className="
            h-24
            w-24
            bg-white/10
            rounded-full
            absolute
            top-32
            right-10
          "
        />

        <Animated.View
          entering={FadeIn.delay(300)}
          className="
            h-40
            w-40
            bg-white/5
            rounded-full
            absolute
            bottom-40
            left-8
          "
        />

        {/* Logo */}

        <WalletLogo />

        <GoldenParticles />

        {/* Brand */}

        <Animated.Text
          entering={FadeInDown.delay(700)}
          className="
            mt-10
            text-5xl
            font-bold
            tracking-wide
            text-white
          "
        >
          Perfect Wallet
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(1000)}
          className="
            mt-3
            text-base
            tracking-widest
            text-white/80
          "
        >
          SMART MONEY • SIMPLE LIFE
        </Animated.Text>

        {/* Bottom loader */}

        <Animated.View
          entering={FadeInUp.delay(1500)}
          className="
            absolute
            bottom-20
          "
        >
          <View
            className="
              overflow-hidden
              h-1
              w-32
              bg-white/20
              rounded-full
            "
          >
            <Animated.View
              entering={ZoomIn.delay(1800)}
              className="
                h-full
                w-28
                bg-white
                rounded-full
              "
            />
          </View>
        </Animated.View>
      </View>
      <AppLoader visible={appLoading} message="Getting Ready...." />
    </LinearGradient>
  );
}
