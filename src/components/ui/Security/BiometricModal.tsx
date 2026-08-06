import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";

import * as LocalAuthentication from "expo-local-authentication";

import { Fingerprint } from "lucide-react-native";

interface Props {
  visible: boolean;

  onClose: () => void;

  onSuccess: () => void;
}

export default function BiometricSetupModal({
  visible,

  onClose,

  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const enableBiometric = async () => {
    try {
      setLoading(true);

      setError("");

      // Check device support

      const hasHardware = await LocalAuthentication.hasHardwareAsync();

      if (!hasHardware) {
        setError("Your device does not support biometric authentication");

        return;
      }

      // Check enrolled biometrics

      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!enrolled) {
        setError(
          "Please setup Face ID or Fingerprint in device settings first",
        );

        return;
      }

      // Ask OS authentication

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirm biometric login",

        cancelLabel: "Cancel",

        disableDeviceFallback: false,
      });

      if (result.success) {
        onSuccess();

        onClose();
      } else {
        setError("Authentication failed. Biometrics were not enabled.");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        className="
flex-1
justify-end
bg-black/40
"
      >
        <View
          className="
bg-white
rounded-t-[40px]
px-6
pt-10
pb-8
"
        >
          <View
            className="
items-center
"
          >
            <View
              className="
w-20
h-20
rounded-full
bg-primary/10
items-center
justify-center
"
            >
              <Fingerprint size={42} color="#10644D" />
            </View>

            <Text
              className="
text-2xl
font-bold
text-dark
mt-6
"
            >
              Enable Biometrics
            </Text>

            <Text
              className="
text-center
text-slate-500
mt-2
"
            >
              Use Face ID or Fingerprint for faster WalletFlow login
            </Text>
          </View>

          {error && (
            <Text
              className="
text-red-500
text-center
mt-5
"
            >
              {error}
            </Text>
          )}

          <TouchableOpacity
            onPress={enableBiometric}
            disabled={loading}
            className="
bg-primary
h-14
rounded-2xl
items-center
justify-center
mt-8
"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                className="
text-white
font-bold
"
              >
                Confirm
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="
items-center
mt-5
"
          >
            <Text
              className="
text-slate-500
"
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
