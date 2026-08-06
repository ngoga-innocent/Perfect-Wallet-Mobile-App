import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View
          className="flex-1"
          style={{
            paddingTop: insets.top,
          }}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
