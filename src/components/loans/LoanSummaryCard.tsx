import { ArrowDownLeft, ArrowUpRight, LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

interface LoanSummaryCardProps {
  title: string;
  amount: string;
  subtitle: string;
  type: "lent" | "borrowed";
  icon?: LucideIcon;
}

export default function LoanSummaryCard({
  title,
  amount,
  subtitle,
  type,
  icon: Icon,
}: LoanSummaryCardProps) {
  const DefaultIcon = type === "lent" ? ArrowUpRight : ArrowDownLeft;

  const IconComponent = Icon ?? DefaultIcon;

  return (
    <View className="flex-1 rounded-3xl bg-white p-4 dark:bg-slate-900">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-gray-500 dark:text-slate-400">
          {title}
        </Text>

        <View className="h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <IconComponent size={18} color="#10644D" />
        </View>
      </View>

      <Text
        numberOfLines={1}
        className="text-xl font-bold text-slate-900 dark:text-white"
      >
        {amount}
      </Text>

      <Text className="mt-1 text-xs text-gray-500 dark:text-slate-400">
        {subtitle}
      </Text>
    </View>
  );
}
