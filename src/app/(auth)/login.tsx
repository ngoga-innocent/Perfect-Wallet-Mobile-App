import { useState } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Mail } from "lucide-react-native";

import { router } from "expo-router";

import AuthLayout from "@/components/ui/AuthLayout";

import AuthBottomCard from "@/components/ui/AuthBottomCard";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";
import AuthHeader from "@/components/ui/Header/AuthHeader";
import PasswordInput from "@/components/ui/Inputs/PasswordInput";
import TextInput from "@/components/ui/Inputs/TextInput";

export default function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      // RTK Query login will come here

      console.log({
        email,
        password,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Welcome Back 👋"
        subtitle="Login to access your WalletFlow account"
      />

      <AuthBottomCard>
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon={Mail}
        />

        <PasswordInput
          label="Password"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className="self-end mb-6"
          onPress={() => router.push("/(auth)/security-setup")}
        >
          <Text className="text-[#10644D] font-semibold">Forgot Password?</Text>
        </TouchableOpacity>

        <PrimaryButton title="Login" loading={loading} onPress={handleLogin} />

        <View className="flex-row justify-center mt-8">
          <Text className="text-slate-500">Don't have an account?</Text>

          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="ml-1 text-[#10644D] font-bold">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </AuthBottomCard>
    </AuthLayout>
  );
}
