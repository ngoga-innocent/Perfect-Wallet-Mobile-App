import { TouchableOpacity, View } from "react-native";
import Text from "@/components/ui/Text/Text";
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export default function QuickAction({
  icon,
  label,
  onPress,
}: QuickActionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="items-center "
    >
      <View className="h-12 w-12 items-center justify-center border border-background-dark/20 dark:border-background/50 rounded-2xl bg-white dark:bg-surface-dark">
        {icon}
      </View>

      <Text className="mt-2 text-xs font-medium text-textMuted dark:text-textMuted-dark">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
