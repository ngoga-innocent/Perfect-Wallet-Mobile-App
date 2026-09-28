import React, { useState } from "react";
import { Alert, ScrollView, Switch, TouchableOpacity } from "react-native";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  Coins,
  Fingerprint,
  Info,
  LogOut,
  Moon,
  Shield,
  WalletCards,
} from "lucide-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/constants/theme/ThemeProvider";
import AppHeader from "@/components/ui/Header/AppHeader";
import AppView from "@/components/ui/Views/AppView";
import Text from "@/components/ui/Text/Text";

import ChangePasswordModal from "@/components/ProfileModal/ChangePasswordModal";
import SettingsModal, {
  AppearanceMode,
} from "@/components/Settings/SettingModal";

const PRIMARY = "#10644D";

/*
 * Replace this with the actual support email address.
 *
 * The email is currently also defined inside SettingsModal's
 * mailto link. Once you provide the real address, we can centralize
 * it in one config constant.
 */

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  const [settingsModal, setSettingsModal] = useState<
    "appearance" | "privacy" | "support" | null
  >(null);
  const { mode, setMode } = useTheme();
  /*
   * This should eventually come directly from your existing
   * ThemeProvider.
   *
   * For now it keeps the UI state ready for integration.
   */
  const [appearance, setAppearance] = useState<AppearanceMode>("system");

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of WalletFlow?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            // TODO:
            // Clear auth state/token and redirect to login
          },
        },
      ],
    );
  };

  const handleAppearanceChange = (mode: AppearanceMode) => {
    setAppearance(mode);

    /*
     * Connect this to your existing ThemeProvider here.
     *
     * Example if your provider exposes:
     *
     * setTheme(mode)
     *
     * then:
     *
     * setTheme(mode);
     */
  };

  return (
    <AppView
      style={{
        paddingBottom: insets.bottom * 3.5,
      }}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <AppHeader title="Settings" showBack showProfile={false} />

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* ---------------------------------------------------------------- */}
        {/* PREFERENCES                                                      */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle title="PREFERENCES" />

        <AppView className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900">
          <SettingItem
            icon={Moon}
            title="Appearance"
            description="Choose how WalletFlow looks"
            value={
              mode === "system" ? "System" : mode === "light" ? "Light" : "Dark"
            }
            onPress={() => setSettingsModal("appearance")}
          />

          <SettingItem
            icon={Coins}
            title="Currency"
            description="Default currency for your finances"
            value="RWF"
            showBorder
            onPress={() => {
              // TODO: open currency selector
            }}
          />

          <SettingItem
            icon={Bell}
            title="Notifications"
            description="Financial reminders and alerts"
            showBorder
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: "#D1D5DB",
                  true: "#A7D8CB",
                }}
                thumbColor={notificationsEnabled ? PRIMARY : "#F9FAFB"}
              />
            }
          />
        </AppView>

        {/* ---------------------------------------------------------------- */}
        {/* FINANCE                                                          */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle title="FINANCE" />

        <AppView className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900">
          <SettingItem
            icon={Bell}
            title="Financial Calendar"
            description="Manage payment and income reminders"
            showBorder
            onPress={() => router.push("/(tabs)/more/financial-calendar")}
          />
        </AppView>

        {/* ---------------------------------------------------------------- */}
        {/* SECURITY                                                         */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle title="SECURITY" />

        <AppView className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900">
          {/*<SettingItem
            icon={Fingerprint}
            title="Biometric Authentication"
            description="Use Face ID or fingerprint to unlock"
            right={
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{
                  false: "#D1D5DB",
                  true: "#A7D8CB",
                }}
                thumbColor={biometricsEnabled ? PRIMARY : "#F9FAFB"}
              />
            }
          />*/}

          {/*<SettingItem
            icon={Shield}
            title="Security"
            description="Manage PIN and authentication"
            showBorder
            onPress={() => {
              // TODO: navigate to security settings
            }}
          />*/}

          <SettingItem
            icon={Shield}
            title="Change Password"
            description="Update your account password"
            showBorder
            onPress={() => setChangePasswordVisible(true)}
          />
        </AppView>

        {/* ---------------------------------------------------------------- */}
        {/* APP                                                              */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle title="APP" />

        <AppView className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900">
          <SettingItem
            icon={Shield}
            title="Privacy"
            description="Manage your privacy and data"
            onPress={() => setSettingsModal("privacy")}
          />

          <SettingItem
            icon={CircleHelp}
            title="Help & Support"
            description="Get help with WalletFlow"
            showBorder
            onPress={() => setSettingsModal("support")}
          />

          {/*<SettingItem
            icon={Info}
            title="About WalletFlow"
            description="Version and application information"
            showBorder
            onPress={() => {
              // TODO: about page/modal
            }}
          />*/}
        </AppView>

        {/* ---------------------------------------------------------------- */}
        {/* SIGN OUT                                                         */}
        {/* ---------------------------------------------------------------- */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSignOut}
          className="mb-4 mt-7 flex-row items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-4 dark:border-red-900/40 dark:bg-red-950/20"
        >
          <LogOut size={19} color="#DC2626" strokeWidth={2.2} />

          <Text className="ml-2 font-bold text-red-600 dark:text-red-400">
            Sign Out
          </Text>
        </TouchableOpacity>

        <Text className="mb-8 text-center text-xs text-gray-400">
          WalletFlow
        </Text>
      </ScrollView>

      {/* ---------------------------------------------------------------- */}
      {/* CHANGE PASSWORD                                                   */}
      {/* ---------------------------------------------------------------- */}

      <ChangePasswordModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      />

      {/* ---------------------------------------------------------------- */}
      {/* APPEARANCE / PRIVACY / SUPPORT                                   */}
      {/* ---------------------------------------------------------------- */}

      {settingsModal && (
        <SettingsModal
          visible={Boolean(settingsModal)}
          type={settingsModal}
          appearance={mode}
          onAppearanceChange={setMode}
          onClose={() => setSettingsModal(null)}
        />
      )}
    </AppView>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION TITLE                                                              */
/* -------------------------------------------------------------------------- */

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="mb-2 mt-7 px-1 text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400">
      {title}
    </Text>
  );
}

/* -------------------------------------------------------------------------- */
/* SETTING ITEM                                                               */
/* -------------------------------------------------------------------------- */

interface SettingItemProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  value?: string;
  right?: React.ReactNode;
  showBorder?: boolean;
  onPress?: () => void;
}

