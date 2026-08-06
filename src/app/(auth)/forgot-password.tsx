import { View } from "react-native";

import { Mail } from "lucide-react-native";

import AuthBottomCard from "@/components/ui/AuthBottomCard";
import AuthLayout from "@/components/ui/AuthLayout";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";
import AuthHeader from "@/components/ui/Header/AuthHeader";
import TextInput from "@/components/ui/Inputs/TextInput";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <View className="flex-1">
        <AuthHeader
          title="Forgot Password?"
          subtitle="Enter your email and we will send a reset code"
        />

        <AuthBottomCard>
          <TextInput
            label="Email"
            placeholder="Enter email"
            value=""
            onChangeText={() => {}}
            icon={Mail}
          />

          <PrimaryButton title="Send Code" onPress={() => {}} />
        </AuthBottomCard>
      </View>
    </AuthLayout>
  );
}
