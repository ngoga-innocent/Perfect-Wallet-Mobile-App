import {
  ActivityIndicator,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Text from "@/components/ui/Text/Text";

import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Check,
  X,
} from "lucide-react-native";

import { useEffect, useState } from "react";

import type { Account } from "@/api/accountApi";
import { useGetAccountsQuery } from "@/api/accountApi";
import {
  useCreateTransactionMutation,
  type TransactionType,
} from "@/api/transactionApi";
import { useApiMutation } from "@/hooks/useApiMutation";
interface TransactionFormModalProps {
  visible: boolean;
  account?: Account;
  transaction_kind?: TransactionType;
  onClose: () => void;
  onSuccess?: () => void;
}

const TYPES: {
  value: TransactionType;
  label: string;
  description: string;
}[] = [
  {
    value: "income",
    label: "Income",
    description: "Money received",
  },
  {
    value: "expense",
    label: "Expense",
    description: "Money spent",
  },
  {
    value: "transfer",
    label: "Transfer",
    description: "Move money between accounts",
  },
];

export default function TransactionFormModal({
  visible,
  account: parentAccount,
  transaction_kind: parentTransactionKind,
  onClose,
  onSuccess,
}: TransactionFormModalProps) {
  const [type, setType] = useState<TransactionType>(
    parentTransactionKind ?? "expense",
  );

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(
    parentAccount ?? null,
  );

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [destinationAccount, setDestinationAccount] = useState<Account | null>(
    null,
  );

  const { execute } = useApiMutation();

  const [createTransaction, { isLoading, error }] =
    useCreateTransactionMutation();

  /*
   * The modal can now be opened from anywhere.
   *
   * We fetch accounts whenever the modal is visible because:
   * - Independent mode needs them for source-account selection.
   * - Transfer mode needs them for destination-account selection.
   */
  const {
    data: accountsData,
    isLoading: isLoadingAccounts,
    isFetching: isFetchingAccounts,
  } = useGetAccountsQuery(undefined, {
    skip: !visible,
  });

  const accounts = accountsData?.results ?? [];

  /*
   * If an account was supplied by the parent, that account
   * remains the source account.
   *
   * Otherwise the user must select one.
   */
  const sourceAccount = parentAccount ?? selectedAccount;

  const selectedType = TYPES.find((item) => item.value === type);
  /*
   * Reset the form whenever the modal is opened
   * for a different account.
   */
  useEffect(() => {
    if (!visible) {
      return;
    }

    setType(parentTransactionKind ?? "expense");
    setSelectedAccount(parentAccount ?? null);
    setAmount("");
    setDescription("");
    setDestinationAccount(null);
  }, [visible, parentAccount?.id, parentTransactionKind]);

  /*
   * Only active accounts other than the source
   * can be transfer destinations.
   */
  const destinationAccounts = accounts.filter(
    (item: any) => item.id !== sourceAccount?.id && item.is_active,
  );

  const handleClose = () => {
    if (isLoading) {
      return;
    }

    setAmount("");
    setDescription("");
    setDestinationAccount(null);
    setSelectedAccount(parentAccount ?? null);
    setType(parentTransactionKind ?? "expense");

    onClose();
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);

    /*
     * Destination only applies to transfers.
     */
    if (newType !== "transfer") {
      setDestinationAccount(null);
    }
  };

  const handleSubmit = async () => {
    const numericAmount = Number(amount);

    if (!amount || numericAmount <= 0) {
      return;
    }
    if (!sourceAccount) {
      return;
    }
    if (type === "transfer" && !destinationAccount) {
      return;
    }

    try {
      await execute(
        () =>
          createTransaction({
            account: sourceAccount.id,
            transaction_type: type,
            amount: numericAmount.toFixed(2),
            description: description.trim(),
            destination_account:
              type === "transfer" ? destinationAccount!.id : null,
            transaction_date: new Date().toISOString(),
          }).unwrap(),
        {
          showSuccess: true,
          successMessage: "Transaction Saved Successfully!",
        },
      );

      /*
       * API succeeded.
       *
       * RTK Query invalidates the appropriate
       * transaction/account caches.
       */

      onSuccess?.();

      onClose();

      /*
       * Reset after successful creation.
       */
      setAmount("");
      setDescription("");
      setDestinationAccount(null);
      setType("expense");
    } catch {
      /*
       * Error is already exposed through the
       * mutation's `error` state.
       *
       * We intentionally keep the modal open
       * so the user doesn't lose their input.
       */
    }
  };

  const hasValidAmount = amount.trim().length > 0 && Number(amount) > 0;

  // const hasValidAmount = amount.trim().length > 0 && Number(amount) > 0;

  const canSubmit =
    !!sourceAccount &&
    hasValidAmount &&
    !isLoading &&
    (type !== "transfer" || destinationAccount !== null);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[90%] rounded-t-[30px] bg-background px-5 pb-8 pt-5 dark:bg-background-dark">
          {/* Header */}

          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-xl font-bold text-text dark:text-text-dark">
                Add transaction
              </Text>

              <Text className="mt-1 text-sm text-textMuted dark:text-textMuted-dark">
                {sourceAccount?.name ?? "Choose Account"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              className={`h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark ${
                isLoading ? "opacity-40" : ""
              }`}
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="mt-6"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Transaction type */}
            {/* Source account */}

            {!parentAccount && (
              <View>
                <Text className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
                  Account
                </Text>

                {isLoadingAccounts || isFetchingAccounts ? (
                  <View className="items-center rounded-2xl border border-border bg-white p-5 dark:border-border-dark dark:bg-surface-dark">
                    <ActivityIndicator size="small" color="#10644D" />

                    <Text className="mt-2 text-sm text-textMuted dark:text-textMuted-dark">
                      Loading accounts...
                    </Text>
                  </View>
                ) : accounts.length === 0 ? (
                  <View className="rounded-2xl bg-red-50 p-4 dark:bg-red-950/30">
                    <Text className="text-sm text-red-600 dark:text-red-400">
                      You don't have any active accounts available.
                    </Text>
                  </View>
                ) : (
                  accounts
                    .filter((item: Account) => item.is_active)
                    .map((item: Account) => {
                      const selected = selectedAccount?.id === item.id;

                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => {
                            setSelectedAccount(item);

                            /*
                             * A source account cannot also be the
                             * transfer destination.
                             */
                            if (destinationAccount?.id === item.id) {
                              setDestinationAccount(null);
                            }
                          }}
                          disabled={isLoading}
                          activeOpacity={0.8}
                          className={`mb-2 flex-row items-center rounded-2xl border p-4 ${
                            selected
                              ? "border-primary bg-primary/10"
                              : "border-border bg-white dark:border-border-dark dark:bg-surface-dark"
                          }`}
                        >
                          <View className="flex-1">
                            <Text className="font-semibold text-text dark:text-text-dark">
                              {item.name}
                            </Text>

                            <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
                              {item.balance} {item.currency}
                            </Text>
                          </View>

                          {selected && (
                            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
                              <Check size={14} color="#FFFFFF" />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })
                )}
              </View>
            )}
            {!parentTransactionKind && (
              <>
                <Text className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
                  Transaction type
                </Text>

                {TYPES.map((item) => {
                  const selected = item.value === type;

                  return (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => handleTypeChange(item.value)}
                      disabled={isLoading}
                      activeOpacity={0.8}
                      className={`mb-2 flex-row items-center rounded-2xl border p-4 ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-white dark:border-border-dark dark:bg-surface-dark"
                      }`}
                    >
                      <View
                        className={`h-11 w-11 items-center justify-center rounded-xl ${
                          selected
                            ? "bg-primary"
                            : "bg-background dark:bg-background-dark"
                        }`}
                      >
                        {item.value === "income" && (
                          <ArrowDownLeft
                            size={20}
                            color={selected ? "#FFFFFF" : "#10644D"}
                          />
                        )}

                        {item.value === "expense" && (
                          <ArrowUpRight
                            size={20}
                            color={selected ? "#FFFFFF" : "#10644D"}
                          />
                        )}

                        {item.value === "transfer" && (
                          <ArrowLeftRight
                            size={20}
                            color={selected ? "#FFFFFF" : "#10644D"}
                          />
                        )}
                      </View>

                      <View className="ml-3">
                        <Text className="font-semibold text-text dark:text-text-dark">
                          {item.label}
                        </Text>

                        <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
                          {item.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}

            {/* Amount */}

            <View className="mt-5">
              <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
                Amount
              </Text>

              <View className="flex-row items-center rounded-2xl border border-border bg-white px-4 dark:border-border-dark dark:bg-surface-dark">
                <Text className="mr-2 font-semibold text-textMuted dark:text-textMuted-dark">
                  {sourceAccount?.currency ?? "Rwf"}
                </Text>

                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  editable={!isLoading}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 py-4 text-lg font-semibold text-text dark:text-text-dark"
                />
              </View>
            </View>

            {/* Description */}

            <View className="mt-5">
              <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
                Description
              </Text>

              <TextInput
                value={description}
                onChangeText={setDescription}
                editable={!isLoading}
                placeholder={
                  type === "income"
                    ? "e.g. Salary"
                    : type === "expense"
                      ? "e.g. Groceries"
                      : "e.g. Transfer to savings"
                }
                placeholderTextColor="#94A3B8"
                multiline
                className="min-h-[90px] rounded-2xl border border-border bg-white px-4 py-4 text-text dark:border-border-dark dark:bg-surface-dark"
              />
            </View>

            {/* Transfer destination */}

            {type === "transfer" && (
              <View className="mt-5 rounded-2xl bg-primary/10 p-4">
                <Text className="font-semibold text-text dark:text-text-dark">
                  Destination account
                </Text>

                <Text className="mt-1 text-sm text-textMuted dark:text-textMuted-dark">
                  Choose where the money should be transferred.
                </Text>

                {isLoadingAccounts || isFetchingAccounts ? (
                  <View className="mt-3 items-center rounded-xl bg-white p-5 dark:bg-surface-dark">
                    <ActivityIndicator size="small" color="#10644D" />

                    <Text className="mt-2 text-sm text-textMuted dark:text-textMuted-dark">
                      Loading accounts...
                    </Text>
                  </View>
                ) : destinationAccounts.length === 0 ? (
                  <View className="mt-3 rounded-xl bg-white p-4 dark:bg-surface-dark">
                    <Text className="text-sm text-textMuted dark:text-textMuted-dark">
                      You don't have another active account available.
                    </Text>
                  </View>
                ) : (
                  <View className="mt-3">
                    {destinationAccounts.map((item: Account) => {
                      const selected = destinationAccount?.id === item.id;

                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => setDestinationAccount(item)}
                          disabled={isLoading}
                          className={`mb-2 flex-row items-center rounded-xl border p-4 ${
                            selected
                              ? "border-primary bg-primary/10"
                              : "border-border bg-white dark:border-border-dark dark:bg-surface-dark"
                          }`}
                        >
                          <View className="flex-1">
                            <Text className="font-semibold text-text dark:text-text-dark">
                              {item.name}
                            </Text>

                            <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
                              {item.balance} {item.currency}
                            </Text>
                          </View>

                          {selected && (
                            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
                              <Check size={14} color="#FFFFFF" />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            {/* Error */}

            {error && (
              <View className="mt-4 rounded-2xl bg-red-50 p-4 dark:bg-red-950/30">
                <Text className="text-sm text-red-600 dark:text-red-400">
                  Unable to save the transaction. Please check your information
                  and try again.
                </Text>
              </View>
            )}

            {/* Submit */}

            <TouchableOpacity
              disabled={!canSubmit}
              onPress={handleSubmit}
              activeOpacity={0.8}
              className={`mt-7 mb-2 items-center rounded-2xl py-4 ${
                canSubmit ? "bg-primary" : "bg-primary/40"
              }`}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#FFFFFF" />

                  <Text className="ml-2 font-bold text-white">Saving...</Text>
                </View>
              ) : (
                <Text className="font-bold text-white">
                  Save {selectedType?.label.toLowerCase()}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