function SettingItem({
  icon: Icon,
  title,
  description,
  value,
  right,
  showBorder = false,
  onPress,
}: SettingItemProps) {
  const content = (
    <AppView
      className={`min-h-[68px] flex-row items-center px-4 py-3 ${
        showBorder ? "border-b border-gray-100 dark:border-gray-800" : ""
      }`}
    >
      <AppView className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Icon size={20} color={PRIMARY} strokeWidth={2} />
      </AppView>

      <AppView className="ml-3 flex-1">
        <Text className="font-semibold text-text dark:text-text-dark">
          {title}
        </Text>

        <Text
          numberOfLines={1}
          className="mt-0.5 text-xs text-gray-500 dark:text-gray-400"
        >
          {description}
        </Text>
      </AppView>

      {right ? (
        right
      ) : value ? (
        <AppView className="max-w-[100px] flex-row items-center">
          <Text
            numberOfLines={1}
            className="text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {value}
          </Text>

          {onPress && (
            <ChevronRight
              size={18}
              color="#9CA3AF"
              strokeWidth={2}
              style={{ marginLeft: 4 }}
            />
          )}
        </AppView>
      ) : onPress ? (
        <ChevronRight size={19} color="#9CA3AF" strokeWidth={2} />
      ) : null}
    </AppView>
  );

  if (!onPress) {
    return content;
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
}
