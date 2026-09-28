import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
} from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

import type { Loan } from "@/api/loanApi";

import LoanStatusBadge from "./LoanStatusBadge";

interface LoanCardProps {
  loan: Loan;
  formatCurrency: (amount: string | number, currency?: string) => string;
  onPress?: () => void;
}

export default function LoanCard({
  loan,
  formatCurrency,
  onPress,
}: LoanCardProps) {
  const isLent = loan.loan_type === "lent";

  const Icon = isLent ? ArrowUpRight : ArrowDownLeft;

  const iconColor = isLent ? "#10644D" : "#D97706";

  const formattedRemaining = formatCurrency(
    loan.remaining_amount,
    loan.currency,
  );

  const formattedPrincipal = formatCurrency(
    loan.principal_amount,
    loan.currency,
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="mb-3 rounded-3xl bg-white p-4 dark:bg-slate-900"
    >
      <View className="flex-row items-center">
        <View
          className={`h-11 w-11 items-center justify-center rounded-2xl ${
            isLent ? "bg-primary/10" : "bg-amber-100"
          }`}
        >
          <Icon size={21} color={iconColor} />
        </View>

        <View className="ml-3 flex-1">
          <Text
            numberOfLines={1}
            className="text-base font-semibold text-slate-900 dark:text-white"
          >
            {loan.person}
          </Text>

          <Text className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
            {isLent ? "Money I lent" : "Money I borrowed"}
          </Text>
        </View>

        <ChevronRight size={19} color="#94A3B8" />
      </View>

      <View className="my-4 h-px bg-gray-100 dark:bg-slate-800" />

      <View className="flex-row justify-between">
        <View>
          <Text className="text-xs text-gray-500 dark:text-slate-400">
            Principal
          </Text>

          <Text className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {formattedPrincipal}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-xs text-gray-500 dark:text-slate-400">
            Remaining
          </Text>

          <Text className="mt-1 text-sm font-bold text-primary dark:text-emerald-400">
            {formattedRemaining}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <CalendarDays size={14} color="#94A3B8" />

          <Text className="ml-1.5 text-xs text-gray-500 dark:text-slate-400">
            {loan.payment_date
              ? formatDate(loan.payment_date)
              : "No payment date"}
          </Text>
        </View>

        <LoanStatusBadge status={loan.status} />
      </View>
    </TouchableOpacity>
  );
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
