import {
  MoreVertical,
  Wallet,
  Building2,
  Smartphone,
  Banknote,
  PiggyBank,
  CreditCard,
  ChevronRight,
} from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

import Text from "@/components/ui/Text/Text";
import type { Account } from "@/api/accountApi";

interface AccountCardProps {
  account: Account;
  onDelete: () => void;
  onPress: () => void;
}

const PRIMARY = "#10644D";

type AccountTheme = {
  icon: any;
  iconColor: string;
  iconBackground: string;
  accent: string;
  softBackground: string;
};

const getAccountTheme = (type?: string): AccountTheme => {
  const normalized = type?.toLowerCase() || "";

  if (
    normalized.includes("bank") ||
    normalized.includes("equity") ||
    normalized.includes("bk")
  ) {
    return {
      icon: Building2,
      iconColor: "#2563EB",
      iconBackground: "bg-blue-50 dark:bg-blue-950",
      accent: "#2563EB",
      softBackground: "bg-blue-50/60 dark:bg-blue-950/30",
    };
  }

  if (
    normalized.includes("mobile") ||
    normalized.includes("momo") ||
    normalized.includes("airtel")
  ) {
    return {
      icon: Smartphone,
      iconColor: "#7C3AED",
      iconBackground: "bg-purple-50 dark:bg-purple-950",
      accent: "#7C3AED",
      softBackground: "bg-purple-50/60 dark:bg-purple-950/30",
    };
  }

  if (normalized.includes("cash")) {
    return {
      icon: Banknote,
      iconColor: "#D97706",
      iconBackground: "bg-amber-50 dark:bg-amber-950",
      accent: "#D97706",
      softBackground: "bg-amber-50/60 dark:bg-amber-950/30",
    };
  }

  if (normalized.includes("saving")) {
    return {
      icon: PiggyBank,
      iconColor: "#0891B2",
      iconBackground: "bg-cyan-50 dark:bg-cyan-950",
      accent: "#0891B2",
      softBackground: "bg-cyan-50/60 dark:bg-cyan-950/30",
    };
  }

  return {
    icon: Wallet,
    iconColor: PRIMARY,
    iconBackground: "bg-primary/10",
    accent: PRIMARY,
    softBackground: "bg-primary/5",
  };
};

const formatAccountType = (type?: string) => {
  if (!type) return "Account";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function AccountCard({
  account,
  onDelete,
  onPress,
}: AccountCardProps) {
  const theme = getAccountTheme(account.account_type);
  const Icon = theme.icon;

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: account.currency || "RWF",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const balance = Number(account.balance || 0);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      className="mt-3 overflow-hidden rounded-[24px] border border-gray-100 bg-white dark:border-gray-800 dark:bg-surface-dark"
    >
      {/* ========================================================= */}
      {/* TOP ACCENT */}
      {/* ========================================================= */}

      <View
        style={{
          height: 3,
          backgroundColor: theme.accent,
        }}
      />

      <View className="p-5">
        {/* ======================================================= */}
        {/* HEADER */}
        {/* ======================================================= */}

        <View className="flex-row items-center">
          {/* ACCOUNT ICON */}

          <View
            className={`h-12 w-12 items-center justify-center rounded-2xl ${theme.iconBackground}`}
          >
            <Icon size={23} color={theme.iconColor} strokeWidth={1.9} />
          </View>

          {/* ACCOUNT INFO */}

          <View className="ml-3 flex-1">
            <Text
              className="text-base font-bold text-text dark:text-text-dark"
              numberOfLines={1}
            >
              {account.name}
            </Text>

            <View className="mt-1 flex-row items-center">
              <Text className="text-xs font-medium text-textMuted dark:text-textMuted-dark">
                {formatAccountType(account.account_type)}
              </Text>

              <View className="mx-2 h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />

              <Text className="text-xs font-medium text-textMuted dark:text-textMuted-dark">
                {account.currency || "RWF"}
              </Text>
            </View>
          </View>

          {/* MENU */}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={(event) => {
              event.stopPropagation?.();
              onDelete();
            }}
            className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800"
          >
            <MoreVertical size={18} color="#64748B" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* ======================================================= */}
        {/* BALANCE */}
        {/* ======================================================= */}

        <View className="mt-6">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-textMuted dark:text-textMuted-dark">
            Available balance
          </Text>

          <View className="mt-1 flex-row items-center justify-between">
            <Text
              className="flex-1 text-[25px] font-extrabold tracking-tight text-text dark:text-text-dark"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatCurrency(account.balance)}
            </Text>

            <View
              className={`ml-3 rounded-full px-3 py-1.5 ${theme.softBackground}`}
            >
              <View className="flex-row items-center">
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.accent,
                  }}
                />

                <Text
                  className="ml-1.5 text-[11px] font-bold"
                  style={{
                    color: theme.accent,
                  }}
                >
                  Active
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ======================================================= */}
        {/* FOOTER */}
        {/* ======================================================= */}

        <View className="mt-5 flex-row items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <View className="flex-row items-center">
            <CreditCard size={15} color="#94A3B8" strokeWidth={1.8} />

            <Text className="ml-2 text-xs font-medium text-textMuted dark:text-textMuted-dark">
              Manage account
            </Text>
          </View>

          <View
            className="h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${theme.accent}12`,
            }}
          >
            <ChevronRight size={17} color={theme.accent} strokeWidth={2} />
          </View>
        </View>
      </View>

      {/* ========================================================= */}
      {/* DECORATIVE ORB */}
      {/* ========================================================= */}

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          right: -32,
          bottom: -42,
          width: 110,
          height: 110,
          borderRadius: 55,
          backgroundColor: `${theme.accent}08`,
        }}
      />
    </TouchableOpacity>
  );
}
