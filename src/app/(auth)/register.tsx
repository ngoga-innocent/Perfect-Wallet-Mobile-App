import { useState } from "react";

import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  EyeClosed,
  EyeOffIcon,
  LockIcon,
  Mail,
  Phone,
  User,
} from "lucide-react-native";

import { router } from "expo-router";

import AuthLayout from "@/components/ui/AuthLayout";

import AuthHeader from "@/components/ui/Header/AuthHeader";

import AuthBottomCard from "@/components/ui/AuthBottomCard";

import TextInput from "@/components/ui/Inputs/TextInput";

import { useRegisterMutation } from "@/api/authApi";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";
import AppLoader from "@/components/ui/Loader/AppLoader";
import { useApiMutation } from "@/hooks/useApiMutation";
export default function Register() {
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const { execute } = useApiMutation();
  const handleRegister = async () => {
    const result = await execute(
      () =>
        register({
          email,
          password,
          first_name: first_name,
          last_name: last_name,
          phone_number: phone,
          password_confirmation: confirm,
        }).unwrap(),

      {
        showSuccess: true,
        successMessage: "Welcome Perfect Wallet Mobile App!",
      },
    );

    if (!result.success) return;
    router.replace("/(auth)/login");
  };
  return (
    <AuthLayout>
      <View className="flex-1">
        <AuthHeader
          title="Create Account"
          subtitle="Join Perfect Wallet and manage your money"
        />
        <AppLoader visible={isLoading} message="Creating your account..." />

        <AuthBottomCard>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{
              paddingBottom: Dimensions.get("window").height * 0.1,
            }}
          >
            <TextInput
              label="First Name"
              placeholder="John"
              value={first_name}
              onChangeText={setFirstName}
              icon={User}
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              value={last_name}
              onChangeText={setLastName}
              icon={User}
            />

            <TextInput
              label="Email"
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              icon={Mail}
            />

            <TextInput
              label="Phone Number"
              placeholder="+250..."
              value={phone}
              onChangeText={setPhone}
              icon={Phone}
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

            <TextInput
              label="Password"
              value={confirm}
              onChangeText={setConfirm}
              icon={LockIcon}
              placeholder="Enter your Password"
              rightIcon={!showPassword ? EyeClosed : EyeOffIcon}
              secureTextEntry={showPassword}
              onRightIconPress={() => setShowPassword((value) => !value)}
              containerClassName="mb-2"
            />

            <PrimaryButton
              title="Create Account"
              loading={isLoading}
              onPress={() => handleRegister()}
            />

            <View className="flex-row justify-center mt-8">
              <Text className="text-slate-500">Already have an account?</Text>

              <TouchableOpacity onPress={() => router.back()}>
                <Text className="ml-1 text-primary font-bold">Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </AuthBottomCard>
      </View>
    </AuthLayout>
  );
}
