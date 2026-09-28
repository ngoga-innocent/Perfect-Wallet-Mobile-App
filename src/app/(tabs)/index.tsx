import {
  BarChart3,
  CalendarDays,
  CreditCard,
  List,
  Settings,
  WalletCards,
} from "lucide-react-native";

import type { AppDrawerItem } from "@/components/navigations/types";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AppHeader from "@/components/ui/Header/AppHeader";
import { router } from "expo-router";

import { useGetDashboardQuery } from "@/api/dashboardApi";
import AppDrawer from "@/components/navigations/AppDrawer";
import Text from "@/components/ui/Text/Text";
import AppView from "@/components/ui/Views/AppView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LiquidFinancialPattern from "@/components/brand/LiquidFintechPattern";
const PRIMARY = "#10644D";

export default function HomeScreen() {
  const { data, isLoading, isFetching, refetch } = useGetDashboardQuery();

  const drawerItems: AppDrawerItem[] = [
    {
      id: "accounts",
      label: "Accounts",
      description: "Manage your bank, cash and mobile money accounts",
      icon: WalletCards,
      showChevron: true,
      onPress: () => router.push("/(tabs)/accounts"),
    },

    {
      id: "transactions",
      label: "Transactions",
      description: "View and manage your financial activity",
      icon: List,
      showChevron: true,
      onPress: () => router.push("/(tabs)/transactions"),
    },

    {
      id: "loans",
      label: "Loans",
      description: "Track money you lent and borrowed",
      icon: CreditCard,
      showChevron: true,
      onPress: () => router.push("/(tabs)/more/loans"),
    },

    {
      id: "calendar",
      label: "Financial Calendar",
      description: "Keep track of upcoming financial events",
      icon: CalendarDays,
      showChevron: true,
      onPress: () => router.push("/(tabs)/more/financial-calendar"),
    },

    // {
    //   id: "reports",
    //   label: "Financial Reports",
    //   description: "Understand your income and spending",
    //   icon: BarChart3,
    //   showChevron: true,
    //   dividerBefore: true,
    //   onPress: () => {
    //     // Later:
    //     // router.push("/(tabs)/more/reports");
    //   },
    // },

    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      showChevron: true,
      dividerBefore: true,
      onPress: () => router.push("/more/settings"),
    },
  ];

  const insets = useSafeAreaInsets();
  if (isLoading) {
    return (
      <AppView className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color={PRIMARY} />
      </AppView>
    );
  }

  if (!data) {
    return (
      <AppView
        style={{
          paddingTop: insets.top * 1.3,
        }}
        className="flex-1 bg-background dark:bg-background-dark"
      >
        <AppView className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-bold text-text dark:text-text-dark">
            Unable to load dashboard
          </Text>

          <Text className="mt-2 text-center text-textMuted dark:text-textMuted-dark">
            Please check your connection and try again.
          </Text>

          <TouchableOpacity
            onPress={() => refetch()}
            className="mt-5 rounded-xl bg-primary px-6 py-3"
          >
            <Text className="font-bold text-white">Try Again</Text>
          </TouchableOpacity>
        </AppView>
      </AppView>
    );
  }

  const formatAmount = (amount: string | number) => {
    return Number(amount || 0).toLocaleString("en-US");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}`);
    console.log("New Date", dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  const getTransactionTitle = (
    transaction: (typeof data.recent_transactions)[number],
  ) => {
    if (transaction.description?.trim()) {
      return transaction.description;
    }

    if (transaction.type === "income") {
      return "Income";
    }

    if (transaction.type === "expense") {
      return "Expense";
    }

    return "Transfer";
  };

  return (
    <AppView className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Dashboard" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor={PRIMARY}
          />
        }
        contentContainerStyle={{
          paddingBottom: insets.bottom * 3.9,
        }}
      >
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        {/* ========================================================= */}
        {/* TOTAL BALANCE */}
        {/* ========================================================= */}

        <AppView className="mx-5 mt-6 rounded-3xl bg-primary p-6 h-[25vh] justify-center flex flex-col ">
          <LiquidFinancialPattern />
          <Text className="text-white/70 text-sm font-medium">
            Total Balance
          </Text>

          <Text className="mt-2 text-4xl font-bold text-white">
            {data.balance.currency} {formatAmount(data.balance.total)}
          </Text>

          <Text className="mt-2 text-white/70 text-sm">
            Across {data.accounts.count}{" "}
            {data.accounts.count === 1 ? "account" : "accounts"}
          </Text>
        </AppView>

        {/* ========================================================= */}
        {/* INCOME / EXPENSES */}
        {/* ========================================================= */}

        <AppView className="mt-5 flex-row px-5">
          <AppView className="mr-2 flex-1 rounded-2xl bg-white p-4 dark:bg-surface-dark/30">
            <Text className="text-textMuted dark:text-textMuted-dark text-xs">
              Income
            </Text>

            <Text className="mt-2 text-lg font-bold text-primary">
              +{data.balance.currency} {formatAmount(data.summary.income)}
            </Text>

            <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
              This month
            </Text>
          </AppView>

          <AppView className="ml-2 flex-1 rounded-2xl bg-white p-4 dark:bg-surface-dark/30">
            <Text className="text-textMuted dark:text-textMuted-dark text-xs">
              Expenses
            </Text>

            <Text className="mt-2 text-lg font-bold text-orange">
              -{data.balance.currency} {formatAmount(data.summary.expenses)}
            </Text>

            <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
              This month
            </Text>
          </AppView>
        </AppView>

        {/* ========================================================= */}
        {/* NET */}
        {/* ========================================================= */}

        <AppView className="mx-5 mt-4 rounded-2xl bg-white p-5 dark:bg-surface-dark/30">
          <AppView className="flex-row bg-transparent items-center justify-between">
            <AppView className="bg-transparent">
              <Text className="text-textMuted dark:text-textMuted-dark text-xs">
                Net this month
              </Text>

              <Text className="mt-1 text-xl font-bold text-text dark:text-text-dark">
                {data.balance.currency} {formatAmount(data.summary.net)}
              </Text>
            </AppView>

            <AppView
              className={`rounded-full px-3 py-2 ${
                Number(data.summary.net) >= 0 ? "bg-primary" : "bg-red-100"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  Number(data.summary.net) >= 0
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {Number(data.summary.net) >= 0 ? "Positive" : "Negative"}
              </Text>
            </AppView>
          </AppView>
        </AppView>

        {/* ========================================================= */}
        {/* UPCOMING EVENTS */}
        {/* ========================================================= */}

        <AppView className="mt-7 px-5">
          <AppView className="flex-row items-center justify-between ">
            <Text className="text-lg font-bold text-text dark:text-text-dark">
              Upcoming
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/more/financial-calendar")}
            >
              <Text className="text-sm font-semibold text-primary">
                View all
              </Text>
            </TouchableOpacity>
          </AppView>

          {data.upcoming_events.length === 0 ? (
            <AppView className="mt-3 rounded-2xl bg-white p-5 dark:bg-surface-dark/30">
              <Text className="text-textMuted dark:text-textMuted-dark text-sm">
                No upcoming financial events
              </Text>

              <TouchableOpacity
                className="mt-4 self-start rounded-xl bg-primary px-4 py-2"
                onPress={() => router.push("/(tabs)/more/financial-calendar")}
              >
                <Text className="text-sm font-bold text-white">
                  Add reminder
                </Text>
              </TouchableOpacity>
            </AppView>
          ) : (
            <AppView className="mt-3 rounded-xl bg-white dark:bg-surface-dark/30">
              {data.upcoming_events.slice(0, 3).map((event) => (
                <TouchableOpacity
                  key={event.id}
                  activeOpacity={0.75}
                  className="mb-3 flex-row items-center rounded-2xl bg-white p-4 dark:bg-surface-dark/30"
                  onPress={() => router.push("/(tabs)/more/financial-calendar")}
                >
                  <AppView className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
                    <Text className="text-lg">📅</Text>
                  </AppView>

                  <AppView className="flex-1 bg-white dark:bg-surface-dark/30">
                    <Text className="font-semibold text-text dark:text-text-dark">
                      {event.name}
                    </Text>

                    <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
                      {formatDate(event.payment_date)}
                      {event.days_remaining === 0
                        ? " • Today"
                        : event.days_remaining === 1
                          ? " • Tomorrow"
                          : ` • ${event.days_remaining} days`}
                    </Text>
                  </AppView>

                  <Text className="font-bold text-primary">
                    {formatAmount(event.amount)} RWF
                  </Text>
                </TouchableOpacity>
              ))}
            </AppView>
          )}
        </AppView>

        {/* ========================================================= */}
        {/* LOANS */}
        {/* ========================================================= */}

        <AppView className="mt-4 px-5 bg-white p-5 dark:bg-surface-dark/30 rounded-2xl mx-5">
          <AppView className="flex-row items-center bg-transparent justify-between">
            <Text className="text-lg font-bold text-text dark:text-text-dark">
              Loans
            </Text>

            <TouchableOpacity onPress={() => router.push("/(tabs)/more/loans")}>
              <Text className="text-sm font-semibold text-primary">
                View all
              </Text>
            </TouchableOpacity>
          </AppView>

          <AppView className="mt-3 rounded-2xl bg-transparent">
            <AppView className="flex-row bg-white dark:bg-transparent">
              <AppView className="flex-1 bg-white dark:bg-transparent ">
                <Text className="text-xs text-textMuted dark:text-textMuted-dark">
                  You lent
                </Text>

                <Text className="mt-1 font-bold text-primary">
                  RWF {formatAmount(data.loans.lent)}
                </Text>
              </AppView>

              <AppView className="flex-1 bg-white dark:bg-transparent">
                <Text className="text-xs text-textMuted dark:text-textMuted-dark">
                  You borrowed
                </Text>

                <Text className="mt-1 font-bold text-orange">
                  RWF {formatAmount(data.loans.borrowed)}
                </Text>
              </AppView>
            </AppView>

            <AppView className="mt-4 bg-white dark:bg-transparent border-t border-gray-100 pt-4 dark:border-gray-800">
              <Text className="text-xs text-textMuted dark:text-textMuted-dark">
                Total outstanding
              </Text>

              <Text className="mt-1 text-lg font-bold text-text dark:text-text-dark">
                RWF {formatAmount(data.loans.outstanding)}
              </Text>
            </AppView>
          </AppView>
        </AppView>

        {/* ========================================================= */}
        {/* RECENT TRANSACTIONS */}
        {/* ========================================================= */}

        <AppView className="mt-7 px-5 bg-white dark:bg-surface-dark/30 rounded-3xl py-7 mx-5">
          <AppView className="flex-row items-center justify-between bg-white dark:bg-transparent">
            <Text className="text-lg font-bold text-text dark:text-text-dark">
              Recent transactions
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/transactions")}
            >
              <Text className="text-sm font-semibold text-primary">
                View all
              </Text>
            </TouchableOpacity>
          </AppView>

          {data.recent_transactions.length === 0 ? (
            <AppView className="mt-3 rounded-2xl bg-white p-5 dark:bg-transparent">
              <Text className="text-textMuted dark:text-textMuted-dark text-sm">
                No transactions yet
              </Text>
            </AppView>
          ) : (
            <AppView className="mt-3 rounded-2xl bg-white dark:bg-transparent">
              {data.recent_transactions.map((transaction, index) => {
                const isIncome = transaction.type === "income";
                const isExpense = transaction.type === "expense";

                return (
                  <AppView
                    key={transaction.id}
                    className={`flex-row items-center p-4 bg-white dark:bg-surface-dark/30 ${
                      index !== data.recent_transactions.length - 1
                        ? "border-b border-gray-100 dark:border-gray-800"
                        : ""
                    }`}
                  >
                    <AppView
                      className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${
                        isIncome
                          ? "bg-green-100"
                          : isExpense
                            ? "bg-orange-100"
                            : "bg-gray-100"
                      }`}
                    >
                      <Text className="text-base">
                        {isIncome ? "↓" : isExpense ? "↑" : "↔"}
                      </Text>
                    </AppView>

                    <AppView className="flex-1 bg-white dark:bg-surface-dark/30">
                      <Text className="font-semibold text-text dark:text-text-dark">
                        {getTransactionTitle(transaction)}
                      </Text>

                      <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
                        {transaction.account_name || "Account"} •{" "}
                        {formatDate(transaction.date)}
                      </Text>
                    </AppView>

                    <Text
                      className={`font-bold ${
                        isIncome
                          ? "text-primary"
                          : isExpense
                            ? "text-orange"
                            : "text-text dark:text-text-dark"
                      }`}
                    >
                      {isIncome ? "+" : isExpense ? "-" : ""}
                      RWF {formatAmount(transaction.amount)}
                    </Text>
                  </AppView>
                );
              })}
            </AppView>
          )}
        </AppView>

        {/* ========================================================= */}
        {/* FINANCIAL HEALTH */}
        {/* ========================================================= */}

        <AppView className="mt-7 px-5 bg-white rounded-t-3xl pt-7 dark:bg-surface-dark/30">
          <Text className="text-lg font-bold text-text dark:text-text-dark">
            Financial health
          </Text>

          <AppView className="mt-3 rounded-2xl bg-white p-5 dark:bg-transparent">
            <AppView className="flex-row items-center justify-between">
              <AppView className="flex-1 bg-white dark:bg-surface-dark/30">
                <Text className="text-xs text-textMuted dark:text-textMuted-dark">
                  Expense ratio
                </Text>

                <Text className="mt-1 text-2xl font-bold text-text dark:text-text-dark">
                  {data.financial_health.expense_ratio}%
                </Text>
              </AppView>

              <AppView className="flex-1 bg-white dark:bg-surface-dark/30">
                <Text className="text-xs text-textMuted dark:text-textMuted-dark">
                  Saved this month
                </Text>

                <Text className="mt-1 text-lg font-bold text-primary">
                  RWF {formatAmount(data.financial_health.savings)}
                </Text>
              </AppView>
            </AppView>
          </AppView>
        </AppView>
      </ScrollView>
      <AppDrawer
        title="Dashboard"
        subtitle="Your financial overview"
        items={drawerItems}
      />
    </AppView>
  );
}
