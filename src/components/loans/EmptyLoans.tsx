import { CircleDollarSign, Plus } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface EmptyLoansProps {
  type: "all" | "lent" | "borrowed";
  onAddLoan: () => void;
}

export default function EmptyLoans({ type, onAddLoan }: EmptyLoansProps) {
  const message =
    type === "lent"
      ? "You haven't lent any money yet."
      : type === "borrowed"
        ? "You haven't borrowed any money yet."
        : "You don't have any loans yet.";

  return (
    <View className="items-center px-8 py-12">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CircleDollarSign size={30} color="#10644D" />
      </View>

      <Text className="mt-4 text-center text-base font-semibold text-slate-900 dark:text-white">
        No loans found
      </Text>

      <Text className="mt-2 text-center text-sm leading-5 text-gray-500 dark:text-slate-400">
        {message}
      </Text>

      <TouchableOpacity
        onPress={onAddLoan}
        activeOpacity={0.8}
        className="mt-5 flex-row items-center rounded-2xl bg-primary px-5 py-3"
      >
        <Plus size={18} color="#FFFFFF" />

        <Text className="ml-2 font-semibold text-white">Add Loan</Text>
      </TouchableOpacity>
    </View>
  );
}
