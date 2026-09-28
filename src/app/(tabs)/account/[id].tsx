import {
  Animated,
  RefreshControl,
  ScrollView,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "@/components/ui/Text/Text";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Plus,
  Send,
  Wallet2Icon,
  WalletCards,
} from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetAccountTransactionsQuery } from "@/api/transactionApi";
import { useGetAccountQuery } from "@/api/accountApi";
import AccountBalanceCard from "@/components/account/AccountBalanceCard";
import TransactionCard from "@/components/account/TransactionCard";
import TransactionFilterModal from "@/components/account/TransactionFilterModal";
import TransactionFormModal from "@/components/account/TransactionFormModal";
import QuickAction from "@/components/account/QuickActions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppLoader from "@/components/ui/Loader/AppLoader";
import AppHeader from "@/components/ui/Header/AppHeader";
import type { Transaction } from "@/api/transactionApi";
type TransactionType = "income" | "expense" | "transfer";

export default function AccountDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterTransactionType, setFilterTransactionType] = useState<
    TransactionType | "all"
  >("all");
  const [transactionType, setTransactionType] = useState<TransactionType>();
  const [accountTransactions, setAccountTransactions] = useState<Transaction[]>(
    [],
  );

  const accountId = Number(id);
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    isFetching: transactionsFetching,
    refetch: refetchTransactions,
  } = useGetAccountTransactionsQuery(
    {
      accountId,
      page,
      transaction_type:
        filterTransactionType === "all" ? undefined : filterTransactionType,
    },
    {
      skip: !accountId,
    },
  );
  const {
    data: account,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetAccountQuery(accountId, {
    skip: !accountId,
  });
  const transactions = transactionsData?.results || [];

  const inset = useSafeAreaInsets();
  useEffect(() => {
    if (!transactionsData?.results) {
      return;
    }

    if (page === 1) {
      setAccountTransactions(transactionsData.results);
      return;
    }

    setAccountTransactions((previous) => {
      const existingIds = new Set(
        previous.map((transaction) => transaction.id),
      );

      const newTransactions = transactionsData.results.filter(
        (transaction) => !existingIds.has(transaction.id),
      );

      return [...previous, ...newTransactions];
    });
  }, [transactionsData, page]);
  /*
   * Temporary transaction data.
   *
   * This will be replaced with:
   * useGetAccountTransactionsQuery(...)
   *
   * once the transaction API is implemented.
   */

  useEffect(() => {
    setPage(1);
  }, [filterTransactionType, accountId]);
  // Paginations
  const hasNextPage = Boolean(transactionsData?.next);
  const loadMoreTransactions = () => {
    if (transactionsFetching || !hasNextPage) {
      return;
    }

    setPage((currentPage) => currentPage + 1);
  };
  const balance = Number(account?.balance || 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: account?.currency || "RWF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // if (isLoading) {
  //   return (
  //     <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
  //       <AppLoader />
  //       <Text className="text-textMuted dark:text-textMuted-dark">
  //         Loading account...
  //       </Text>
  //     </View>
  //   );
  // }

  if (isError && !account) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-background-dark">
        <WalletCards size={42} color="#64748B" />

        <Text className="mt-4 text-lg font-bold text-text dark:text-text-dark">
          Account unavailable
        </Text>

        <Text className="mt-2 text-center text-sm text-textMuted dark:text-textMuted-dark">
          We couldn't load this account. Please check your connection and try
          again.
        </Text>

        <TouchableOpacity
          onPress={refetch}
          className="mt-5 rounded-xl bg-primary px-5 py-3"
        >
          <Text className="font-semibold text-white">Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      // style={{
      //   paddingTop: inset.top,
      // }}
      className=" flex-1 bg-background dark:bg-background-dark"
    >
      <AppLoader visible={isLoading} message="Loading Account Data ..." />
      <AppHeader
        title={account ? account?.name : "Account"}
        showBack={true}
        onBackPress={() => router.navigate("/(tabs)/accounts")}
        rightIcon={Wallet2Icon}
      />
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        onEndReached={loadMoreTransactions}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={transactionsFetching && page === 1}
            onRefresh={() => {
              setPage(1);
              refetchTransactions();
              refetch();
            }}
          />
        }
        ListHeaderComponent={
          <>
            {account && (
              <AccountBalanceCard
                accountName={account.name}
                accountType={account.account_type}
                currency={account.currency}
                balance={balance}
                formatCurrency={formatCurrency}
              />
            )}

            {/* Quick Actions */}
            <View className="mt-6 px-5">
              <View className="mx-auto flex w-[80%] flex-row justify-between">
                <QuickAction
                  icon={<ArrowDownLeft size={20} color="#10644D" />}
                  label="Income"
                  onPress={() => {
                    setTransactionType("income");
                    setShowTransactionModal(true);
                  }}
                />

                <QuickAction
                  icon={<ArrowUpRight size={20} color="#10644D" />}
                  label="Expense"
                  onPress={() => {
                    setTransactionType("expense");
                    setShowTransactionModal(true);
                  }}
                />

                <QuickAction
                  icon={<Send size={20} color="#10644D" />}
                  label="Transfer"
                  onPress={() => {
                    setTransactionType("transfer");
                    setShowTransactionModal(true);
                  }}
                />
              </View>
            </View>

            {/* Transactions heading */}
            <View className="mt-8 px-5">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-bold text-text dark:text-text-dark">
                    Transactions
                  </Text>

                  <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
                    Activity on this account
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setShowFilterModal(true)}
                  activeOpacity={0.8}
                  className="flex-row items-center rounded-xl bg-white px-3 py-2.5 dark:bg-surface-dark"
                >
                  <Filter size={16} color="#64748B" />

                  <Text className="ml-2 text-sm font-semibold text-text dark:text-text-dark">
                    Filter
                  </Text>
                </TouchableOpacity>
              </View>

              {filterTransactionType !== "all" && (
                <TouchableOpacity
                  onPress={() => setFilterTransactionType("all")}
                  className="mt-4 self-start flex-row items-center rounded-full bg-primary/10 px-3 py-2"
                >
                  <Text className="text-xs font-semibold text-primary">
                    {filterTransactionType === "income"
                      ? "Income"
                      : filterTransactionType === "expense"
                        ? "Expenses"
                        : "Transfers"}
                  </Text>

                  <Text className="ml-2 text-xs text-primary">×</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <TransactionCard
              transaction={item}
              currency={account?.currency || ""}
            />
          </View>
        )}
        ListEmptyComponent={
          !transactionsLoading ? (
            <View className="mx-5 mt-5 items-center rounded-2xl bg-white px-6 py-10 dark:bg-surface-dark">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <WalletCards size={25} color="#10644D" />
              </View>

              <Text className="mt-4 text-base font-bold text-text dark:text-text-dark">
                No transactions yet
              </Text>

              <Text className="mt-2 max-w-[290px] text-center text-sm leading-5 text-textMuted dark:text-textMuted-dark">
                {filterTransactionType === "all"
                  ? "Start recording your income, expenses, or transfers to keep track of this account."
                  : "No transactions match the selected filter."}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setTransactionType(
                    filterTransactionType === "all"
                      ? undefined
                      : filterTransactionType,
                  );
                  setShowTransactionModal(true);
                }}
                activeOpacity={0.8}
                className="mt-5 flex-row items-center rounded-xl bg-primary px-5 py-3"
              >
                <Plus size={18} color="#FFFFFF" />

                <Text className="ml-2 font-semibold text-white">
                  Add transaction
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListFooterComponent={
          transactionsFetching && page > 1 ? (
            <View className="items-center py-5">
              <AppLoader visible={isLoading} message="Loading ..." />
            </View>
          ) : !hasNextPage && transactions.length > 0 ? (
            <View className="items-center py-5">
              <Text className="text-xs text-textMuted dark:text-textMuted-dark">
                You’ve reached the end
              </Text>
            </View>
          ) : null
        }
      />

      {/* Transaction modal */}
      <TransactionFormModal
        visible={showTransactionModal}
        transaction_kind={transactionType}
        account={account}
        onClose={() => setShowTransactionModal(false)}
        onSuccess={() => {
          setPage(1);
          refetchTransactions();
          refetch();
        }}
      />
      <TransactionFilterModal
        visible={showFilterModal}
        selectedType={filterTransactionType}
        onSelect={(type: any) => {
          setFilterTransactionType(type);
          setShowFilterModal(false);
        }}
        onClose={() => setShowFilterModal(false)}
      />

      {/* Filter modal */}
      {/*<TransactionFilterModal
        visible={showFilterModal}
        selectedType={transactionType}
        onTypeChange={setTransactionType}
        onClose={() => setShowFilterModal(false)}
      />*/}
    </View>
  );
}
