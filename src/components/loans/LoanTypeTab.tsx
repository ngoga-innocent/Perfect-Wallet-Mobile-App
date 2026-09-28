import { Text, TouchableOpacity, View } from "react-native";

import type { LoanType } from "@/api/loanApi";

type LoanTab = "all" | LoanType;

interface LoanTypeTabsProps {
  value: LoanTab;
  onChange: (value: LoanTab) => void;
}

const tabs: {
  label: string;
  value: LoanTab;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Lent",
    value: "lent",
  },
  {
    label: "Borrowed",
    value: "borrowed",
  },
];

export default function LoanTypeTabs({ value, onChange }: LoanTypeTabsProps) {
  return (
    <View className="flex-row rounded-2xl bg-gray-100 p-1 dark:bg-slate-800">
      {tabs.map((tab) => {
        const active = value === tab.value;

        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onChange(tab.value)}
            activeOpacity={0.8}
            className={`flex-1 items-center rounded-xl py-2.5 ${
              active ? "bg-white dark:bg-slate-700" : ""
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                active
                  ? "text-primary dark:text-white"
                  : "text-gray-500 dark:text-slate-400"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
