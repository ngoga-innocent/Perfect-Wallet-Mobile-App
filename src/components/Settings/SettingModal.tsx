import React from "react";
import {
  Linking,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Check,
  ChevronRight,
  CircleHelp,
  Info,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react-native";

import AppView from "@/components/ui/Views/AppView";
import Text from "@/components/ui/Text/Text";

const PRIMARY = "#10644D";

export type AppearanceMode = "system" | "light" | "dark";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  type: "appearance" | "privacy" | "support";
  appearance?: AppearanceMode;
  onAppearanceChange?: (mode: AppearanceMode) => void;
}

export default function SettingsModal({
  visible,
  onClose,
  type,
  appearance = "system",
  onAppearanceChange,
}: SettingsModalProps) {
  const handleAppearanceChange = (mode: AppearanceMode) => {
    onAppearanceChange?.(mode);
    onClose();
  };

  const renderAppearance = () => (
    <>
      <ModalHeader
        icon={Sun}
        title="Appearance"
        description="Choose how WalletFlow looks"
        onClose={onClose}
      />

      <View className="px-5 pb-6">
        <Text className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Choose the appearance that works best for you. System follows your
          device settings.
        </Text>

        <AppearanceOption
          icon={SmartphoneIcon}
          title="System"
          description="Follow your device appearance"
          selected={appearance === "system"}
          onPress={() => handleAppearanceChange("system")}
        />

        <AppearanceOption
          icon={Sun}
          title="Light"
          description="Always use light appearance"
          selected={appearance === "light"}
          onPress={() => handleAppearanceChange("light")}
        />

        <AppearanceOption
          icon={Moon}
          title="Dark"
          description="Always use dark appearance"
          selected={appearance === "dark"}
          onPress={() => handleAppearanceChange("dark")}
        />
      </View>
    </>
  );

  const renderPrivacy = () => (
    <>
      <ModalHeader
        icon={ShieldCheck}
        title="Privacy"
        description="Your privacy matters to WalletFlow"
        onClose={onClose}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 35,
        }}
      >
        <PrivacySection
          title="Your Financial Data"
          text="WalletFlow is designed to help you organize and manage your personal financial information. Your accounts, transactions, loans, reminders, and other financial records are associated with your account."
        />

        <PrivacySection
          title="Account Security"
          text="WalletFlow uses authenticated access and security features such as passwords, PIN verification, authenticator verification, and biometric protection where supported."
        />

        <PrivacySection
          title="Personal Information"
          text="Information associated with your WalletFlow account is used to provide and maintain the services available to you."
        />

        <PrivacySection
          title="Notifications"
          text="WalletFlow may use notifications to remind you about financial events, reminders, and other account-related activity according to your notification settings."
        />

        <PrivacySection
          title="Your Control"
          text="You can manage your account information, security settings, notifications, and other preferences from within WalletFlow."
        />

        <View className="mt-2 rounded-2xl bg-primary/5 dark:bg-primary/10 p-4">
          <View className="flex-row items-start">
            <Info size={18} color={PRIMARY} strokeWidth={2} />

            <Text className="ml-3 flex-1 text-xs leading-5 text-gray-600 dark:text-gray-300">
              This section provides general information about privacy within
              WalletFlow. Specific privacy practices may depend on the version
              of the application and services you use.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );

  const renderSupport = () => (
    <>
      <ModalHeader
        icon={CircleHelp}
        title="Help & Support"
        description="We're here to help"
        onClose={onClose}
      />

      <View className="px-5 pb-7">
        <View className="rounded-2xl bg-primary/5 dark:bg-primary/10 p-5 mb-5">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <CircleHelp size={23} color={PRIMARY} strokeWidth={2} />
          </View>

          <Text className="text-lg font-bold text-text dark:text-text-dark">
            Need help?
          </Text>

          <Text className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
            If you have a question, find a problem, or need assistance with your
            WalletFlow account, you can contact our support team.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            Linking.openURL(
              "mailto:ngogainnocent1@gmail.com?subject=WalletFlow%20Support",
            );
          }}
          className="flex-row items-center rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-slate-900"
        >
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Mail size={21} color={PRIMARY} strokeWidth={2} />
          </View>

          <View className="ml-3 flex-1">
            <Text className="font-semibold text-text dark:text-text-dark">
              Email Support
            </Text>

            <Text className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              ngogainnocent1@gmail.com
            </Text>
          </View>

          <ChevronRight size={19} color="#9CA3AF" strokeWidth={2} />
        </TouchableOpacity>

        <Text className="mt-5 text-center text-xs leading-5 text-gray-400">
          When contacting support, please include enough information for us to
          understand the issue without sharing your password, PIN, OTP, or other
          sensitive security information.
        </Text>
      </View>
    </>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <AppView className="flex-1 justify-end bg-black/50">
        <AppView className="max-h-[90%] overflow-hidden rounded-t-[28px] bg-background dark:bg-background-dark">
          {type === "appearance" && renderAppearance()}
          {type === "privacy" && renderPrivacy()}
          {type === "support" && renderSupport()}
        </AppView>
      </AppView>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/* HEADER                                                                      */
/* -------------------------------------------------------------------------- */

interface ModalHeaderProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  onClose: () => void;
}

function ModalHeader({
  icon: Icon,
  title,
  description,
  onClose,
}: ModalHeaderProps) {
  return (
    <View className="flex-row items-center px-5 pb-4 pt-5">
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
        <Icon size={21} color={PRIMARY} strokeWidth={2} />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-lg font-bold text-text dark:text-text-dark">
          {title}
        </Text>

        <Text className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onClose}
        className="h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800"
      >
        <X size={19} color="#64748B" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* APPEARANCE                                                                  */
/* -------------------------------------------------------------------------- */

interface AppearanceOptionProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

function AppearanceOption({
  icon: Icon,
  title,
  description,
  selected,
  onPress,
}: AppearanceOptionProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      className={`mb-3 flex-row items-center rounded-2xl border p-4 ${
        selected
          ? "border-primary bg-primary/5 dark:bg-primary/10"
          : "border-gray-100 bg-white dark:border-gray-800 dark:bg-slate-900"
      }`}
    >
      <View
        className={`h-11 w-11 items-center justify-center rounded-xl ${
          selected ? "bg-primary/10" : "bg-gray-100 dark:bg-slate-800"
        }`}
      >
        <Icon
          size={20}
          color={selected ? PRIMARY : "#64748B"}
          strokeWidth={2}
        />
      </View>

      <View className="ml-3 flex-1">
        <Text className="font-semibold text-text dark:text-text-dark">
          {title}
        </Text>

        <Text className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </Text>
      </View>

      <View
        className={`h-5 w-5 items-center justify-center rounded-full border ${
          selected
            ? "border-primary bg-primary"
            : "border-gray-300 dark:border-gray-600"
        }`}
      >
        {selected && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
      </View>
    </TouchableOpacity>
  );
}

/* -------------------------------------------------------------------------- */
/* PRIVACY                                                                     */
/* -------------------------------------------------------------------------- */

function PrivacySection({ title, text }: { title: string; text: string }) {
  return (
    <View className="mb-5">
      <Text className="text-sm font-bold text-text dark:text-text-dark">
        {title}
      </Text>

      <Text className="mt-1.5 text-sm leading-5 text-gray-500 dark:text-gray-400">
        {text}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* SIMPLE ICON                                                                 */
/* -------------------------------------------------------------------------- */

function SmartphoneIcon(props: any) {
  return <Info {...props} />;
}
