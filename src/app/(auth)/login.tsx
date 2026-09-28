import { useState } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { EyeClosed, EyeOffIcon, LockIcon, Mail } from "lucide-react-native";

import { router } from "expo-router";

import AuthLayout from "@/components/ui/AuthLayout";
import { tokenStorage } from "@/utils/storage";
import { useLoginMutation, usePinverifyMutation } from "@/api/authApi";
import AuthBottomCard from "@/components/ui/AuthBottomCard";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";
import AuthHeader from "@/components/ui/Header/AuthHeader";
import TextInput from "@/components/ui/Inputs/TextInput";
import AppLoader from "@/components/ui/Loader/AppLoader";
import PinModal from "@/components/ui/Security/PinSetupModal";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { useAlert } from "@/components/ui/Alert/AlertProvider";
export default function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [pinverify, { isLoading: pinverifyLoading }] = usePinverifyMutation();
  const dispatch = useAppDispatch();
  const { execute } = useApiMutation();

  const handleLogin = async () => {
    const result = await execute(
      () =>
        login({
          email,
          password,
        }).unwrap(),
      {
        showSuccess: true,
        successMessage: "Welcome back!",
      },
    );

    if (!result.success) return;

    const credentials = result.data?.data;

    if (!credentials?.access) {
      useAlert().showAlert({
        title: "Error",
        type: "error",
        message: "Login succeeded but no access token was returned.",
      });
      return;
    }

    // Persist authentication session securely
    await tokenStorage.setTokens(credentials.access, credentials.refresh);

    // Keep credentials available during this app session
    dispatch(setCredentials(credentials));

    const security = credentials.security;

    // console.log("Security:", security);

    // No security configured yet
    if (security?.setup_required) {
      router.navigate("/(auth)/security-setup");
      return;
    }

    router.replace("/(tabs)");
    // Security is configured
    // if (security?.verification_required) {
    //   if (security?.methods?.includes("pin")) {
    //     setPinModalVisible(true);
    //     return;
    //   }

    //   console.log("Navigate to security verification:", security?.methods);

    //   return;
    // }

    // console.log("Navigate to Tabs");
  };
  // const handlePinVerification = async (pin: string) => {
  //   console.log("PIN verified:", pin);
  //   const result = await execute(
  //     () =>
  //       pinverify({
  //         pin,
  //       }).unwrap(),
  //     {
  //       showSuccess: true,
  //       successMessage: "PIN verification successful!",
  //     },
  //   );

  //   if (!result.success) return;

  //   setPinModalVisible(false);
  //   router.replace("/(tabs)");
  // };
  return (
    <AuthLayout>
      <AuthHeader
        title="Welcome Back 👋"
        subtitle="Login to access your Perfect Wallet account"
      />
      <AppLoader visible={isLoading} message="Signing you In..." />
      <AuthBottomCard>
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon={Mail}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          icon={LockIcon}
          placeholder="Enter your Password"
          rightIcon={!showPassword ? EyeClosed : EyeOffIcon}
          secureTextEntry={showPassword}
          onRightIconPress={() => setShowPassword((value) => !value)}
        />

        <TouchableOpacity
          className="self-end mb-6"
          onPress={() => router.push("/(auth)/forgot-password")}
        >
          <Text className="text-textHighlight dark:text-textHighlight-dark font-semibold">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Login"
          loading={isLoading}
          // disabled={isLoading || !email || !password}
          onPress={handleLogin}
        />

        <View className="flex-row justify-center mt-8">
          <Text className="text-textMuted dark:text-textMuted-dark">
            Don't have an account?
          </Text>

          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="ml-1 text-textHighlight dark:text-textHighlight-dark font-bold">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </AuthBottomCard>
      {/* PIN Modal */}
      {/*<PinModal
        visible={pinModalVisible}
        mode="verify"
        onVerify={(pin) => handlePinVerification(pin)}
        onClose={() => setPinModalVisible(false)}
      />*/}
    </AuthLayout>
  );
}
