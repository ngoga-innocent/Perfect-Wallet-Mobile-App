import React, { useRef, useState } from "react";

import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react-native";

import {
  useForgotpasswordMutation,
  useResetPasswordMutation,
  useVerifyPasswordResetOtpMutation,
} from "@/api/authApi";

import AuthBottomCard from "@/components/ui/AuthBottomCard";
import AuthLayout from "@/components/ui/AuthLayout";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";
import AuthHeader from "@/components/ui/Header/AuthHeader";
import TextInput from "@/components/ui/Inputs/TextInput";
import AppLoader from "@/components/ui/Loader/AppLoader";

import { useApiMutation } from "@/hooks/useApiMutation";
import { router } from "expo-router";

// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

type RecoveryStep = "email" | "otp" | "password";

// ---------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------

export default function ForgotPassword() {
  const [step, setStep] = useState<RecoveryStep>("email");

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // -------------------------------------------------------
  // API
  // -------------------------------------------------------

  const [forgotpassword, { isLoading: isSendingCode }] =
    useForgotpasswordMutation();

  const [verifyPasswordResetOtp, { isLoading: isVerifyingOtp }] =
    useVerifyPasswordResetOtpMutation();

  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  const { execute } = useApiMutation();

  // -------------------------------------------------------
  // ANIMATION
  // -------------------------------------------------------

  const slideAnimation = useRef(new Animated.Value(0)).current;

  const animateStep = (direction: "forward" | "backward") => {
    slideAnimation.setValue(direction === "forward" ? 40 : -40);

    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const changeStep = (
    nextStep: RecoveryStep,
    direction: "forward" | "backward" = "forward",
  ) => {
    animateStep(direction);

    setStep(nextStep);
  };

  // -------------------------------------------------------
  // STEP 1
  // SEND OTP
  // -------------------------------------------------------

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      return;
    }

    const result = await execute(
      () =>
        forgotpassword({
          email: email.trim(),
        }).unwrap(),

      {
        showSuccess: true,
        successMessage: "Reset code sent to your email!",
      },
    );

    if (!result.success) {
      return;
    }

    changeStep("otp");
  };

  // -------------------------------------------------------
  // STEP 2
  // VERIFY OTP
  // -------------------------------------------------------

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      return;
    }

    const result = await execute(
      () =>
        verifyPasswordResetOtp({
          email: email.trim(),
          otp,
        }).unwrap(),

      {
        showSuccess: true,
        successMessage: "Code verified successfully!",
      },
    );
    console.log(result);
    if (!result.success) {
      return;
    }

    const token = result.data?.data?.reset_token;

    if (!token) {
      return;
    }

    setResetToken(token);

    changeStep("password");
  };

  // -------------------------------------------------------
  // STEP 3
  // RESET PASSWORD
  // -------------------------------------------------------

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    const result = await execute(
      () =>
        resetPassword({
          reset_token: resetToken,

          new_password: password,

          confirm_password: confirmPassword,
        }).unwrap(),

      {
        showSuccess: true,
        successMessage: "Password reset successfully!",
      },
    );

    if (!result.success) {
      return;
    }

    /*
     * Password has been successfully
     * changed.
     *
     * You can either navigate to login
     * or reset the component state.
     */

    router.replace("/(auth)/login");
  };

  // -------------------------------------------------------
  // BACK
  // -------------------------------------------------------

  const handleBack = () => {
    if (step === "otp") {
      setOtp("");

      changeStep("email", "backward");

      return;
    }

    if (step === "password") {
      setResetToken("");

      changeStep("otp", "backward");

      return;
    }
  };

  // -------------------------------------------------------
  // STEP INDICATOR
  // -------------------------------------------------------

  const currentStep = step === "email" ? 1 : step === "otp" ? 2 : 3;

  // -------------------------------------------------------
  // LOADER
  // -------------------------------------------------------

  const isLoading = isSendingCode || isVerifyingOtp || isResettingPassword;

  return (
    <AuthLayout>
      <AppLoader visible={isLoading} message="Processing..." />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* ---------------------------------------------
            HEADER
        ---------------------------------------------- */}

        <View className="px-5 pt-3">
          {step !== "email" && (
            <TouchableOpacity
              onPress={handleBack}
              className="
                w-10
                h-10
                rounded-full
                bg-slate-100
                items-center
                justify-center
                mb-4
              "
            >
              <ArrowLeft size={21} color="#0F172A" />
            </TouchableOpacity>
          )}

          <AuthHeader
            title={
              step === "email"
                ? "Forgot Password?"
                : step === "otp"
                  ? "Verify Code"
                  : "Create New Password"
            }
            subtitle={
              step === "email"
                ? "Enter your email and we'll send you a verification code."
                : step === "otp"
                  ? `Enter the 6-digit code sent to ${email}`
                  : "Create a strong password to protect your WalletFlow account."
            }
          />

          {/* -------------------------------------------
              STEP INDICATOR
          -------------------------------------------- */}

          <View
            className="
              flex-row
              items-center
              mt-6
            "
          >
            {[1, 2, 3].map((item, index) => {
              const active = item <= currentStep;

              return (
                <React.Fragment key={item}>
                  <View
                    className={`
                        w-8
                        h-8
                        rounded-full
                        items-center
                        justify-center
                        ${active ? "bg-primary" : "bg-slate-200"}
                      `}
                  >
                    {item < currentStep ? (
                      <CheckCircle2 size={17} color="#FFFFFF" />
                    ) : (
                      <Text
                        className={`
                            font-bold
                            ${active ? "text-white" : "text-slate-400"}
                          `}
                      >
                        {item}
                      </Text>
                    )}
                  </View>

                  {index < 2 && (
                    <View
                      className={`
                          flex-1
                          h-1
                          mx-2
                          rounded-full
                          ${item < currentStep ? "bg-primary" : "bg-slate-200"}
                        `}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* ---------------------------------------------
            ANIMATED CONTENT
        ---------------------------------------------- */}

        <Animated.View
          style={{
            flex: 1,
            transform: [
              {
                translateX: slideAnimation,
              },
            ],
            opacity: slideAnimation.interpolate({
              inputRange: [-40, 0, 40],
              outputRange: [0.7, 1, 0.7],
            }),
          }}
        >
          <AuthBottomCard>
            {/* =========================================
                STEP 1
            ========================================== */}

            {step === "email" && (
              <View>
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  icon={Mail}
                  keyboardType="email-address"
                  autoCorrect={false}
                />

                <View className="mt-6">
                  <PrimaryButton
                    title="Send Code"
                    onPress={handleForgotPassword}
                    disabled={!email.trim()}
                  />
                </View>
              </View>
            )}

            {/* =========================================
                STEP 2
            ========================================== */}

            {step === "otp" && (
              <View>
                <TextInput
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChangeText={(value) =>
                    setOtp(value.replace(/\D/g, "").slice(0, 6))
                  }
                  icon={Mail}
                  keyboardType="number-pad"
                  maxLength={6}
                />

                <View className="mt-6">
                  <PrimaryButton
                    title="Verify Code"
                    onPress={handleVerifyOtp}
                    disabled={otp.length !== 6}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => changeStep("email", "backward")}
                  className="
                    mt-5
                    items-center
                  "
                >
                  <Text
                    className="
                      text-slate-500
                    "
                  >
                    Use a different email
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* =========================================
                STEP 3
            ========================================== */}

            {step === "password" && (
              <View>
                <TextInput
                  label="New Password"
                  placeholder="Enter new password"
                  value={password}
                  onChangeText={setPassword}
                  icon={LockKeyhole}
                  secureTextEntry={!showPassword}
                  rightIcon={showPassword ? EyeOff : Eye}
                  onRightIconPress={() => setShowPassword((value) => !value)}
                />

                <View className="mt-4">
                  <TextInput
                    label="Confirm Password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    icon={LockKeyhole}
                    secureTextEntry={!showConfirmPassword}
                    rightIcon={showConfirmPassword ? EyeOff : Eye}
                    onRightIconPress={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                  />
                </View>

                {/* Password mismatch */}

                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <Text
                    className="
                        text-red-500
                        text-sm
                        mt-2
                      "
                  >
                    Passwords do not match.
                  </Text>
                )}

                <View className="mt-6">
                  <PrimaryButton
                    title="Reset Password"
                    onPress={handleResetPassword}
                    disabled={
                      !password ||
                      !confirmPassword ||
                      password !== confirmPassword
                    }
                  />
                </View>
              </View>
            )}
          </AuthBottomCard>
        </Animated.View>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}
