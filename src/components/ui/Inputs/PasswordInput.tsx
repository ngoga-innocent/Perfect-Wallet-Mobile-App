import { useState } from "react";

import { Lock } from "lucide-react-native";

import TextInput from "./TextInput";

interface Props {
  label: string;

  value: string;

  onChangeText: (text: string) => void;
  showPassword?: () => void;
  error?: string;
}

export default function PasswordInput({
  label,

  value,

  onChangeText,
  showPassword,
  error,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder="Enter password"
      secureTextEntry={!show}
      // showPassword={() => setShow(!show)}
      icon={Lock}
    />
  );
}
