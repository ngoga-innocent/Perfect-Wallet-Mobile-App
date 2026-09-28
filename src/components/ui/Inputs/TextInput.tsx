import {
  TextInput as RNInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LucideIcon } from "lucide-react-native";

import { COLORS } from "@/constants/theme";

import AppView from "../Views/AppView";

interface Props {
  // -------------------------------------------------------
  // Basic
  // -------------------------------------------------------

  label?: string;

  placeholder?: string;

  value: string;

  onChangeText: (text: string) => void;

  // -------------------------------------------------------
  // Icons
  // -------------------------------------------------------

  icon?: LucideIcon;

  rightIcon?: LucideIcon;

  onRightIconPress?: () => void;

  // -------------------------------------------------------
  // Validation
  // -------------------------------------------------------

  error?: string;

  // -------------------------------------------------------
  // Input behavior
  // -------------------------------------------------------

  secureTextEntry?: boolean;

  keyboardType?: any;

  maxLength?: number;

  editable?: boolean;

  autoCapitalize?: "none" | "sentences" | "words" | "characters";

  autoCorrect?: boolean;

  multiline?: boolean;

  numberOfLines?: number;

  returnKeyType?: any;

  textContentType?: any;

  onSubmitEditing?: () => void;

  // -------------------------------------------------------
  // Styling
  // -------------------------------------------------------

  containerClassName?: string;

  inputClassName?: string;
}

export default function TextInput({
  label,

  placeholder,

  value,

  onChangeText,

  icon: Icon,

  rightIcon: RightIcon,

  onRightIconPress,

  error,

  secureTextEntry = false,

  keyboardType = "default",

  maxLength,

  editable = true,

  autoCapitalize = "none",

  autoCorrect = false,

  multiline = false,

  numberOfLines = 1,

  returnKeyType = "done",

  textContentType,

  onSubmitEditing,

  containerClassName = "",

  inputClassName = "",
}: Props) {
  return (
    <View className={`w-full ${containerClassName}`}>
      {/* -------------------------------------------------
          LABEL
      -------------------------------------------------- */}

      {label && (
        <Text
          className="
          text-textPrimary-dark
            dark:text-textPrimary
            font-semibold
            text-sm
            mb-2
          "
        >
          {label}
        </Text>
      )}

      {/* -------------------------------------------------
          INPUT CONTAINER
      -------------------------------------------------- */}

      <AppView
        className={`
          flex-row
          items-center
          min-h-14
          border
          rounded-2xl
          px-4
          ${error ? "border-red-500" : "border-slate-700 dark:border-slate-200"}
          ${!editable ? "opacity-60" : ""}
        `}
      >
        {/* ---------------------------------------------
            LEFT ICON
        ---------------------------------------------- */}

        {Icon && (
          <View
            className="
              mr-3
              items-center
              justify-center
            "
          >
            <Icon size={20} color={error ? "#EF4444" : COLORS.textLight} />
          </View>
        )}

        {/* ---------------------------------------------
            TEXT INPUT
        ---------------------------------------------- */}

        <RNInput
          className={`
            flex-1
            text-base
            text-textPrimary
            dark:text-textPrimary-dark
            py-0
            ${inputClassName}
          `}
          placeholder={placeholder}
          placeholderTextColor={"#94A3B8"}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          returnKeyType={returnKeyType}
          textContentType={textContentType}
          onSubmitEditing={onSubmitEditing}
        />

        {/* ---------------------------------------------
            RIGHT ICON
        ---------------------------------------------- */}

        {RightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            activeOpacity={0.7}
            className="
              ml-3
              w-8
              h-8
              items-center
              justify-center
            "
          >
            <RightIcon size={20} color={error ? "#EF4444" : COLORS.textLight} />
          </TouchableOpacity>
        )}
      </AppView>

      {/* -------------------------------------------------
          ERROR
      -------------------------------------------------- */}

      {error && (
        <Text
          className="
            text-red-500
            text-xs
            mt-1
          "
        >
          {error}
        </Text>
      )}
    </View>
  );
}
