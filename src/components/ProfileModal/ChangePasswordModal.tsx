import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  X,
} from "lucide-react-native";

import AppView from "@/components/ui/Views/AppView";
import Text from "@/components/ui/Text/Text";
import Input from "@/components/ui/Inputs/TextInput";
import Button from "@/components/ui/Buttons/PrimaryButton";

import { useChangePasswordMutation } from "@/api/authApi";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  visible,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    if (isLoading) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!currentPassword.trim()) {
      Alert.alert("Current password", "Please enter your current password.");
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert("New password", "Please enter your new password.");
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert("Confirm password", "Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Your new password and confirmation password must match.",
      );
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        "Invalid password",
        "Your new password must be different from your current password.",
      );
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      Alert.alert(
        "Password changed",
        "Your password has been changed successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ],
      );
    } catch (error: any) {
      console.log("CHANGE PASSWORD ERROR:", error);

      const message =
        error?.data?.message ||
        error?.data?.errors?.current_password?.[0] ||
        error?.data?.errors?.new_password?.[0] ||
        error?.data?.errors?.confirm_password?.[0] ||
        "Unable to change your password. Please try again.";

      Alert.alert("Unable to change password", message);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <AppView className="flex-1 bg-black/50 justify-end">
        <AppView className=" rounded-t-[28px] overflow-hidden max-h-[92%]">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-4">
            <View className="flex-row items-center flex-1">
              <View className="w-11 h-11 rounded-2xl bg-primary/10 items-center justify-center mr-3">
                <KeyRound size={21} color="#10644D" strokeWidth={2} />
              </View>

              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-900 dark:text-white">
                  Change Password
                </Text>

                <Text className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Update your account password
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 30,
            }}
          >
            {/* Security information */}
            <View className="flex-row items-start rounded-2xl bg-primary/5 dark:bg-primary/10 p-4 mb-5">
              <LockKeyhole
                size={19}
                color="#10644D"
                strokeWidth={2}
                style={{ marginTop: 1 }}
              />

              <Text className="flex-1 ml-3 text-sm leading-5 text-slate-600 dark:text-slate-300">
                Enter your current password and choose a new secure password for
                your WalletFlow account.
              </Text>
            </View>

            {/* Current Password */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Current Password
              </Text>

              <View className="relative">
                <Input
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TouchableOpacity
                  onPress={() => setShowCurrentPassword((value) => !value)}
                  className="absolute right-3 top-0 bottom-0 justify-center px-2"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} color="#64748B" />
                  ) : (
                    <Eye size={20} color="#64748B" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                New Password
              </Text>

              <View className="relative">
                <Input
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TouchableOpacity
                  onPress={() => setShowNewPassword((value) => !value)}
                  className="absolute right-3 top-0 bottom-0 justify-center px-2"
                >
                  {showNewPassword ? (
                    <EyeOff size={20} color="#64748B" />
                  ) : (
                    <Eye size={20} color="#64748B" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Confirm New Password
              </Text>

              <View className="relative">
                <Input
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-3 top-0 bottom-0 justify-center px-2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#64748B" />
                  ) : (
                    <Eye size={20} color="#64748B" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Password requirements */}
            <View className="mb-6">
              <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                PASSWORD SECURITY
              </Text>

              <View className="flex-row items-center mb-1.5">
                <Check
                  size={15}
                  color={newPassword.length >= 8 ? "#10644D" : "#94A3B8"}
                />

                <Text className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                  At least 8 characters
                </Text>
              </View>

              <View className="flex-row items-center">
                <Check
                  size={15}
                  color={
                    newPassword &&
                    confirmPassword &&
                    newPassword === confirmPassword
                      ? "#10644D"
                      : "#94A3B8"
                  }
                />

                <Text className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                  Passwords match
                </Text>
              </View>
            </View>

            {/* Submit */}
            <Button
              title={isLoading ? "Changing Password..." : "Change Password"}
              onPress={handleSubmit}
              disabled={isLoading}
              loading={isLoading}
            />

            <Pressable
              onPress={handleClose}
              disabled={isLoading}
              className="items-center py-4"
            >
              <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Cancel
              </Text>
            </Pressable>
          </ScrollView>
        </AppView>
      </AppView>
    </Modal>
  );
}
