import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

interface Props {
  title: string;

  onPress: () => void;

  loading?: boolean;

  disabled?: boolean;

  icon?: React.ReactNode;
}

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className="
        w-full
      "
    >
      {({ pressed }) => (
        <LinearGradient
          colors={["#10644D", "#10B981"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={{
            width: "100%",
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
            height: Dimensions.get("window").height * 0.055,
          }}
          className={`
            h-14
            rounded-2xl
            items-center
            justify-center

            ${pressed ? "opacity-80" : ""}

            ${isDisabled ? "opacity-50" : ""}
          `}
        >
          <View
            className="
              flex-row
              items-center
              justify-center
              gap-2
            "
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                {icon && icon}

                <Text
                  className="
                  text-white
                  font-semibold
                  text-base
                "
                >
                  {title}
                </Text>
              </>
            )}
          </View>
        </LinearGradient>
      )}
    </Pressable>
  );
}
