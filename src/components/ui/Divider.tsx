import { Text, View } from "react-native";

export default function Divider() {
  return (
    <View className="flex-row items-center my-6">
      <View className="flex-1 h-px bg-slate-200" />

      <Text className="mx-4 text-slate-400">OR</Text>

      <View className="flex-1 h-px bg-slate-200" />
    </View>
  );
}
