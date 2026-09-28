import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import PinInput from "@/components/ui/Security/PinInput";
import { router } from "expo-router";

interface Props {
  visible: boolean;

  mode: "setup" | "verify";

  onClose: () => void;

  onComplete?: (pin: string) => void;

  onVerify?: (pin: string) => void;

  loading?: boolean;

  error?: string;
}

export default function PinModal({
  visible,
  mode,
  onClose,
  onComplete,
  onVerify,
  loading = false,
  error,
}: Props) {
  const [pin, setPin] = useState("");

  const isSetup = mode === "setup";

  const submit = () => {
    if (pin.length !== 6 || loading) {
      return;
    }

    if (isSetup) {
      onComplete?.(pin);
    } else {
      onVerify?.(pin);
    }

    setPin("");
  };

  const handleClose = () => {
    setPin("");
    onClose();
  };

  return (
    <Modal
      visible={loading ? false : visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-primary justify-end">
        <View
          className="
          bg-background
            dark:bg-background-dark
            rounded-t-3xl
            px-6
            pt-7
            pb-10
          "
        >
          {/* Header */}

          <Text
            className="
              text-2xl
              font-bold
              text-slate-900
              dark:text-white
              text-center
            "
          >
            {isSetup ? "Create Wallet PIN" : "Enter Wallet PIN"}
          </Text>

          <Text
            className="
              mt-2
              text-slate-500
              dark:text-slate-400
              text-center
            "
          >
            {isSetup
              ? "This PIN will be used to secure your wallet"
              : "Enter your PIN to verify your identity"}
          </Text>

          {/* PIN */}

          <View className="mt-8">
            <PinInput value={pin} onChange={setPin} />
          </View>

          {/* Error */}

          {error ? (
            <Text
              className="
                mt-3
                text-red-500
                text-center
              "
            >
              {error}
            </Text>
          ) : null}

          {/* Submit */}

          <TouchableOpacity
            onPress={submit}
            disabled={pin.length !== 6 || loading}
            className={`
              h-14
              mt-6
              rounded-2xl
              items-center
              justify-center
              ${
                pin.length === 6 && !loading
                  ? "bg-primary"
                  : "bg-slate-300 dark:bg-slate-700"
              }
            `}
          >
            <Text
              className="
                text-white
                font-bold
              "
            >
              {loading ? "Please wait..." : isSetup ? "Save PIN" : "Verify PIN"}
            </Text>
          </TouchableOpacity>
          {!isSetup && (
            <TouchableOpacity
              onPress={() => router.navigate("/(auth)/forgot-pin")}
              className="h-14
              mt-6
              rounded-2xl
              items-center
              justify-center bg-slate-300 dark:bg-slate-700"
            >
              <Text className="text-white font-bold">Forgot Pin</Text>
            </TouchableOpacity>
          )}

          {/* Cancel */}

          <TouchableOpacity
            onPress={handleClose}
            disabled={loading}
            className="
              mt-5
              items-center
            "
          >
            <Text
              className="
                text-slate-500
                dark:text-slate-400
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
