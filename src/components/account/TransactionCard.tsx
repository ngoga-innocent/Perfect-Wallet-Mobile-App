import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  Receipt,
} from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

import Text from "@/components/ui/Text/Text";
import type { Transaction } from "@/api/transactionApi";

interface TransactionCardProps {
  transaction: Transaction;
  currency?: string;
  onPress?: () => void;
}

const TRANSACTION_CONFIG = {
  income: {
    label: "Income",
    icon: ArrowDownLeft,
  },
  expense: {
    label: "Expense",
    icon: ArrowUpRight,
  },
  transfer: {
    label: "Transfer",
    icon: ArrowLeftRight,
  },
  loan: {
    label: "Loan",
    icon: Banknote,
  },
  unknown: {
    label: "Transaction",
    icon: Receipt,
  },
} as const;

export default function TransactionCard({
  transaction,
  currency = "RWF",
  onPress,
}: TransactionCardProps) {
  const transactionType = transaction.transaction_type;

  const config =
    transactionType && transactionType in TRANSACTION_CONFIG
      ? TRANSACTION_CONFIG[transactionType as keyof typeof TRANSACTION_CONFIG]
      : TRANSACTION_CONFIG.unknown;

  const Icon = config.icon;

  const isIncome = transactionType === "income";
  const isTransfer = transactionType === "transfer";
  const isLoan = transactionType === "loan";

  const amount = Number(transaction.amount);

  const formattedAmount = new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

  const formattedDate = new Intl.DateTimeFormat("en-RW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(transaction.transaction_date));

  const amountPrefix = isIncome ? "+" : isTransfer || isLoan ? "" : "-";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      disabled={!onPress}
      className="flex-row items-center rounded-2xl bg-white p-4 dark:bg-surface-dark"
    >
      {/* Transaction icon */}

      <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <Icon size={20} color="#10644D" strokeWidth={2} />
      </View>

      {/* Transaction information */}

      <View className="ml-3 flex-1">
        <Text
          numberOfLines={1}
          className="font-semibold text-text dark:text-text-dark"
        >
          {transaction.description || transaction.category || config.label}
        </Text>

        <View className="mt-1 flex-row items-center">
          <Text
            numberOfLines={1}
            className="text-xs text-textMuted dark:text-textMuted-dark"
          >
            {isTransfer
              ? `${transaction.account_name} → ${
                  transaction.destination_account_name ?? "Unknown"
                }`
              : transaction.account_name}
          </Text>
        </View>

        <Text className="mt-1 text-[11px] text-textMuted dark:text-textMuted-dark">
          {formattedDate}
        </Text>
      </View>

      {/* Amount */}

      <View className="ml-3 items-end">
        <Text
          className={`font-bold ${
            isIncome ? "text-primary" : "text-text dark:text-text-dark"
          }`}
        >
          {amountPrefix}
          {formattedAmount}
        </Text>

        <Text className="mt-1 text-[10px] font-medium uppercase tracking-wide text-textMuted dark:text-textMuted-dark">
          {config.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
