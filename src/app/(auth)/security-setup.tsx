import { ScrollView, Text, View } from "react-native";

import AuthLayout from "@/components/ui/AuthLayout";

import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";
import AuthenticatorSetupModal from "@/components/ui/Security/AuthenticatorSetupModal";
import BiometricSetupModal from "@/components/ui/Security/BiometricModal";
import PinSetupModal from "@/components/ui/Security/PinSetupModal";
import SecurityCard from "@/components/ui/Security/Security-Card";
import React, { useState } from "react";

export default function SecuritySetup() {
  const [setupPinModalVisible, setSetupPinModalVisible] = React.useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [authenticatorVisible, setAuthenticatorVisible] = useState(false);
  return (
    <AuthLayout>
      <ScrollView
        className="
          flex-1
          px-6
          flex-col
          flex-nowrap
          
          
        "
      >
        <Text
          className="
            mt-10
            text-3xl font-bold text-white
          "
        >
          Secure Your Wallet
        </Text>

        <Text
          className="
            mt-2
            text-white/80
          "
        >
          Choose your preferred authentication methods
        </Text>

        <View
          className="
            mt-10
          "
        >
          <SecurityCard
            icon="🔐"
            title="Biometric Login"
            description="Use fingerprint or Face ID"
            action="Enable"
            // onPress={() => console.log("Biometric Login")}
            enabled={biometricEnabled}
            onPress={() => setShowBiometric(true)}
          />

          <SecurityCard
            icon="🔢"
            title="Wallet PIN"
            description="Create a backup PIN"
            action="Setup"
            onPress={() => setSetupPinModalVisible(true)}
          />

          <SecurityCard
            icon="🔑"
            title="Authenticator App"
            description="Enable two-factor authentication"
            action="Setup"
            onPress={() => setAuthenticatorVisible(true)}
          />
        </View>

        <PrimaryButton title="Continue" onPress={() => {}} />

        <PinSetupModal
          visible={setupPinModalVisible}
          onClose={() => setSetupPinModalVisible(false)}
          onComplete={(pin) => console.log("PIN set:", pin)}
        />
        <BiometricSetupModal
          visible={showBiometric}
          onClose={() => setShowBiometric(false)}
          onSuccess={() => {
            setBiometricEnabled(true);
          }}
        />
        <AuthenticatorSetupModal
          visible={authenticatorVisible}
          onClose={() => setAuthenticatorVisible(false)}
          secret="SECRET_KEY"
          otpauthUrl="OTPAUTH_URL"
          onVerify={(code) => console.log("Verification code:", code)}
        />
      </ScrollView>
    </AuthLayout>
  );
}
