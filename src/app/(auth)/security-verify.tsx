import { useCallback, useEffect, useState } from "react";

import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import * as LocalAuthentication from "expo-local-authentication";

import { router } from "expo-router";

import {
  Fingerprint,
  LockIcon,
  LockKeyhole,
  MailIcon,
} from "lucide-react-native";

import PinModal from "@/components/ui/Security/PinSetupModal";

import { usePinverifyMutation } from "@/api/authApi";

import { useApiMutation } from "@/hooks/useApiMutation";

import { useAppDispatch } from "@/store/hooks";

import { setSessionVerified } from "@/store/slices/authSlice";
import AppLoader from "@/components/ui/Loader/AppLoader";
import Divider from "@/components/ui/Divider";
import { COLORS } from "@/constants/colors";

export default function SecurityVerify() {
  const dispatch = useAppDispatch();

  const [pinModalVisible, setPinModalVisible] = useState(false);

  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const [biometricLoading, setBiometricLoading] = useState(true);

  const [biometricFailed, setBiometricFailed] = useState(false);

  const [pinverify, { isLoading: pinLoading }] = usePinverifyMutation();

  const { execute } = useApiMutation();

  /*
   * --------------------------------------------------
   * Complete security verification
   * --------------------------------------------------
   */

  const completeVerification = useCallback(() => {
    dispatch(setSessionVerified(true));

    router.replace("/(tabs)");
  }, [dispatch]);

  /*
   * --------------------------------------------------
   * Check biometric availability
   * --------------------------------------------------
   */

  const checkDeviceAuthentication = useCallback(async () => {
    try {
      setBiometricLoading(true);

      /*
       * What authentication is enrolled on the device?
       *
       * NONE
       * SECRET              → PIN / Pattern / Password
       * BIOMETRIC_WEAK
       * BIOMETRIC_STRONG
       */
      const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();

      const hardwareAvailable = await LocalAuthentication.hasHardwareAsync();

      const biometricEnrolled = await LocalAuthentication.isEnrolledAsync();

      const deviceSecurityAvailable =
        securityLevel !== LocalAuthentication.SecurityLevel.NONE;

      const biometricAvailable = hardwareAvailable && biometricEnrolled;

      console.log("Device security:", {
        securityLevel,
        hardwareAvailable,
        biometricEnrolled,
        biometricAvailable,
        deviceSecurityAvailable,
      });

      setBiometricAvailable(biometricAvailable);

      return {
        securityLevel,
        biometricAvailable,
        deviceSecurityAvailable,
      };
    } catch (error) {
      console.log("Device authentication availability error:", error);

      setBiometricAvailable(false);

      return {
        securityLevel: LocalAuthentication.SecurityLevel.NONE,

        biometricAvailable: false,

        deviceSecurityAvailable: false,
      };
    } finally {
      setBiometricLoading(false);
    }
  }, []);

  /*
   * --------------------------------------------------
   * Authenticate using biometrics
   * --------------------------------------------------
   */

  const authenticateBiometric = useCallback(async () => {
    try {
      setBiometricLoading(true);

      const { biometricAvailable, deviceSecurityAvailable } =
        await checkDeviceAuthentication();

      /*
       * --------------------------------------------------
       * No device security at all.
       *
       * The phone has no PIN/password/pattern and no
       * enrolled biometric.
       *
       * Fall back to WalletFlow PIN.
       * --------------------------------------------------
       */

      if (!deviceSecurityAvailable) {
        console.log("No device security configured. Using WalletFlow PIN.");

        setBiometricFailed(true);
        setPinModalVisible(true);

        return;
      }

      /*
       * --------------------------------------------------
       * Device has security.
       *
       * If biometrics are available, let the operating
       * system handle biometric + device credential.
       * --------------------------------------------------
       */

      if (biometricAvailable) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Verify your identity to access WalletFlow",

          /*
           * Android/iOS can use the device credential
           * as fallback when allowed by the OS.
           */
          disableDeviceFallback: false,

          /*
           * Android
           */
          promptSubtitle: "Use your device security to continue",

          /*
           * Android confirmation behavior.
           */
          requireConfirmation: true,
        });

        console.log("Device authentication result:", result);

        if (result.success) {
          completeVerification();
          return;
        }

        /*
         * The user cancelled or authentication failed.
         *
         * Because the device has security, we can allow
         * them to try again rather than immediately using
         * WalletFlow PIN.
         */
        console.log("Device authentication failed:", result.error);

        setBiometricFailed(true);

        /*
         * We don't immediately show WalletFlow PIN here.
         *
         * The device itself has a security mechanism,
         * so retrying device authentication is preferred.
         */
        return;
      }

      /*
       * --------------------------------------------------
       * Device has a PIN/password/pattern but NO biometric.
       *
       * authenticateAsync can still use the device
       * credential on supported Android configurations.
       * --------------------------------------------------
       */

      console.log("No biometric enrolled. Attempting device credential.");

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Verify your identity to access WalletFlow",

        disableDeviceFallback: false,

        promptSubtitle: "Use your device PIN, password, or pattern",

        requireConfirmation: true,
      });

      console.log("Device credential result:", result);

      if (result.success) {
        completeVerification();
        return;
      }

      /*
       * The device has security but authentication failed.
       *
       * We can now offer WalletFlow PIN as an explicit
       * fallback if you want that behavior.
       */
      setBiometricFailed(true);
      setPinModalVisible(true);
    } catch (error) {
      console.log("Device authentication error:", error);

      /*
       * If we can't use the device authentication API,
       * WalletFlow PIN becomes the fallback.
       */
      setBiometricFailed(true);
      setPinModalVisible(true);
    } finally {
      setBiometricLoading(false);
    }
  }, [checkDeviceAuthentication, completeVerification]);

  /*
   * --------------------------------------------------
   * Automatically try biometrics when screen opens
   * --------------------------------------------------
   */

  useEffect(() => {
    authenticateBiometric();
  }, [authenticateBiometric]);

  /*
   * --------------------------------------------------
   * PIN verification
   * --------------------------------------------------
   */

  const handlePinVerification = async (pin: string) => {
    const result = await execute(
      () =>
        pinverify({
          pin,
        }).unwrap(),
      {
        showSuccess: true,
        successMessage: "PIN verification successful!",
      },
    );

    if (!result.success) {
      return;
    }

    setPinModalVisible(false);

    completeVerification();
  };

  /*
   * --------------------------------------------------
   * Allow user to retry biometrics
   * --------------------------------------------------
   */

  const handleRetryBiometric = async () => {
    setBiometricFailed(false);

    await authenticateBiometric();
  };

  /*
   * --------------------------------------------------
   * Loading screen
   * --------------------------------------------------
   */

  if (biometricLoading && !biometricFailed && !pinModalVisible) {
    return (
      <View className="flex-1 items-center justify-center bg-primary px-6">
        <ActivityIndicator size="large" />

        <Text className="mt-5 text-center text-text dark:text-text-dark text-lg font-semibold">
          Verifying your identity...
        </Text>

        <Text className="mt-2 text-center text-textMuted dark:text-textMuted-dark">
          Please complete biometric authentication.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark px-6">
      <View className="flex-1 items-center justify-center">
        <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center">
          {biometricFailed ? (
            <LockKeyhole size={38} color="#10644D" />
          ) : (
            <Fingerprint size={38} color="#10644D" />
          )}
        </View>

        <Text className="mt-7 text-2xl font-bold text-text dark:text-text-dark text-center">
          {biometricFailed ? "Enter your PIN" : "Verify your identity"}
        </Text>

        <Text className="mt-3 text-center text-textMuted dark:text-textMuted-dark leading-6">
          {biometricFailed
            ? "Biometric verification was unsuccessful. Use your PIN to unlock your WalletFlow account."
            : "Use your fingerprint or Face ID to securely access your WalletFlow account."}
        </Text>

        {biometricFailed && (
          <TouchableOpacity
            className="mt-8 flex-row items-center"
            onPress={handleRetryBiometric}
            disabled={biometricLoading}
          >
            <Fingerprint size={20} color="#10644D" />

            <Text className="ml-2 text-primary font-semibold">
              Try biometrics again
            </Text>
          </TouchableOpacity>
        )}
        <Divider />
        <TouchableOpacity
          className="mt-8 flex-row items-center"

          onPress={() => router.navigate("/login")}
        >
          <View className="flex-row gap-x-2 mr-2 items-center">
            <MailIcon size={20} color={COLORS.emerald} />
            <Text>/</Text>
            <LockIcon size={20} color={COLORS.emerald} />
          </View>
          <Text className="text-primary font-semibold">
            Login With Email and Password
          </Text>
        </TouchableOpacity>
      </View>

      <View className="pb-10">
        <Text className="text-center text-textMuted dark:text-textMuted-dark text-sm">
          Your account is protected by WalletFlow security.
        </Text>
      </View>

      <PinModal
        visible={pinModalVisible}
        mode="verify"
        loading={pinLoading}
        onVerify={handlePinVerification}
        onClose={() => setPinModalVisible(false)}
      />
      <AppLoader visible={pinLoading} message="Verifying PIN..." />
    </View>
  );
}
