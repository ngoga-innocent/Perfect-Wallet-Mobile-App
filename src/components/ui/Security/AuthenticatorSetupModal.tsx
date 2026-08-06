import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useState } from "react";

import QRCode from "react-native-qrcode-svg";

import { Copy, ShieldCheck } from "lucide-react-native";

interface Props {
  visible: boolean;

  secret: string;

  otpauthUrl: string;

  onVerify: (code: string) => void;

  onClose: () => void;
}

export default function AuthenticatorSetupModal({
  visible,

  secret,

  otpauthUrl,

  onVerify,

  onClose,
}: Props) {
  const [code, setCode] = useState("");

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
            px-6 pt-8 pb-10
            bg-white
            rounded-t-[40px]
          "
        >
          <View
            className="
              items-center
            "
          >
            <View
              className="
                w-16 h-16
                bg-primary/10
                rounded-full
                items-center justify-center
              "
            >
              <ShieldCheck size={32} color="#10644D" />
            </View>

            <Text
              className="
                mt-5
                text-2xl font-bold
              "
            >
              Setup Authenticator
            </Text>

            <Text
              className="
                mt-2
                text-slate-500 text-center
              "
            >
              Scan this QR code using Google Authenticator
            </Text>
          </View>

          <View
            className="
              mt-6
              items-center
            "
          >
            <QRCode value={otpauthUrl} size={180} />
          </View>

          <Text
            className="
              mt-6
              text-center text-slate-500
            "
          >
            Can't scan?
          </Text>

          <View
            className="
              p-4 mt-3
              bg-slate-100
              rounded-2xl
            "
          >
            <Text
              selectable
              className="
                text-center font-bold tracking-widest text-primary
              "
            >
              {secret}
            </Text>
          </View>

          <TouchableOpacity
            className="
              flex-row
              mt-3
              justify-center items-center
            "
          >
            <Copy size={18} color="#10644D" />

            <Text
              className="
                ml-2
                text-primary font-semibold
              "
            >
              Copy setup key
            </Text>
          </TouchableOpacity>

          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter 6 digit code"
            keyboardType="number-pad"
            maxLength={6}
            className="
              h-14
              px-5 mt-6
              text-center text-xl
              border border-slate-200 rounded-2xl
            "
          />

          <TouchableOpacity
            onPress={() => onVerify(code)}
            className="
              h-14
              mt-5
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
              Verify & Enable
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
