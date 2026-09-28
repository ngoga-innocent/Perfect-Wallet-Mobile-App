import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { X } from "lucide-react-native";
import { useState } from "react";
import Text from "@/components/ui/Text/Text";
import TextInput from "../ui/Inputs/TextInput";
import {
  ACCOUNT_TYPES,
  useCreateAccountMutation,
  type AccountType,
} from "@/api/accountApi";

interface AccountFormModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AccountFormModal({
  visible,
  onClose,
}: AccountFormModalProps) {
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<AccountType | null>(null);

  const [createAccount, { isLoading }] = useCreateAccountMutation();

  const resetForm = () => {
    setName("");
    setAccountType(null);
  };

  const handleClose = () => {
    if (isLoading) return;

    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    const trimmedName = name.trim();

    if (!trimmedName || !accountType) {
      return;
    }

    try {
      await createAccount({
        name: trimmedName,
        account_type: accountType,
        currency: "RWF",
      }).unwrap();

      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create account:", error);
    }
  };

  const canSubmit =
    name.trim().length > 0 && accountType !== null && !isLoading;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          className="absolute inset-0 bg-black/40"
        />

        {/* Sheet */}
        <View className="max-h-[90%] rounded-t-[32px] bg-background px-5 pb-8 pt-5 dark:bg-background-dark">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-xl font-bold text-text dark:text-text-dark">
                Add account
              </Text>

              <Text className="mt-1 text-sm leading-5 text-textMuted dark:text-textMuted-dark">
                Add a place where you keep or manage your money.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              className="h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark"
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="mt-6"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Account name */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
                Account name
              </Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. BK Account"
                // placeholderTextColor="#94A3B8"
                autoCapitalize="words"
                returnKeyType="done"
                // className="rounded-2xl border border-border bg-white px-4 py-4 text-text dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
              />
            </View>

            {/* Account type */}
            <View className="mt-6">
              <Text className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
                Account type
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {ACCOUNT_TYPES.map((type) => {
                  const selected = accountType === type.value;

                  return (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => setAccountType(type.value)}
                      activeOpacity={0.8}
                      className={`rounded-xl border px-4 py-3 ${
                        selected
                          ? "border-primary bg-primary"
                          : "border-border bg-white dark:border-border-dark dark:bg-surface-dark"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selected
                            ? "text-white"
                            : "text-text dark:text-text-dark"
                        }`}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Currency */}
            <View className="mt-6">
              <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
                Currency
              </Text>

              <View className="rounded-2xl border border-border bg-white px-4 py-4 dark:border-border-dark dark:bg-surface-dark">
                <Text className="font-semibold text-text dark:text-text-dark">
                  RWF
                </Text>

                <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
                  Rwandan Franc
                </Text>
              </View>
            </View>

            {/* Information */}
            <View className="mt-5 rounded-2xl bg-primary/10 p-4">
              <Text className="text-sm leading-5 text-text dark:text-text-dark">
                New accounts start with a balance of{" "}
                <Text className="font-bold">RWF 0</Text>. Your balance will
                change automatically as you record transactions.
              </Text>
            </View>

            {/* Create */}
            <TouchableOpacity
              onPress={handleCreate}
              disabled={!canSubmit}
              activeOpacity={0.8}
              className={`mt-7 items-center rounded-2xl py-4 ${
                canSubmit ? "bg-primary" : "bg-primary/40"
              }`}
            >
              <Text className="font-bold text-white">
                {isLoading ? "Creating..." : "Create account"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
