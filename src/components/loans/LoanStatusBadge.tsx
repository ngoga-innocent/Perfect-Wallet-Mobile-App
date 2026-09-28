import { CircleCheck } from "lucide-react-native";
import { Text, View } from "react-native";

import type { LoanStatus } from "@/api/loanApi";

interface LoanStatusBadgeProps {
  status: LoanStatus;
}

export default function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  const isPaid = status === "paid";

  return (
    <View
      className={`flex-row items-center rounded-full px-3 py-1 ${
        isPaid ? "bg-emerald-100" : "bg-amber-100"
      }`}
    >
      <CircleCheck size={13} color={isPaid ? "#059669" : "#D97706"} />

      <Text
        className={`ml-1.5 text-xs font-semibold ${
          isPaid ? "text-emerald-700" : "text-amber-700"
        }`}
      >
        {isPaid ? "Paid" : "Active"}
      </Text>
    </View>
  );
}
