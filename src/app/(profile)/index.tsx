import React, { useState, useEffect } from "react";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import {
  ChevronRight,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import Input from "@/components/ui/Inputs/TextInput";
import AppHeader from "@/components/ui/Header/AppHeader";
import AppView from "@/components/ui/Views/AppView";
import Text from "@/components/ui/Text/Text";
// import Input from "@/components/ui/Input/Input";
import AppLoader from "@/components/ui/Loader/AppLoader";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetCurrentUserQuery, useLogoutMutation } from "@/api/authApi";
import ChangePasswordModal from "@/components/ProfileModal/ChangePasswordModal";
import { tokenStorage } from "@/utils/storage";
import { logout } from "@/store/slices/authSlice";
import { useUpdateUserProfileMutation } from "@/api/authApi";
import { useAlert } from "@/components/ui/Alert/AlertProvider";
const PRIMARY = "#10644D";

export default function ProfileScreen() {
  const dispatch = useDispatch();

  const { data, isLoading, refetch } = useGetCurrentUserQuery();

  const [ApiLogout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const { execute } = useApiMutation();

  /* ------------------------------------------------------------------------ */
  /* MODALS                                                                   */
  /* ------------------------------------------------------------------------ */

  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [personalInfoVisible, setPersonalInfoVisible] = useState(false);
  const [securityVisible, setSecurityVisible] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* LOGOUT                                                                    */
  /* ------------------------------------------------------------------------ */

  const handleLogout = async () => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();

      if (refreshToken) {
        await execute(() => ApiLogout({ refresh: refreshToken }).unwrap(), {
          showSuccess: true,
          successMessage: "Logged Out",
        });
      }
    } finally {
      await tokenStorage.clearTokens();

      dispatch(logout());

      router.replace("/(auth)/login");
    }
  };

  /* ------------------------------------------------------------------------ */
  /* USER DATA                                                                 */
  /* ------------------------------------------------------------------------ */

  const currentUser = data?.data;

  const firstName = currentUser?.first_name || "";
  const lastName = currentUser?.last_name || "";

  const fullName = `${firstName} ${lastName}`.trim() || "Not Specified";

  const initials =
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() ||
    "WF";

  return (
    <AppView className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Profile" showBack showProfile={false} />

      <AppLoader
        visible={isLoading || isLoggingOut}
        message={isLoading ? "Loading Account ..." : "Logging Out"}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* ================================================================== */}
        {/* PROFILE HEADER                                                     */}
        {/* ================================================================== */}

        <AppView className="items-center rounded-3xl  px-5 py-7">
          {/* Avatar */}
          <AppView className="h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Text className="text-3xl font-extrabold text-primary">
              {initials}
            </Text>
          </AppView>

          {/* Name */}
          <AppView className="mt-4 flex-row items-center">
            <Text
              numberOfLines={1}
              className="max-w-[260px] text-xl font-extrabold text-text dark:text-text-dark"
            >
              {fullName}
            </Text>

            {currentUser?.is_active && (
              <ShieldCheck
                size={19}
                color={PRIMARY}
                strokeWidth={2.2}
                style={{ marginLeft: 6 }}
              />
            )}
          </AppView>

          {/* Email */}
          <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {currentUser?.email || "No email address"}
          </Text>

          {/* Edit */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setEditProfileVisible(true)}
            className="mt-5 flex-row items-center rounded-full bg-primary px-5 py-2.5"
          >
            <Pencil size={16} color="#FFFFFF" strokeWidth={2.2} />

            <Text className="ml-2 font-semibold text-white">Edit Profile</Text>
          </TouchableOpacity>
        </AppView>

        {/* ================================================================== */}
        {/* ACCOUNT                                                             */}
        {/* ================================================================== */}

        <SectionTitle title="ACCOUNT" />

        <AppView className="overflow-hidden rounded-2xl">
          <ProfileMenuItem
            label="Personal Information"
            description="Manage your name and contact details"
            icon={UserRound}
            onPress={() => setPersonalInfoVisible(true)}
            showBorder
          />

          <ProfileMenuItem
            label="Password & Security"
            description="Manage your password and security"
            icon={LockKeyhole}
            onPress={() => setSecurityVisible(true)}
          />
        </AppView>

        {/* ================================================================== */}
        {/* CONTACT                                                             */}
        {/* ================================================================== */}

        <SectionTitle title="CONTACT" />

        <AppView className="overflow-hidden rounded-2xl">
          <InfoItem
            icon={Mail}
            label="Email Address"
            value={currentUser?.email || "Not specified"}
          />

          <InfoItem
            icon={Phone}
            label="Phone Number"
            value={currentUser?.phone_number || "Not specified"}
            showBorder
          />
        </AppView>

        {/* ================================================================== */}
        {/* ACCESS & SECURITY                                                   */}
        {/* ================================================================== */}

        <SectionTitle title="ACCESS & SECURITY" />

        {/*<AppView className="overflow-hidden rounded-2xl ">
          <ProfileMenuItem
            label="Active Sessions"
            description="Manage devices signed into your account"
            icon={ShieldCheck}
            onPress={() => router.push("/profile/sessions")}
          />
        </AppView>*/}

        {/* ================================================================== */}
        {/* SIGN OUT                                                            */}
        {/* ================================================================== */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          className="mt-7 flex-row items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-4 dark:border-red-900/40 dark:bg-red-950/20"
        >
          <LogOut size={19} color="#DC2626" strokeWidth={2.2} />

          <Text className="ml-2 font-bold text-red-600 dark:text-red-400">
            Sign Out
          </Text>
        </TouchableOpacity>

        {/* ================================================================== */}
        {/* DELETE                                                              */}
        {/* ================================================================== */}

        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-4 items-center py-2"
        >
          <Text className="text-sm font-medium text-gray-400">
            Delete Account
          </Text>
        </TouchableOpacity>

        <Text className="mt-5 text-center text-xs text-gray-400">
          WalletFlow Account
        </Text>
      </ScrollView>

      {/* ==================================================================== */}
      {/* EDIT PROFILE MODAL                                                   */}
      {/* ==================================================================== */}

      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        refetch={() => refetch()}
        firstName={firstName}
        lastName={lastName}
        email={currentUser?.email || ""}
        phone={currentUser?.phone_number || ""}
      />

      {/* ==================================================================== */}
      {/* PERSONAL INFORMATION MODAL                                           */}
      {/* ==================================================================== */}

      <PersonalInformationModal
        visible={personalInfoVisible}
        onClose={() => setPersonalInfoVisible(false)}
        firstName={firstName}
        lastName={lastName}
        email={currentUser?.email || ""}
        phone={currentUser?.phone_number || ""}
      />

      {/* ==================================================================== */}
      {/* SECURITY MODAL                                                        */}
      {/* ==================================================================== */}

      <ChangePasswordModal
        visible={securityVisible}
        onClose={() => setSecurityVisible(false)}
      />
    </AppView>
  );
}

