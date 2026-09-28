import React from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Check,
  X,
} from "lucide-react-native";

import Text from "@/components/ui/Text/Text";

type TransactionType = "income" | "expense" | "transfer";

interface TransactionFilterModalProps {
  visible: boolean;
  selectedType: TransactionType | "all";
  onSelect: (type: TransactionType | "all") => void;
  onClose: () => void;
}

const FILTERS: {
  value: TransactionType | "all";
  label: string;
  description: string;
}[] = [
  {
    value: "all",
    label: "All transactions",
    description: "Show income, expenses and transfers",
  },
  {
    value: "income",
    label: "Income",
    description: "Money received into this account",
  },
  {
    value: "expense",
    label: "Expenses",
    description: "Money spent from this account",
  },
  {
    value: "transfer",
    label: "Transfers",
    description: "Money transferred between accounts",
  },
];

export default function TransactionFilterModal({
  visible,
  selectedType,
  onSelect,
  onClose,
}: TransactionFilterModalProps) {
  const getIcon = (type: TransactionType | "all") => {
    switch (type) {
      case "income":
        return ArrowDownLeft;
      case "expense":
        return ArrowUpRight;
      case "transfer":
        return ArrowLeftRight;
      default:
        return null;
    }
  };

  const getIconColor = (type: TransactionType | "all") => {
    switch (type) {
      case "income":
        return "#10B981";
      case "expense":
        return "#EF4444";
      case "transfer":
        return "#10644D";
      default:
        return "#64748B";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-[28px] bg-background px-5 pb-8 pt-5 dark:bg-background-dark">
          {/* Header */}
          <View className="mb-5 flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-text dark:text-text-dark">
                Filter transactions
              </Text>

              <Text className="mt-1 text-sm text-textMuted dark:text-textMuted-dark">
                Choose the transactions you want to see
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              className="h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark"
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View className="gap-3">
            {FILTERS.map((filter) => {
              const Icon = getIcon(filter.value);
              const isSelected = selectedType === filter.value;
              const iconColor = getIconColor(filter.value);

              return (
                <TouchableOpacity
                  key={filter.value}
                  activeOpacity={0.8}
                  onPress={() => onSelect(filter.value)}
                  className={`flex-row items-center rounded-2xl border p-4 ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-transparent bg-white dark:bg-surface-dark"
                  }`}
                >
                  {/* Icon */}
                  <View
                    className={`h-11 w-11 items-center justify-center rounded-xl ${
                      isSelected
                        ? "bg-primary/10"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    {Icon ? (
                      <Icon size={19} color={iconColor} />
                    ) : (
                      <View className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                    )}
                  </View>

                  {/* Text */}
                  <View className="ml-3 flex-1">
                    <Text
                      className={`font-semibold ${
                        isSelected
                          ? "text-primary"
                          : "text-text dark:text-text-dark"
                      }`}
                    >
                      {filter.label}
                    </Text>

                    <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
                      {filter.description}
                    </Text>
                  </View>

                  {/* Check */}
                  {isSelected && (
                    <View className="h-7 w-7 items-center justify-center rounded-full bg-primary">
                      <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Apply */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onClose}
            className="mt-6 items-center rounded-2xl bg-primary py-4"
          >
            <Text className="font-bold text-white">Apply filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
