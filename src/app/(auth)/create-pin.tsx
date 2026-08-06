import { useState } from "react";

import { Text, View } from "react-native";

import AuthLayout from "@/components/ui/AuthLayout";

import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";
import PinInput from "@/components/ui/Security/PinInput";

export default function CreatePin() {
  const [pin, setPin] = useState("");

  return (
    <AuthLayout>
      <View
        className="
          flex-1
          px-8
          items-center justify-center
        "
      >
        <Text
          className="
            text-3xl font-bold text-white
          "
        >
          Create PIN
        </Text>

        <Text
          className="
            mt-3
            text-white/80 text-center
          "
        >
          Create a PIN for backup login
        </Text>

        <View
          className="
            mt-10
          "
        >
          <PinInput value={pin} onChange={setPin} />
        </View>

        <View
          className="
            w-full
            mt-8
          "
        >
          <PrimaryButton
            title="Continue"
            disabled={pin.length !== 6}
            onPress={() => {
              console.log(pin);
            }}
          />
        </View>
      </View>
    </AuthLayout>
  );
}
