import { useState } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Mail, Phone, User } from "lucide-react-native";

import { router } from "expo-router";

import AuthLayout from "@/components/ui/AuthLayout";

import AuthHeader from "@/components/ui/Header/AuthHeader";

import AuthBottomCard from "@/components/ui/AuthBottomCard";

import TextInput from "@/components/ui/Inputs/TextInput";

import PasswordInput from "@/components/ui/Inputs/PasswordInput";

import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";

export default function Register() {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");

  const [confirm, setConfirm] = useState("");

  return (
    <AuthLayout>
      <View className="flex-1">
        <AuthHeader
          title="Create Account"
          subtitle="Join WalletFlow and manage your money"
        />

        <AuthBottomCard>
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
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

          <PasswordInput
            label="Password"
            value={password}
            onChangeText={setPassword}
          />

          <PasswordInput
            label="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
          />

          <PrimaryButton title="Create Account" onPress={() => {}} />

          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-500">Already have an account?</Text>

            <TouchableOpacity onPress={() => router.back()}>
              <Text className="ml-1 text-primary font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </AuthBottomCard>
      </View>
    </AuthLayout>
  );
}