/* ========================================================================= */
/* SECTION TITLE                                                             */
/* ========================================================================= */

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="mb-2 mt-7 px-1 text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400">
      {title}
    </Text>
  );
}

/* ========================================================================= */
/* PROFILE MENU ITEM                                                         */
/* ========================================================================= */

interface ProfileMenuItemProps {
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
  showBorder?: boolean;
}

function ProfileMenuItem({
  label,
  description,
  icon: Icon,
  onPress,
  showBorder = false,
}: ProfileMenuItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`flex-row items-center px-4 py-4 ${
        showBorder ? "border-b border-gray-100 dark:border-gray-800" : ""
      }`}
    >
      <AppView className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <Icon size={21} color={PRIMARY} strokeWidth={2} />
      </AppView>

      <AppView className="ml-3 flex-1">
        <Text className="font-semibold text-text dark:text-text-dark">
          {label}
        </Text>

        <Text
          numberOfLines={1}
          className="mt-0.5 text-xs text-gray-500 dark:text-gray-400"
        >
          {description}
        </Text>
      </AppView>

      <ChevronRight size={19} color="#9CA3AF" strokeWidth={2} />
    </TouchableOpacity>
  );
}

/* ========================================================================= */
/* INFO ITEM                                                                 */
/* ========================================================================= */

function InfoItem({
  icon: Icon,
  label,
  value,
  showBorder = false,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  showBorder?: boolean;
}) {
  return (
    <AppView
      className={`flex-row items-center px-4 py-4  ${
        showBorder ? "border-b border-gray-100 dark:border-gray-800" : ""
      }`}
    >
      <AppView className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Icon size={19} color={PRIMARY} strokeWidth={2} />
      </AppView>

      <AppView className="ml-3 flex-1">
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </Text>

        <Text
          numberOfLines={1}
          className="mt-0.5 font-medium text-text dark:text-text-dark"
        >
          {value}
        </Text>
      </AppView>
    </AppView>
  );
}

