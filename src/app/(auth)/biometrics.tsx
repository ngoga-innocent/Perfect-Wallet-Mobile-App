import { Text, TouchableOpacity, View } from "react-native";

import { Fingerprint } from "lucide-react-native";

import AuthLayout from "@/components/ui/AuthLayout";

import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";

export default function Biometric() {
  return (
    <AuthLayout>
      <View
        className="
          flex-1
          px-8
          items-center justify-center
        "
      >
        <View
          className="
            w-28 h-28
            bg-white/20
            rounded-full
            items-center justify-center
          "
        >
          <Fingerprint size={60} color="white" />
        </View>

        <Text
          className="
            mt-8
            text-white text-3xl font-bold
          "
        >
          Enable Biometrics
        </Text>

        <Text
          className="
            mt-3
            text-white/80 text-center
          "
        >
          Use fingerprint or Face ID for faster login
        </Text>

        <View
          className="
            w-full
            mt-10
          "
        >
          <PrimaryButton title="Enable" onPress={() => {}} />
        </View>

        <TouchableOpacity
          className="
            mt-6
          "
        >
          <Text
            className="
              text-white
            "
          >
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
