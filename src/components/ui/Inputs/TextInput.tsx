import { TextInput as RNInput, Text, View } from "react-native";

import { LucideIcon } from "lucide-react-native";

import { COLORS } from "@/constants/theme";

interface Props {
  label: string;

  placeholder?: string;

  value: string;

  onChangeText: (text: string) => void;

  icon?: LucideIcon;

  error?: string;

  secureTextEntry?: boolean;

  keyboardType?: any;
}

export default function TextInput({
  label,

  placeholder,

  value,

  onChangeText,

  icon: Icon,

  error,

  secureTextEntry,

  keyboardType,
}: Props) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-slate-700 mb-2">{label}</Text>

      <View
        className={`flex-row items-center h-14 bg-white border rounded-2xl px-4 ${
          error ? "border-red-500" : "border-slate-200"
        }`}
      >
        {Icon && <Icon size={20} color={COLORS.textLight} className="mr-3" />}

        <RNInput
          className="flex-1 text-base text-slate-900"
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </View>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