/* ========================================================================= */
/* MODAL CONTAINER                                                           */
/* ========================================================================= */

function ProfileModal({
  visible,
  onClose,
  title,
  subtitle,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <AppView className="max-h-[92%] rounded-t-[32px] bg-background px-5 pb-8 pt-4 dark:bg-background-dark">
          {/* Handle */}
          <AppView className="mb-4 items-center">
            <AppView className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
          </AppView>

          {/* Header */}
          <AppView className="mb-5 flex-row items-center justify-between">
            <AppView className="flex-1 pr-4">
              <Text className="text-xl font-extrabold text-text dark:text-text-dark">
                {title}
              </Text>

              {subtitle && (
                <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </Text>
              )}
            </AppView>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800"
            >
              <X size={20} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </AppView>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </AppView>
      </View>
    </Modal>
  );
}

/* ========================================================================= */
/* EDIT PROFILE MODAL                                                        */
/* ========================================================================= */

function EditProfileModal({
  visible,
  onClose,
  firstName,
  lastName,
  email,
  phone,
  refetch,
}: {
  visible: boolean;
  onClose: () => void;
  refetch: () => void;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) {
  const [firstNameValue, setFirstNameValue] = useState(firstName);
  const [lastNameValue, setLastNameValue] = useState(lastName);
  const [emailValue, setEmailValue] = useState(email);
  const [phoneValue, setPhoneValue] = useState(phone);

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { execute } = useApiMutation();
  const { showAlert } = useAlert();
  useEffect(() => {
    if (visible) {
      setFirstNameValue(firstName);
      setLastNameValue(lastName);
      setEmailValue(email);
      setPhoneValue(phone);
    }
  }, [visible, firstName, lastName, email, phone]);

  const handleSave = async () => {
    if (!firstNameValue.trim()) {
      showAlert({
        title: "First name required,",
        message: "Please enter your first name.",
        type: "error",
      });
      return;
    }

    if (!lastNameValue.trim()) {
      showAlert({
        title: "Last name required",
        message: "Please enter your last name.",
        type: "error",
      });
      return;
    }

    try {
      await execute(
        () =>
          updateUserProfile({
            first_name: firstNameValue.trim(),
            last_name: lastNameValue.trim(),

            phone_number: phoneValue.trim(),
          }).unwrap(),
        {
          successMessage: "Your Profile has been updated successfully",
        },
      );

      showAlert({
        title: "Profile Updated",
        message: "Your profile has been updated successfully.",
        type: "success",
      });
      onClose();
      refetch();
    } catch (error: any) {
      console.log("UPDATE PROFILE ERROR:", error);

      const message =
        error?.data?.message ||
        error?.data?.errors?.detail ||
        "Unable to update your profile. Please try again.";

      showAlert({
        title: "Update Failed",
        message: message,
        type: "error",
      });
    }
  };

  return (
    <ProfileModal
      visible={visible}
      onClose={onClose}
      title="Edit Profile"
      subtitle="Update your basic account information"
    >
      <AppView className="gap-4">
        <Input
          label="First Name"
          value={firstNameValue}
          onChangeText={setFirstNameValue}
          placeholder="Enter your first name"
          editable={!isLoading}
        />

        <Input
          label="Last Name"
          value={lastNameValue}
          onChangeText={setLastNameValue}
          placeholder="Enter your last name"
          editable={!isLoading}
        />

        <Input
          label="Email Address"
          value={emailValue}
          onChangeText={setEmailValue}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <Input
          label="Phone Number"
          value={phoneValue}
          onChangeText={setPhoneValue}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          editable={!isLoading}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={isLoading}
          className={`mt-2 items-center rounded-2xl bg-primary py-4 ${
            isLoading ? "opacity-60" : ""
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="font-bold text-white">Save Changes</Text>
          )}
        </TouchableOpacity>
      </AppView>
    </ProfileModal>
  );
}

/* ========================================================================= */
/* PERSONAL INFORMATION MODAL                                                */
/* ========================================================================= */

function PersonalInformationModal({
  visible,
  onClose,
  firstName,
  lastName,
  email,
  phone,
}: {
  visible: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) {
  return (
    <ProfileModal
      visible={visible}
      onClose={onClose}
      title="Personal Information"
      subtitle="Information associated with your WalletFlow account"
    >
      <AppView className="gap-3">
        <DetailRow
          icon={UserRound}
          label="First Name"
          value={firstName || "Not specified"}
        />

        <DetailRow
          icon={UserRound}
          label="Last Name"
          value={lastName || "Not specified"}
        />

        <DetailRow
          icon={Mail}
          label="Email Address"
          value={email || "Not specified"}
        />

        <DetailRow
          icon={Phone}
          label="Phone Number"
          value={phone || "Not specified"}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            onClose();
          }}
          className="mt-3 flex-row items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 py-4"
        >
          <Pencil size={17} color={PRIMARY} strokeWidth={2.2} />

          <Text className="ml-2 font-bold text-primary">Close</Text>
        </TouchableOpacity>
      </AppView>
    </ProfileModal>
  );
}

/* ========================================================================= */
/* DETAIL ROW                                                                */
/* ========================================================================= */

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
}) {
  return (
    <AppView className="flex-row items-center rounded-2xl  p-4 border-b-2 border-b-white">
      <AppView className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <Icon size={20} color={PRIMARY} strokeWidth={2} />
      </AppView>

      <AppView className="ml-3 flex-1">
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </Text>

        <Text className="mt-1 font-semibold text-text dark:text-text-dark">
          {value}
        </Text>
      </AppView>
    </AppView>
  );
}

/* ========================================================================= */
/* SECURITY MODAL                                                            */
/* ========================================================================= */

function SecurityModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    /*
     * Connect this to your change-password RTK Query
     * mutation when the backend endpoint is ready.
     */
    onClose();
  };

  return (
    <ProfileModal
      visible={visible}
      onClose={onClose}
      title="Password & Security"
      subtitle="Keep your WalletFlow account secure"
    >
      {/* Security status */}
      <AppView className="mb-5 flex-row items-center rounded-2xl border border-primary/10 bg-primary/5 p-4">
        <AppView className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <ShieldCheck size={22} color={PRIMARY} strokeWidth={2} />
        </AppView>

        <AppView className="ml-3 flex-1">
          <Text className="font-bold text-text dark:text-text-dark">
            Account Security
          </Text>

          <Text className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Update your password regularly to protect your account.
          </Text>
        </AppView>
      </AppView>

      {/* Change password */}
      <Text className="mb-3 text-sm font-bold text-text dark:text-text-dark">
        Change Password
      </Text>

      <AppView className="gap-4">
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          visible={showCurrentPassword}
          onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          visible={showNewPassword}
          onToggle={() => setShowNewPassword(!showNewPassword)}
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          visible={showConfirmPassword}
          onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleChangePassword}
          className="mt-1 items-center rounded-2xl bg-primary py-4"
        >
          <Text className="font-bold text-white">Update Password</Text>
        </TouchableOpacity>
      </AppView>

      {/* Other security */}
      <Text className="mb-3 mt-7 text-sm font-bold text-text dark:text-text-dark">
        Other Security
      </Text>

      <SecurityOption
        icon={ShieldCheck}
        title="Biometric Authentication"
        description="Use Face ID or fingerprint when available"
        onPress={() => {}}
      />
    </ProfileModal>
  );
}

/* ========================================================================= */
/* PASSWORD INPUT                                                            */
/* ========================================================================= */

function PasswordInput({
  label,
  value,
  onChangeText,
  visible,
  onToggle,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <AppView>
      <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
        {label}
      </Text>

      <AppView className="relative">
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder="••••••••"
          secureTextEntry={!visible}
          // className="pr-12"
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggle}
          className="absolute right-3 top-3 h-10 w-10 items-center justify-center"
        >
          {visible ? (
            <EyeOff size={19} color="#9CA3AF" />
          ) : (
            <Eye size={19} color="#9CA3AF" />
          )}
        </TouchableOpacity>
      </AppView>
    </AppView>
  );
}

/* ========================================================================= */
/* SECURITY OPTION                                                           */
/* ========================================================================= */

function SecurityOption({
  icon: Icon,
  title,
  description,
  onPress,
}: {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center rounded-2xl bg-white p-4 dark:bg-slate-900"
    >
      <AppView className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <Icon size={20} color={PRIMARY} strokeWidth={2} />
      </AppView>

      <AppView className="ml-3 flex-1">
        <Text className="font-semibold text-text dark:text-text-dark">
          {title}
        </Text>

        <Text className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </Text>
      </AppView>

      <ChevronRight size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
