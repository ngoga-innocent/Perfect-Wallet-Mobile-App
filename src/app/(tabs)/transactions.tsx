import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Filter,
  Plus,
  PlusCircle,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react-native";

import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
} from "react-native";
import Text from "@/components/ui/Text/Text";
import View from "@/components/ui/Views/AppView";
import TextInput from "@/components/ui/Inputs/TextInput";
import { useMemo, useEffect, useState } from "react";
import { router } from "expo-router";
import TransactionFormModal from "@/components/account/TransactionFormModal";
import {
  Transaction,
  useGetTransactionsQuery,
  useGetTransactionStatsQuery,
} from "@/api/transactionApi";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WaterDropPattern from "@/components/brand/WaterDropPattern";
import LiquidFinancialPattern from "@/components/brand/LiquidFintechPattern";
import AppHeader from "@/components/ui/Header/AppHeader";
type FilterType = "all" | "income" | "expense" | "transfer";
type SortType = "newest" | "oldest" | "highest" | "lowest";

export default function TransactionsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<SortType>("newest");

  const [showFilters, setShowFilters] = useState(false);
  const [showTransactionFormModal, setShowTransactionFormModal] =
    useState(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [page, setPage] = useState(1);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const insets = useSafeAreaInsets();

  const transactionQuery = {
    page,
    transaction_type: activeFilter === "all" ? undefined : activeFilter,
    search: debouncedSearch || undefined,
    ordering:
      sort === "newest"
        ? "-transaction_date"
        : sort === "oldest"
          ? "transaction_date"
          : sort === "highest"
            ? "-amount"
            : "amount",
  };

  const { data, isLoading, isFetching, error, refetch } =
    useGetTransactionsQuery(transactionQuery);

  useEffect(() => {
    if (!data?.results) {
      return;
    }

    if (page === 1) {
      setAllTransactions(data.results);
      return;
    }

    setAllTransactions((previous) => {
      const existingIds = new Set(previous.map((item) => item.id));

      const newTransactions = data.results.filter(
        (item) => !existingIds.has(item.id),
      );

      return [...previous, ...newTransactions];
    });
  }, [data, page]);

  const transactions = allTransactions;
  useEffect(() => {
    setPage(1);
    setAllTransactions([]);
  }, [activeFilter, debouncedSearch, sort]);
  // console.log("Transactions", transactions);
  const hasNextPage = Boolean(data?.next);
  const loadMoreTransactions = () => {
    if (isFetching || !hasNextPage) {
      return;
    }

    setPage((previousPage) => previousPage + 1);
  };
  /**
   * Client-side filtering for the currently loaded page.
   *
   * Once backend filters are available, these values can be
   * passed directly to useGetTransactionsQuery instead.
   */

  const { data: stats, isFetching: isStatsFetching } =
    useGetTransactionStatsQuery({
      search: debouncedSearch || undefined,
    });
  console.log("Stats", stats);
  const incomeCount = stats?.data?.income ?? 0;
  const expenseCount = stats?.data?.expense ?? 0;
  const transferCount = stats?.data?.transfer ?? 0;
  const totalCount = stats?.data?.total ?? 0;
  const handleRefresh = async () => {
    setPage(1);
    setAllTransactions([]);

    await refetch();
  };
  const renderHeader = () => (
    <>
      {/* Header */}

      {/*<View className="px-5">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() =>
              setShowTransactionFormModal(!showTransactionFormModal)
            }
            className="h-12 w-12 items-center justify-center rounded-full bg-primary active:opacity-80"
          >
            <Plus size={23} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>*/}

      {/* Activity overview */}
      <View className="mt-6 px-5 ">
        <View className="relative overflow-hidden rounded-[28px] bg-primary">
          <LiquidFinancialPattern />

          <View className="relative p-5 bg-primary">
            <View className="flex-row items-center bg-primary">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <CircleDollarSign size={24} color="#FFFFFF" strokeWidth={2} />
              </View>

              <View className="ml-3 bg-primary">
                <Text className="text-sm font-medium text-white/70">
                  Activity overview
                </Text>

                <Text className="mt-0.5 text-2xl font-bold text-white">
                  {data?.count ?? transactions.length}
                </Text>

                <Text className="text-xs text-white/50">
                  transactions recorded
                </Text>
              </View>
            </View>

            <View className="mt-6 flex-row rounded-2xl bg-black/10  px-3 py-4">
              <OverviewItem label="Income" value={incomeCount} />

              <View className="mx-3 w-px bg-white/10" />

              <OverviewItem label="Expenses" value={expenseCount} />

              <View className="mx-3 w-px bg-white/10" />

              <OverviewItem label="Transfers" value={transferCount} />
            </View>
          </View>
        </View>
      </View>

      {/* Search */}
      <View className="mt-5 w-[90%] mx-auto">
        <View className=" flex-row items-center rounded-2xl">
          <Search size={19} color="#94A3B8" strokeWidth={2} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search transactions"
            // placeholderTextColor="#94A3B8"
            containerClassName="ml-3 flex-1 text-[15px] text-text  dark:text-text-dark"
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <X size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter row */}
      <View className="mt-4 px-5">
        <View className="flex-row items-center">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[
              {
                key: "",
                label: "All",
                count: totalCount,
              },
              {
                key: "income",
                label: "Income",
                count: incomeCount,
              },
              {
                key: "expense",
                label: "Expenses",
                count: expenseCount,
              },
              {
                key: "transfer",
                label: "Transfers",
                count: transferCount,
              },
            ]}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <FilterChip
                label={item.label}
                count={item.count}
                active={activeFilter === item.key}
                onPress={() => setActiveFilter(item.key as FilterType)}
              />
            )}
          />

          <Pressable
            onPress={() => setShowFilters(true)}
            className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark"
          >
            <SlidersHorizontal size={18} color="#64748B" />
          </Pressable>
        </View>
      </View>

      {/* Section title */}
      <View className="mt-7 flex-row items-center justify-between px-5">
        <View>
          <Text className="text-lg font-bold text-text dark:text-text-dark">
            Recent activity
          </Text>

          <Text className="mt-0.5 text-xs text-textMuted dark:text-textMuted-dark">
            Your latest financial movements
          </Text>
        </View>

        <Pressable
          onPress={() => setShowFilters(true)}
          className="flex-row items-center"
        >
          <CalendarDays size={16} color="#64748B" />

          <Text className="ml-1 text-sm font-medium text-textMuted dark:text-textMuted-dark">
            Recent
          </Text>

          <ChevronDown size={15} color="#64748B" className="ml-1" />
        </Pressable>
      </View>
    </>
  );

  if (isLoading) {
    return <TransactionsLoading />;
  }

  if (error) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        {renderHeader()}

        <View className="mx-5 mt-8 items-center rounded-3xl bg-white p-7 dark:bg-surface-dark">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
            <CircleDollarSign size={25} color="#DC2626" />
          </View>

          <Text className="mt-4 text-lg font-bold text-text dark:text-text-dark">
            Unable to load transactions
          </Text>

          <Text className="mt-2 text-center text-sm leading-5 text-textMuted dark:text-textMuted-dark">
            Something went wrong while loading your financial activity.
          </Text>

          <Pressable
            onPress={() => refetch()}
            className="mt-5 rounded-full bg-primary px-6 py-3"
          >
            <Text className="font-semibold text-white">Try again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader
        title="Transactions"
        showBack={true}
        onBackPress={() => router.navigate("/(tabs)")}
        showProfile={false}
        rightIcon={PlusCircle}
        onRightPress={() =>
          setShowTransactionFormModal(!showTransactionFormModal)
        }
      />
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom * 3.35,
        }}
        onEndReached={loadMoreTransactions}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && page === 1}
            onRefresh={handleRefresh}
            tintColor="#10644D"
          />
        }
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onPress={() => setSelectedTransaction(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyTransactions
            hasSearch={Boolean(search)}
            filter={activeFilter}
            onClear={() => {
              setSearch("");
              setActiveFilter("all");
            }}
          />
        }
        ListFooterComponent={
          isFetching && !isLoading ? (
            <View className="items-center py-5">
              <ActivityIndicator size="small" color="#10644D" />

              <Text className="mt-2 text-xs text-textMuted dark:text-textMuted-dark">
                Loading more transactions...
              </Text>
            </View>
          ) : !hasNextPage && transactions.length > 0 ? (
            <View className="items-center py-5">
              <Text className="text-xs text-textMuted dark:text-textMuted-dark">
                You've reached the end
              </Text>
            </View>
          ) : null
        }
      />

      {/* Floating action */}
      {/*<Pressable
        onPress={() => router.push("/transactions/create")}
        className="absolute bottom-20 right-5 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg active:opacity-80"
      >
        <Plus size={25} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>*/}

      {/* Transaction details */}
      <TransactionDetails
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      {/* Filters */}
      <FilterModal
        visible={showFilters}
        sort={sort}
        onSortChange={setSort}
        onClose={() => setShowFilters(false)}
      />
      {/* Create Transaction FormModal*/}
      <TransactionFormModal
        visible={showTransactionFormModal}
        onClose={() => setShowTransactionFormModal(false)}
        onSuccess={() => refetch()}
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Overview                                                                    */
/* -------------------------------------------------------------------------- */

interface OverviewItemProps {
  label: string;
  value: number;
}

function OverviewItem({ label, value }: OverviewItemProps) {
  return (
    <View className="flex-1 dark:bg-transparent flex flex-col items-center justify-center rounded-lg">
      <Text className="text-xs font-medium text-white/55">{label}</Text>

      <Text className="mt-1 text-lg font-bold text-white">{value}</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Filter chip                                                                 */
/* -------------------------------------------------------------------------- */

function FilterChip({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 h-10 flex-row items-center rounded-full px-4 ${
        active
          ? "bg-primary"
          : "border border-background/30 dark:border-white/30"
      }`}
    >
      <Text className={`text-sm font-semibold ${active ? "text-white" : ""}`}>
        {label}
      </Text>

      <View
        className={`ml-2 min-w-[20px] items-center rounded-full px-1.5 py-0.5 ${
          active ? "bg-white/15" : "bg-background dark:bg-background-dark"
        }`}
      >
        <Text
          className={`text-[11px] font-bold ${
            active ? "text-white" : "text-textMuted dark:text-textMuted-dark"
          }`}
        >
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* Transaction item                                                            */
/* -------------------------------------------------------------------------- */

function TransactionItem({
  transaction,
  onPress,
}: {
  transaction: Transaction;
  onPress: () => void;
}) {
  const isIncome = transaction.transaction_type === "income";

  const isTransfer = transaction.transaction_type === "transfer";

  const isExpense = transaction.transaction_type === "expense";

  const amountColor = isIncome
    ? "text-primary"
    : isExpense
      ? "text-text dark:text-text-dark"
      : "text-text dark:text-text-dark";

  const iconBackground = isIncome
    ? "bg-softGreen dark:bg-softGreen-dark"
    : isExpense
      ? "bg-red-50 dark:bg-red-950/30"
      : "bg-blue-50 dark:bg-blue-950/30";

  const icon = isTransfer ? (
    <ArrowLeftRight size={20} color="#2563EB" strokeWidth={2.2} />
  ) : isIncome ? (
    <ArrowDownLeft size={20} color="#10644D" strokeWidth={2.2} />
  ) : (
    <ArrowUpRight size={20} color="#DC2626" strokeWidth={2.2} />
  );

  const prefix = isIncome ? "+" : isExpense ? "-" : "";

  return (
    <Pressable
      onPress={onPress}
      className="mx-5 mb-3 rounded-2xl  p-4 active:opacity-80 "
    >
      <View className="flex-row items-center">
        {/* Icon */}
        <View
          className={`h-11 w-11 items-center justify-center rounded-full ${iconBackground}`}
        >
          {icon}
        </View>

        {/* Main information */}
        <View className="ml-3 flex-1">
          <Text
            numberOfLines={1}
            className="font-semibold text-text dark:text-text-dark"
          >
            {transaction.category ||
              formatTransactionType(transaction.transaction_type)}
          </Text>

          <View className="mt-1 flex-row items-center">
            <Text
              numberOfLines={1}
              className="flex-shrink text-xs text-textMuted dark:text-textMuted-dark"
            >
              {transaction.account_name}
            </Text>

            <View className="mx-2 h-1 w-1 rounded-full bg-textMuted/50" />

            <Text className="text-xs capitalize text-textMuted dark:text-textMuted-dark">
              {formatTransactionType(transaction.transaction_type)}
            </Text>
          </View>
        </View>

        {/* Amount */}
        <View className="ml-2 items-end">
          <Text className={`text-sm font-bold ${amountColor}`}>
            {prefix}
            {Number(transaction.amount).toLocaleString()} RWF
          </Text>

          <Text className="mt-1 text-[10px] text-textMuted dark:text-textMuted-dark">
            View details
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                 */
/* -------------------------------------------------------------------------- */

function EmptyTransactions({
  hasSearch,
  filter,
  onClear,
}: {
  hasSearch: boolean;
  filter: FilterType;
  onClear: () => void;
}) {
  const filtered = hasSearch || filter !== "all";

  return (
    <View className="mx-5 mt-8 items-center rounded-3xl bg-white px-7 py-10 dark:bg-surface-dark">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-softGreen dark:bg-softGreen-dark">
        <ArrowDownLeft size={27} color="#10644D" />
      </View>

      <Text className="mt-5 text-lg font-bold text-text dark:text-text-dark">
        {filtered ? "No matching transactions" : "No transactions yet"}
      </Text>

      <Text className="mt-2 text-center text-sm leading-5 text-textMuted dark:text-textMuted-dark">
        {filtered
          ? "Try another search or change your filters."
          : "Your income, expenses and transfers will appear here."}
      </Text>

      {filtered && (
        <Pressable
          onPress={onClear}
          className="mt-5 rounded-full bg-primary px-5 py-3"
        >
          <Text className="font-semibold text-white">Clear filters</Text>
        </Pressable>
      )}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Transaction details                                                         */
/* -------------------------------------------------------------------------- */

function TransactionDetails({
  transaction,
  onClose,
}: {
  transaction: Transaction | null;
  onClose: () => void;
}) {
  if (!transaction) {
    return null;
  }

  const isIncome = transaction.transaction_type === "income";

  const isTransfer = transaction.transaction_type === "transfer";

  const isExpense = transaction.transaction_type === "expense";

  const icon = isTransfer ? (
    <ArrowLeftRight size={25} color="#2563EB" />
  ) : isIncome ? (
    <ArrowDownLeft size={25} color="#10644D" />
  ) : (
    <ArrowUpRight size={25} color="#DC2626" />
  );

  const prefix = isIncome ? "+" : isExpense ? "-" : "";

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />

        <View className="rounded-t-[32px] bg-background px-5 pb-10 pt-4 dark:bg-background-dark">
          {/* Handle */}
          <View className="mb-5 items-center">
            <View className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-text dark:text-text-dark">
              Transaction details
            </Text>

            <Pressable
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-surface-dark"
            >
              <X size={18} color="#64748B" />
            </Pressable>
          </View>

          {/* Amount */}
          <View className="mt-7 items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-surface-dark">
              {icon}
            </View>

            <Text className="mt-4 text-3xl font-bold text-text dark:text-text-dark">
              {prefix}
              {Number(transaction.amount).toLocaleString()} RWF
            </Text>

            <Text className="mt-1 capitalize text-textMuted dark:text-textMuted-dark">
              {formatTransactionType(transaction.transaction_type)}
            </Text>
          </View>

          {/* Details */}
          <View className="mt-7 rounded-3xl  p-5 ">
            <DetailRow
              label="Category"
              value={
                transaction.category ||
                formatTransactionType(transaction?.transaction_type)
              }
            />
            <DetailRow
              label="Date"
              value={
                new Date(transaction.transaction_date).toLocaleDateString() ||
                formatTransactionType(transaction?.transaction_type)
              }
            />

            <DetailRow label="Account" value={transaction.account_name} />

            <DetailRow
              label="Type"
              value={formatTransactionType(transaction?.transaction_type)}
              capitalize
            />

            <DetailRow
              label="Amount"
              value={`${Number(transaction.amount).toLocaleString()} RWF`}
              last
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function DetailRow({
  label,
  value,
  last = false,
  capitalize = false,
}: {
  label: string;
  value: string;
  last?: boolean;
  capitalize?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between py-3 ${
        !last ? "border-b border-slate-100 dark:border-slate-800" : ""
      }`}
    >
      <Text className="text-sm text-textMuted dark:text-textMuted-dark">
        {label}
      </Text>

      <Text
        className={`max-w-[60%] text-right text-sm font-semibold text-text dark:text-text-dark ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Filter modal                                                                */
/* -------------------------------------------------------------------------- */

function FilterModal({
  visible,
  sort,
  onSortChange,
  onClose,
}: {
  visible: boolean;
  sort: SortType;
  onSortChange: (value: SortType) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />

        <View className="rounded-t-[32px] bg-background px-5 pb-10 pt-4 dark:bg-background-dark">
          <View className="mb-5 items-center">
            <View className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
          </View>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-text dark:text-text-dark">
                Filter & sort
              </Text>

              <Text className="mt-1 text-sm text-textMuted dark:text-textMuted-dark">
                Customize your transaction view
              </Text>
            </View>

            <View className="h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark">
              <Filter size={18} color="#64748B" />
            </View>
          </View>

          <Text className="mb-3 mt-7 text-sm font-semibold text-text dark:text-text-dark">
            Sort by
          </Text>

          <SortOption
            label="Newest first"
            active={sort === "newest"}
            onPress={() => onSortChange("newest")}
          />

          <SortOption
            label="Oldest first"
            active={sort === "oldest"}
            onPress={() => onSortChange("oldest")}
          />

          <SortOption
            label="Highest amount"
            active={sort === "highest"}
            onPress={() => onSortChange("highest")}
          />

          <SortOption
            label="Lowest amount"
            active={sort === "lowest"}
            onPress={() => onSortChange("lowest")}
          />

          <Pressable
            onPress={onClose}
            className="mt-5 h-12 items-center justify-center rounded-2xl bg-primary"
          >
            <Text className="font-bold text-white">Apply filters</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function SortOption({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`mb-2 flex-row items-center justify-between rounded-2xl px-4 py-4 ${
        active
          ? "bg-softGreen dark:bg-softGreen-dark"
          : "bg-white dark:bg-surface-dark"
      }`}
    >
      <Text
        className={`font-medium ${
          active ? "text-primary" : "text-text dark:text-text-dark"
        }`}
      >
        {label}
      </Text>

      <View
        className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
          active ? "border-primary" : "border-slate-300 dark:border-slate-600"
        }`}
      >
        {active && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </View>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                     */
/* -------------------------------------------------------------------------- */

function TransactionsLoading() {
  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <View className="px-5 pt-6">
        <View className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        <View className="mt-2 h-9 w-48 rounded bg-slate-200 dark:bg-slate-800" />
      </View>

      <View className="mx-5 mt-6 h-40 rounded-3xl bg-slate-200 dark:bg-slate-800" />

      <View className="mx-5 mt-5 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />

      <View className="mt-5 px-5">
        <View className="h-10 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
      </View>

      <View className="mt-7 px-5">
        {[1, 2, 3, 4, 5].map((item) => (
          <View
            key={item}
            className="mb-3 h-20 rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function formatTransactionType(type: any) {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: any) => letter.toUpperCase());
}
