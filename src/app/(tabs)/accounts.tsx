import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";

import {
  Plus,
  Eye,
  EyeOff,
  Wallet,
  TrendingUp,
  Layers3,
  ArrowUpRight,
  ChevronRight,
  PieChart,
} from "lucide-react-native";

import { useMemo, useState } from "react";
import { router } from "expo-router";

import {
  useGetAccountsQuery,
  useDeleteAccountMutation,
} from "@/api/accountApi";

import AccountCard from "@/components/account/AccountCard";
import AccountFormModal from "@/components/account/AccountFormModal";
import AppHeader from "@/components/ui/Header/AppHeader";
import Text from "@/components/ui/Text/Text";
import AppView from "@/components/ui/Views/AppView";
import LiquidFinancialPattern from "@/components/brand/LiquidFintechPattern";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY = "#10644D";
const BLUE = "#2563EB";
const ORANGE = "#EA580C";
const PURPLE = "#7C3AED";

export default function AccountsScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const { data, isLoading, isFetching, isError, refetch } = useGetAccountsQuery(
    {
      page: 1,
      page_size: 20,
    },
  );

  const [deleteAccount] = useDeleteAccountMutation();

  const accounts = data?.results ?? [];

  const activeAccounts = useMemo(
    () => accounts.filter((account) => account.is_active),
    [accounts],
  );

  const totalBalance = useMemo(() => {
    return activeAccounts.reduce(
      (total, account) => total + Number(account.balance || 0),
      0,
    );
  }, [activeAccounts]);

  const highestBalanceAccount = useMemo(() => {
    if (!activeAccounts.length) return null;

    return activeAccounts.reduce((highest, account) => {
      return Number(account.balance || 0) > Number(highest.balance || 0)
        ? account
        : highest;
    });
  }, [activeAccounts]);

  const averageBalance = useMemo(() => {
    if (!activeAccounts.length) return 0;

    return totalBalance / activeAccounts.length;
  }, [activeAccounts, totalBalance]);

  const largestAccountPercentage = useMemo(() => {
    if (!highestBalanceAccount || totalBalance <= 0) return 0;

    return Math.round(
      (Number(highestBalanceAccount.balance || 0) / totalBalance) * 100,
    );
  }, [highestBalanceAccount, totalBalance]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const displayBalance = (amount: number) => {
    return showBalance ? formatCurrency(amount) : "••••••••";
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAccount(id).unwrap();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  const handleAccountPress = (id: number) => {
    router.push(`/(tabs)/account/${id}`);
  };
  const insets = useSafeAreaInsets();
  return (
    <AppView
      className="flex-1 bg-background dark:bg-background-dark"
      style={{
        paddingBottom: insets.bottom * 3.35,
      }}
    >
      {/* ========================================================= */}
      {/* APP HEADER */}
      {/* ========================================================= */}

      <AppHeader
        title="My Accounts"
        showBack={true}
        onMenuPress={() => {
          // Drawer will be connected here
        }}
        rightIcon={Plus}
        onRightPress={() => setShowCreateModal(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={PRIMARY}
          />
        }
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* ========================================================= */}
        {/* PAGE INTRO */}
        {/* ========================================================= */}

        {/*  <AppView className="px-5 pt-5">
          <AppView className="flex-row items-center justify-between">
            <AppView className="flex-1 pr-4">
              <Text className="text-2xl font-bold text-text dark:text-text-dark">
                Your money
              </Text>

              <Text className="mt-1 text-sm leading-5 text-textMuted dark:text-textMuted-dark">
                Everything you own, in one place.
              </Text>
            </AppView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowCreateModal(true)}
              className="h-11 w-11 items-center justify-center rounded-full bg-primary"
            >
              <Plus size={21} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </AppView>
        </AppView>
        */}

        {/* ========================================================= */}
        {/* BALANCE HERO */}
        {/* ========================================================= */}

        <AppView className="mx-5 mt-6 overflow-hidden rounded-[28px] bg-primary">
          <AppView className="relative p-5 bg-primary">
            {/* Top row */}
            <AppView className="absolute inset-0 bg-primary">
              <LiquidFinancialPattern />
            </AppView>
            <AppView className="flex-row items-center justify-between bg-primary">
              <AppView className="flex-row items-center bg-primary">
                <AppView className="h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                  <Wallet size={20} color="#FFFFFF" strokeWidth={2} />
                </AppView>

                <AppView className="ml-3 bg-primary">
                  <Text className="text-xs font-medium text-white/70">
                    Total portfolio
                  </Text>

                  <Text className="mt-0.5 text-xs text-white/50">
                    {activeAccounts.length}{" "}
                    {activeAccounts.length === 1
                      ? "active account"
                      : "active accounts"}
                  </Text>
                </AppView>
              </AppView>

              <Pressable
                onPress={() => setShowBalance((value) => !value)}
                className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
              >
                {showBalance ? (
                  <EyeOff size={17} color="#FFFFFF" />
                ) : (
                  <Eye size={17} color="#FFFFFF" />
                )}
              </Pressable>
            </AppView>

            {/* Main balance */}
            <Text
              className="mt-7 text-[32px] font-extrabold tracking-tight text-white"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {displayBalance(totalBalance)}
            </Text>

            <Text className="mt-1 text-xs text-white/60">
              Available across your active accounts
            </Text>

            {/* Divider */}
            <AppView className="my-5 h-px bg-white/10" />

            {/* Hero footer */}
            <AppView className="flex-row items-center justify-between bg-primary">
              <AppView className="flex-1 bg-primary">
                <Text className="text-[11px] font-medium uppercase tracking-wide text-white/50">
                  Largest account
                </Text>

                <Text
                  className="mt-1 text-sm font-semibold text-white"
                  numberOfLines={1}
                >
                  {highestBalanceAccount?.name ?? "No accounts"}
                </Text>
              </AppView>

              <AppView className="items-end bg-primary">
                <Text className="text-sm font-bold text-white">
                  {highestBalanceAccount
                    ? displayBalance(Number(highestBalanceAccount.balance || 0))
                    : "—"}
                </Text>

                {highestBalanceAccount && (
                  <Text className="mt-0.5 text-[11px] text-white/50">
                    {largestAccountPercentage}% of portfolio
                  </Text>
                )}
              </AppView>
            </AppView>
          </AppView>
        </AppView>

        {/* ========================================================= */}
        {/* PORTFOLIO SNAPSHOT */}
        {/* ========================================================= */}

        {activeAccounts.length > 0 && (
          <AppView className="mt-5 px-5">
            <AppView className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-bold text-text dark:text-text-dark">
                Portfolio snapshot
              </Text>

              <PieChart size={18} color={PURPLE} strokeWidth={2} />
            </AppView>

            <AppView className="flex-row gap-3">
              {/* Accounts */}
              <AppView className="flex-1 rounded-2xl bg-white p-4 dark:bg-surface-dark">
                <AppView className="h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950">
                  <Layers3 size={18} color={BLUE} strokeWidth={2} />
                </AppView>

                <Text className="mt-4 text-xs text-textMuted dark:text-textMuted-dark">
                  Accounts
                </Text>

                <Text className="mt-1 text-xl font-bold text-text dark:text-text-dark">
                  {activeAccounts.length}
                </Text>
              </AppView>

              {/* Average */}
              <AppView className="flex-1 rounded-2xl bg-white p-4 dark:bg-surface-dark">
                <AppView className="h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950">
                  <TrendingUp size={18} color="#D97706" strokeWidth={2} />
                </AppView>

                <Text className="mt-4 text-xs text-textMuted dark:text-textMuted-dark">
                  Average balance
                </Text>

                <Text
                  className="mt-1 text-base font-bold text-text dark:text-text-dark"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {showBalance ? formatCurrency(averageBalance) : "••••"}
                </Text>
              </AppView>

              {/* Portfolio */}
              <AppView className="flex-1 rounded-2xl bg-white p-4 dark:bg-surface-dark">
                <AppView className="h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950">
                  <Wallet size={18} color={PURPLE} strokeWidth={2} />
                </AppView>

                <Text className="mt-4 text-xs text-textMuted dark:text-textMuted-dark">
                  Portfolio
                </Text>

                <Text
                  className="mt-1 text-base font-bold text-text dark:text-text-dark"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {showBalance ? formatCurrency(totalBalance) : "••••"}
                </Text>
              </AppView>
            </AppView>
          </AppView>
        )}

        {/* ========================================================= */}
        {/* ACCOUNTS */}
        {/* ========================================================= */}

        <AppView className="mt-7 px-5">
          <AppView className="mb-4 flex-row items-end justify-between">
            <AppView>
              <Text className="text-lg font-bold text-text dark:text-text-dark">
                Your accounts
              </Text>

              <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
                Bank, mobile money, cash and savings
              </Text>
            </AppView>

            {activeAccounts.length > 0 && (
              <Text className="text-xs font-semibold text-primary">
                {activeAccounts.length} total
              </Text>
            )}
          </AppView>

          {/* ======================================================= */}
          {/* LOADING */}
          {/* ======================================================= */}

          {isLoading && (
            <AppView className="rounded-2xl bg-surface p-5 dark:bg-surface-dark">
              <Text className="text-sm text-textMuted dark:text-textMuted-dark">
                Loading accounts...
              </Text>
            </AppView>
          )}

          {/* ======================================================= */}
          {/* ERROR */}
          {/* ======================================================= */}

          {!isLoading && isError && (
            <AppView className="rounded-2xl bg-surface p-5 dark:bg-surface-dark">
              <AppView className="h-10 w-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
                <Text className="font-bold text-red-600">!</Text>
              </AppView>

              <Text className="mt-3 font-semibold text-text dark:text-text-dark">
                Unable to load accounts
              </Text>

              <Text className="mt-1 text-sm leading-5 text-textMuted dark:text-textMuted-dark">
                Check your connection and try again.
              </Text>

              <TouchableOpacity
                onPress={refetch}
                activeOpacity={0.8}
                className="mt-4 self-start rounded-xl bg-primary px-4 py-2.5"
              >
                <Text className="font-semibold text-white">Try again</Text>
              </TouchableOpacity>
            </AppView>
          )}

          {/* ======================================================= */}
          {/* EMPTY STATE */}
          {/* ======================================================= */}

          {!isLoading && !isError && activeAccounts.length === 0 && (
            <AppView className="overflow-hidden rounded-[28px] bg-white px-6 py-10 dark:bg-surface-dark">
              <AppView className="items-center">
                <AppView className="h-20 w-20 items-center justify-center rounded-[26px] bg-primary/10">
                  <Wallet size={34} color={PRIMARY} strokeWidth={1.8} />
                </AppView>

                <Text className="mt-5 text-xl font-bold text-text dark:text-text-dark">
                  Start your portfolio
                </Text>

                <Text className="mt-2 max-w-[290px] text-center text-sm leading-5 text-textMuted dark:text-textMuted-dark">
                  Add your bank, mobile money, cash, or savings account to start
                  tracking your money.
                </Text>

                <TouchableOpacity
                  onPress={() => setShowCreateModal(true)}
                  activeOpacity={0.8}
                  className="mt-6 flex-row items-center rounded-xl bg-primary px-5 py-3"
                >
                  <Plus size={18} color="#FFFFFF" />

                  <Text className="ml-2 font-semibold text-white">
                    Add first account
                  </Text>
                </TouchableOpacity>
              </AppView>
            </AppView>
          )}

          {/* ======================================================= */}
          {/* ACCOUNT LIST */}
          {/* ======================================================= */}

          {!isLoading &&
            !isError &&
            activeAccounts.map((account) => (
              <AppView key={account.id} className="mb-3">
                <AccountCard
                  account={account}
                  onPress={() => handleAccountPress(account.id)}
                  onDelete={() => handleDelete(account.id)}
                />
              </AppView>
            ))}
        </AppView>

        {/* ========================================================= */}
        {/* ADD ACCOUNT CTA */}
        {/* ========================================================= */}

        {activeAccounts.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowCreateModal(true)}
            className="mx-5 mt-2 flex-row items-center justify-between rounded-2xl border border-primary/15 bg-primary/5 px-4 py-4"
          >
            <AppView className="flex-row items-center bg-transparent">
              <AppView className="h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Plus size={18} color={PRIMARY} strokeWidth={2.3} />
              </AppView>

              <AppView className="ml-3 bg-transparent">
                <Text className="text-sm font-bold text-text dark:text-text-dark">
                  Add another account
                </Text>

                <Text className="mt-0.5 text-xs text-textMuted dark:text-textMuted-dark">
                  Connect another place where you keep money
                </Text>
              </AppView>
            </AppView>

            <ChevronRight size={19} color={PRIMARY} strokeWidth={2} />
          </TouchableOpacity>
        )}

        {/* ========================================================= */}
        {/* FOOTER INSIGHT */}
        {/* ========================================================= */}

        {activeAccounts.length > 1 && highestBalanceAccount && (
          <AppView className="mx-5 mt-5 flex-row items-center rounded-2xl bg-blue-50 px-4 py-3.5 dark:bg-blue-950/40">
            <AppView className="h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900">
              <ArrowUpRight size={18} color={BLUE} strokeWidth={2} />
            </AppView>

            <AppView className="ml-3 flex-1 bg-transparent">
              <Text className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                Portfolio insight
              </Text>

              <Text className="mt-0.5 text-xs leading-4 text-blue-600 dark:text-blue-400">
                {highestBalanceAccount.name} currently holds the largest share
                of your available funds.
              </Text>
            </AppView>
          </AppView>
        )}
      </ScrollView>

      {/* ========================================================= */}
      {/* ACCOUNT FORM */}
      {/* ========================================================= */}

      <AccountFormModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </AppView>
  );
}
