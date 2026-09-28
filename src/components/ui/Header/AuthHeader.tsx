import Logo from "@/components/common/Logo";
import { Text, View } from "react-native";

interface Props {
  title: string;

  subtitle: string;
}

export default function AuthHeader({
  title,

  subtitle,
}: Props) {
  return (
    <View className="items-center mb-8">
      <Logo size={90} />

      <Text className="text-3xl font-bold text-textWhite mt-6">{title}</Text>

      <Text className="text-center text-textWhite mt-2 text-base">
        {subtitle}
      </Text>
    </View>
  );
}
