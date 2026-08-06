import { Modal, Text, TouchableOpacity, View } from "react-native";

import { useState } from "react";

import PinInput from "@/components/ui/Security/PinInput";

interface Props {
  visible: boolean;

  onClose: () => void;

  onComplete: (pin: string) => void;
}

export default function PinSetupModal({
  visible,

  onClose,

  onComplete,
}: Props) {
  const [pin, setPin] = useState("");

  const submit = () => {
    if (pin.length === 6) {
      onComplete(pin);

      setPin("");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        className="
          flex-1
          bg-black/40
          justify-end
        "
      >
        <View
          className="
            px-6 pt-10 pb-8
            bg-white
            rounded-t-[40px]
          "
        >
          <Text
            className="
              text-2xl font-bold text-dark text-center
            "
          >
            Create Wallet PIN
          </Text>

          <Text
            className="
              mt-2
              text-slate-500 text-center
            "
          >
            This PIN will be used as backup login
          </Text>

          <View
            className="
              mt-8
            "
          >
            <PinInput value={pin} onChange={setPin} />
          </View>

          <TouchableOpacity
            onPress={submit}
            className="
              h-14
              mt-6
              bg-primary
              rounded-2xl
              items-center justify-center
            "
          >
            <Text
              className="
                text-white font-bold
              "
            >
              Save PIN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="
              mt-5
              items-center
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
