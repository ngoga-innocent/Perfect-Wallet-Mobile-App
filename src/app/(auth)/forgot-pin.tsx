import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react-native";

import {
  useForgotpinMutation,
  useResetPinMutation,
  useVerifyPinResetOtpMutation,
} from "@/api/authApi";

import AuthBottomCard from "@/components/ui/AuthBottomCard";
import AuthLayout from "@/components/ui/AuthLayout";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";
import AuthHeader from "@/components/ui/Header/AuthHeader";
import TextInput from "@/components/ui/Inputs/TextInput";
import AppLoader from "@/components/ui/Loader/AppLoader";
import PinInput from "@/components/ui/Security/PinInput";

import { useApiMutation } from "@/hooks/useApiMutation";
import { router } from "expo-router";

// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

type ResetStep = "otp" | "pin";

// ---------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------

export default function ForgotPin() {
  const [step, setStep] = useState<ResetStep>("otp");

  const [otp, setOtp] = useState("");

  const [pin, setPin] = useState("");

  const [confirmPin, setConfirmPin] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [pinStep, setPinStep] = useState<PinStep>("create");
  type ResetStep = "otp" | "pin";
  type PinStep = "create" | "confirm";
  // -------------------------------------------------------
  // API
  // -------------------------------------------------------

  const [forgotPin, { isLoading: isSendingOtp }] = useForgotpinMutation();

  const [verifyPinResetOtp, { isLoading: isVerifyingOtp }] =
    useVerifyPinResetOtpMutation();

  const [resetPin, { isLoading: isResettingPin }] = useResetPinMutation();

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
    nextStep: ResetStep,
    direction: "forward" | "backward" = "forward",
  ) => {
    animateStep(direction);
    console.log(nextStep);
    setStep(nextStep);
  };

  // -------------------------------------------------------
  // SEND OTP
  // -------------------------------------------------------

  const sendOtp = async () => {
    const result = await execute(
      () => forgotPin({}).unwrap(),

      {
        showSuccess: true,
        successMessage: "Verification code sent to your email.",
      },
    );

    if (!result.success) {
      return false;
    }

    setOtpSent(true);

    return true;
  };

  // -------------------------------------------------------
  // SEND OTP WHEN PAGE OPENS
  // -------------------------------------------------------

  useEffect(() => {
    sendOtp();
  }, []);

  // -------------------------------------------------------
  // VERIFY OTP
  // -------------------------------------------------------

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      return;
    }
    console.log(otp);

    const result = await execute(
      () =>
        verifyPinResetOtp({
          otp,
        }).unwrap(),

      {
        showSuccess: true,
        successMessage: "Code verified successfully!",
      },
    );
    // console.log(result);
    if (!result.success) {
      return;
    }

    const token = result.data?.data.reset_token;
    // console.log(token);
    if (!token) {
      return;
    }

    setResetToken(token);

    changeStep("pin", "forward");
  };

  // -------------------------------------------------------
  // RESET PIN
  // -------------------------------------------------------

  const handleResetPin = async () => {
    if (pin.length !== 6 || confirmPin.length !== 6) {
      return;
    }

    if (pin !== confirmPin) {
      return;
    }

    const result = await execute(
      () =>
        resetPin({
          reset_token: resetToken,

          pin,

          confirm_pin: confirmPin,
        }).unwrap(),

      {
        showSuccess: true,
        successMessage: "Your Wallet PIN has been reset successfully!",
      },
    );

    if (!result.success) {
      return;
    }

    // -----------------------------------------------
    // Reset local state
    // -----------------------------------------------

    setPin("");
    setConfirmPin("");
    setOtp("");
    setResetToken("");

    // -----------------------------------------------
    // Navigate back / close page here if required
    // -----------------------------------------------

    router.replace("/(tabs)");
  };

  // -------------------------------------------------------
  // BACK
  // -------------------------------------------------------

  const handleBack = () => {
    if (step === "pin") {
      setResetToken("");
      setPin("");
      setConfirmPin("");

      changeStep("otp", "backward");

      return;
    }
  };

  // -------------------------------------------------------
  // RESEND OTP
  // -------------------------------------------------------

  const handleResendOtp = async () => {
    setOtp("");

    await sendOtp();
  };

  // -------------------------------------------------------
  // STEP
  // -------------------------------------------------------

  const currentStep = step === "otp" ? 1 : 2;
  //PIN STEPS
  const handlePinNext = () => {
    if (pin.length !== 6) {
      return;
    }

    setConfirmPin("");
    setPinStep("confirm");

    animateStep("forward");
  };
  const handlePinBack = () => {
    if (pinStep === "confirm") {
      setConfirmPin("");
      setPinStep("create");
      animateStep("backward");
      return;
    }

    setResetToken("");
    setPin("");
    setConfirmPin("");

    changeStep("otp", "backward");
  };
  // -------------------------------------------------------
  // LOADING
  // -------------------------------------------------------

  const isLoading = isSendingOtp || isVerifyingOtp || isResettingPin;

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------

  return (
    <AuthLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="
          flex-1
        "
      >
        {/* ---------------------------------------------
            HEADER
        ---------------------------------------------- */}

        <View
          className="
            px-5 pt-3
          "
        >
          {step === "pin" && (
            <TouchableOpacity
              onPress={handleBack}
              className="
                w-10 h-10
                mb-4
                bg-slate-100
                rounded-full
                items-center justify-center
              "
            >
              <ArrowLeft size={21} color="#0F172A" />
            </TouchableOpacity>
          )}

          <AuthHeader
            title={step === "otp" ? "Verify Your Identity" : "Create New PIN"}
            subtitle={
              step === "otp"
                ? "Enter the verification code sent to your registered email."
                : "Create a new 6-digit PIN to secure your wallet."
            }
          />

          {/* -------------------------------------------
              STEP INDICATOR
          -------------------------------------------- */}

          <View
            className="
              flex-row
              mt-6
              items-center
            "
          >
            {[1, 2].map((item, index) => {
              const active = item <= currentStep;

              const completed = item < currentStep;

              return (
                <React.Fragment key={item}>
                  <View
                    className={`
                      w-8 h-8
                      rounded-full
                      items-center justify-center
                      ${active ? "bg-primary" : "bg-slate-200"}
                    `}
                  >
                    {completed ? (
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

                  {index === 0 && (
                    <View
                      className={`
                        flex-1
                        h-1
                        mx-2
                        rounded-full
                        ${currentStep === 2 ? "bg-primary" : "bg-slate-200"}
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
                STEP 1 — OTP
            ========================================== */}

            {step === "otp" && (
              <View>
                {/* -------------------------------------
                    Security information
                -------------------------------------- */}

                <View
                  className="
                    flex-row
                    p-4 mb-5
                    bg-softGreen
                    rounded-2xl
                    items-center
                  "
                >
                  <View
                    className="
                      w-10 h-10
                      mr-3
                      bg-white
                      rounded-full
                      items-center justify-center
                    "
                  >
                    <ShieldCheck size={21} color="#10644D" />
                  </View>

                  <View
                    className="
                      flex-1
                    "
                  >
                    <Text
                      className="
                        text-primary font-bold text-sm
                      "
                    >
                      Security verification
                    </Text>

                    <Text
                      className="
                        mt-1
                        text-slate-500 text-xs leading-5
                      "
                    >
                      We've sent a 6-digit code to your registered email.
                    </Text>
                  </View>
                </View>

                {/* -------------------------------------
                    OTP
                -------------------------------------- */}

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

                <View
                  className="
                    mt-6
                  "
                >
                  <PrimaryButton
                    title="Verify Code"
                    onPress={handleVerifyOtp}
                    disabled={otp.length !== 6 || !otpSent}
                  />
                </View>

                {/* -------------------------------------
                    Resend
                -------------------------------------- */}

                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={isSendingOtp}
                  className="
                    mt-5
                    items-center
                  "
                >
                  <Text
                    className="
                      text-primary font-semibold
                    "
                  >
                    {isSendingOtp
                      ? "Sending..."
                      : "Didn't receive the code? Resend"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* =========================================
                STEP 2 — PIN
            ========================================== */}

            {step === "pin" && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  className="
                    mb-6
                    items-center
                  "
                >
                  <View
                    className="
                      w-14 h-14
                      mb-3
                      bg-softGreen
                      rounded-full
                      items-center justify-center
                    "
                  >
                    <CheckCircle2 size={28} color="#10644D" />
                  </View>

                  <Text
                    className="
                      text-slate-600 text-center text-sm
                    "
                  >
                    Identity verified. Let's secure your wallet with a new PIN.
                  </Text>
                </View>

                {/* =========================================
        CREATE PIN
    ========================================== */}

                {pinStep === "create" && (
                  <View>
                    <Text
                      className="
                        mb-3
                        text-slate-700 font-semibold text-center
                      "
                    >
                      Create your new PIN
                    </Text>

                    <Text
                      className="
                        mb-6
                        text-slate-400 text-xs text-center
                      "
                    >
                      Choose a 6-digit PIN that you can remember.
                    </Text>

                    <PinInput
                      value={pin}
                      onChange={(value) =>
                        setPin(value.replace(/\D/g, "").slice(0, 6))
                      }
                    />

                    <View
                      className="
                        mt-7
                      "
                    >
                      <PrimaryButton
                        title="Continue"
                        onPress={handlePinNext}
                        disabled={pin.length !== 6}
                      />
                    </View>
                  </View>
                )}

                {/* =========================================
        CONFIRM PIN
    ========================================== */}

                {pinStep === "confirm" && (
                  <View>
                    <Text
                      className="
                        mb-3
                        text-slate-700 font-semibold text-center
                      "
                    >
                      Confirm your new PIN
                    </Text>

                    <Text
                      className="
                        mb-6
                        text-slate-400 text-xs text-center
                      "
                    >
                      Enter the same PIN again to confirm.
                    </Text>

                    <PinInput
                      value={confirmPin}
                      onChange={(value) =>
                        setConfirmPin(value.replace(/\D/g, "").slice(0, 6))
                      }
                    />

                    {confirmPin.length === 6 && pin !== confirmPin && (
                      <Text
                        className="
                          mt-3
                          text-red-500 text-sm text-center
                        "
                      >
                        PINs do not match.
                      </Text>
                    )}

                    <View
                      className="
                        mt-7
                      "
                    >
                      <PrimaryButton
                        title="Reset PIN"
                        onPress={handleResetPin}
                        disabled={
                          confirmPin.length !== 6 ||
                          pin !== confirmPin ||
                          !resetToken
                        }
                      />
                    </View>

                    <TouchableOpacity
                      onPress={handlePinBack}
                      className="
                        mt-5
                        items-center
                      "
                    >
                      <Text
                        className="
                          text-primary font-semibold
                        "
                      >
                        Change PIN
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}
          </AuthBottomCard>
        </Animated.View>

        {/* ---------------------------------------------
            LOADER
        ---------------------------------------------- */}

        <AppLoader visible={isLoading} message="Loading..." />
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}
