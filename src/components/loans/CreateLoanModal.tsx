import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { CalendarDays, Check, ChevronDown, X } from "lucide-react-native";

import type { CreateLoanRequest, Loan, LoanType } from "@/api/loanApi";
import { useGetAccountsQuery } from "@/api/accountApi";
export interface LoanAccount {
  id: number;
  name: string;
  account_type: string;
  currency: string;
  balance: string;
  is_active: boolean;
}

interface CreateLoanModalProps {
  visible: boolean;
  onClose: () => void;

  onSubmit: (data: CreateLoanRequest) => Promise<void>;

  /**
   * null/undefined = create mode
   * loan = edit mode
   */
  loan?: Loan | null;

  /**
   * User's accounts.
   */
  // accounts: LoanAccount[];

  isSubmitting?: boolean;
}

export default function CreateLoanModal({
  visible,
  onClose,
  onSubmit,
  loan = null,
  isSubmitting = false,
}: CreateLoanModalProps) {
  const isEditMode = !!loan;
  const { data: accounts, isLoading } = useGetAccountsQuery(undefined);
  const [person, setPerson] = useState("");
  const [loanType, setLoanType] = useState<LoanType>("lent");

  const [amount, setAmount] = useState("");

  const [accountId, setAccountId] = useState<number | null | undefined>(null);

  const [paymentDate, setPaymentDate] = useState("");

  const [description, setDescription] = useState("");

  const [showAccounts, setShowAccounts] = useState(false);

  const [error, setError] = useState("");
  // const [data:accounts,{is}]=useGetAccountsQuery()
  /**
   * Only show active accounts.
   */
  const activeAccounts = useMemo(
    () => accounts?.results?.filter((account) => account.is_active),
    [accounts],
  );

  /**
   * Currently selected account.
   */
  const selectedAccount = useMemo(
    () => activeAccounts?.find((account) => account.id === accountId) ?? null,
    [activeAccounts, accountId],
  );

  /**
   * Populate form when modal opens.
   *
   * Create:
   *    empty form
   *
   * Edit:
   *    existing loan values
   */
  useEffect(() => {
    if (!visible) {
      return;
    }

    if (loan) {
      setPerson(loan.person);
      setLoanType(loan.loan_type);
      setAmount(loan.principal_amount);
      setAccountId(loan?.account);
      setPaymentDate(loan.payment_date ?? "");
      setDescription(loan.description ?? "");
    } else {
      resetForm();
    }

    setError("");
    setShowAccounts(false);
  }, [visible, loan]);

  /**
   * When creating a loan, the account determines
   * the currency.
   */
  useEffect(() => {
    if (selectedAccount && !isEditMode) {
      // Currency comes from account.
      // No separate currency input is necessary.
    }
  }, [selectedAccount, isEditMode]);

  const resetForm = () => {
    setPerson("");
    setLoanType("lent");
    setAmount("");
    setAccountId(null);
    setPaymentDate("");
    setDescription("");
    setError("");
    setShowAccounts(false);
  };

  const handleSelectAccount = (account: LoanAccount) => {
    setAccountId(account.id);
    setShowAccounts(false);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");

    const trimmedPerson = person.trim();

    const trimmedAmount = amount.trim();

    /**
     * Account is required.
     */
    if (!accountId) {
      setError("Please select the account used for this loan.");
      return;
    }

    /**
     * Person is required.
     */
    if (!trimmedPerson) {
      setError("Please enter the person's name.");
      return;
    }

    /**
     * Amount is required.
     */
    if (!trimmedAmount) {
      setError("Please enter the loan amount.");
      return;
    }

    const numericAmount = Number(trimmedAmount.replace(/,/g, ""));

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Loan amount must be greater than zero.");
      return;
    }

    /**
     * Make sure the account still exists.
     */
    if (!selectedAccount) {
      setError("The selected account is no longer available.");
      return;
    }

    const data: CreateLoanRequest = {
      person: trimmedPerson,

      loan_type: loanType,

      principal_amount: numericAmount.toFixed(2),

      /**
       * Currency comes from the account.
       */
      currency: selectedAccount.currency.toUpperCase(),

      account: selectedAccount.id,

      payment_date: paymentDate.trim() || null,

      description: description.trim(),
    };

    try {
      await onSubmit(data);
    } catch {
      /**
       * Parent handles API errors.
       */
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-end bg-black/40">
          {/* Background */}
          <Pressable className="absolute inset-0" onPress={onClose} />

          {/* Modal */}
          <View className="max-h-[92%] rounded-t-[32px] bg-background dark:bg-background-dark">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-border px-5 pb-4 pt-5 dark:border-border-dark">
              <View>
                <Text className="text-xl font-bold text-text dark:text-text-dark">
                  {isEditMode ? "Edit Loan" : "Add Loan"}
                </Text>

                <Text className="mt-1 text-sm text-textMuted dark:text-textMuted-dark">
                  {isEditMode
                    ? "Update your loan details."
                    : "Record money you lend or borrow."}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                disabled={isSubmitting}
                className="h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark"
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                padding: 20,
                paddingBottom: 36,
              }}
            >
              {/* ========================= */}
              {/* LOAN ACTION */}
              {/* ========================= */}

              <Text className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
                Loan action
              </Text>

              <View className="mb-5 flex-row gap-3">
                <LoanTypeOption
                  label="I lent money"
                  description="Someone owes me"
                  selected={loanType === "lent"}
                  onPress={() => setLoanType("lent")}
                  disabled={isSubmitting}
                />

                <LoanTypeOption
                  label="I borrowed money"
                  description="I owe someone"
                  selected={loanType === "borrowed"}
                  onPress={() => setLoanType("borrowed")}
                  disabled={isSubmitting}
                />
              </View>

              {/* ========================= */}
              {/* ACCOUNT */}
              {/* ========================= */}

              <FormLabel label="Account" />

              <TouchableOpacity
                onPress={() => setShowAccounts((value) => !value)}
                disabled={isSubmitting}
                activeOpacity={0.8}
                className="mb-2 flex-row items-center justify-between rounded-2xl border border-border bg-white px-4 py-3.5 dark:border-border-dark dark:bg-surface-dark"
              >
                <View className="flex-1">
                  {selectedAccount ? (
                    <>
                      <Text className="text-base font-semibold text-text dark:text-text-dark">
                        {selectedAccount.name}
                      </Text>

                      <Text className="mt-0.5 text-xs text-textMuted dark:text-textMuted-dark">
                        {selectedAccount.account_type} •{" "}
                        {selectedAccount.currency} {selectedAccount.balance}
                      </Text>
                    </>
                  ) : (
                    <Text className="text-base text-textMuted dark:text-textMuted-dark">
                      Select account
                    </Text>
                  )}
                </View>

                <ChevronDown size={20} color="#64748B" />
              </TouchableOpacity>

              {/* Account options */}
              {showAccounts && (
                <View className="mb-5 overflow-hidden rounded-2xl border border-border bg-white dark:border-border-dark dark:bg-surface-dark">
                  {activeAccounts?.length === 0 ? (
                    <View className="px-4 py-4">
                      <Text className="text-sm text-textMuted dark:text-textMuted-dark">
                        No active accounts available.
                      </Text>
                    </View>
                  ) : (
                    activeAccounts?.map((account) => {
                      const selected = account.id === accountId;

                      return (
                        <TouchableOpacity
                          key={account.id}
                          onPress={() => handleSelectAccount(account)}
                          disabled={isSubmitting}
                          className="flex-row items-center justify-between border-b border-border px-4 py-3.5 last:border-b-0 dark:border-border-dark"
                        >
                          <View className="flex-1">
                            <Text
                              className={`text-base font-semibold ${
                                selected
                                  ? "text-primary"
                                  : "text-text dark:text-text-dark"
                              }`}
                            >
                              {account.name}
                            </Text>

                            <Text className="mt-0.5 text-xs text-textMuted dark:text-textMuted-dark">
                              {account.account_type} • {account.currency}{" "}
                              {account.balance}
                            </Text>
                          </View>

                          {selected && (
                            <Check size={18} color="#10644D" strokeWidth={3} />
                          )}
                        </TouchableOpacity>
                      );
                    })
                  )}
                </View>
              )}

              {/* ========================= */}
              {/* PERSON */}
              {/* ========================= */}

              <FormLabel label="Person" />

              <TextInput
                value={person}
                onChangeText={setPerson}
                placeholder={
                  loanType === "lent"
                    ? "Who borrowed the money?"
                    : "Who lent you the money?"
                }
                placeholderTextColor="#94A3B8"
                className="mb-5 rounded-2xl border border-border bg-white px-4 py-3.5 text-base text-text dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                editable={!isSubmitting}
              />

              {/* ========================= */}
              {/* AMOUNT */}
              {/* ========================= */}

              <FormLabel label="Amount" />

              <View className="mb-5 flex-row gap-3">
                <View className="w-[90px] justify-center rounded-2xl border border-border bg-slate-100 px-4 dark:border-border-dark dark:bg-slate-800">
                  <Text className="text-base font-semibold text-text dark:text-text-dark">
                    {selectedAccount?.currency ?? "RWF"}
                  </Text>
                </View>

                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                  className="flex-1 rounded-2xl border border-border bg-white px-4 py-3.5 text-base text-text dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                  editable={!isSubmitting}
                />
              </View>

              {/* ========================= */}
              {/* PAYMENT DATE */}
              {/* ========================= */}

              <FormLabel label="Payment date" optional />

              <View className="relative mb-5">
                <CalendarDays
                  size={19}
                  color="#64748B"
                  style={{
                    position: "absolute",
                    left: 15,
                    top: 15,
                    zIndex: 1,
                  }}
                />

                <TextInput
                  value={paymentDate}
                  onChangeText={setPaymentDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94A3B8"
                  className="rounded-2xl border border-border bg-white py-3.5 pl-12 pr-4 text-base text-text dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                  editable={!isSubmitting}
                />
              </View>

              {/* ========================= */}
              {/* DESCRIPTION */}
              {/* ========================= */}

              <FormLabel label="Description" optional />

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Add a note about this loan"
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                className="mb-5 min-h-[100px] rounded-2xl border border-border bg-white px-4 py-3.5 text-base text-text dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                editable={!isSubmitting}
              />

              {/* ========================= */}
              {/* ERROR */}
              {/* ========================= */}

              {error ? (
                <View className="mb-4 rounded-2xl bg-red-50 px-4 py-3 dark:bg-red-950/30">
                  <Text className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* ========================= */}
              {/* SUBMIT */}
              {/* ========================= */}

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
                className={`items-center rounded-2xl bg-primary py-4 ${
                  isSubmitting ? "opacity-60" : ""
                }`}
              >
                <Text className="text-base font-bold text-white">
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Update Loan"
                      : "Save Loan"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FormLabel({
  label,
  optional = false,
}: {
  label: string;
  optional?: boolean;
}) {
  return (
    <View className="mb-2 flex-row items-center">
      <Text className="text-sm font-semibold text-text dark:text-text-dark">
        {label}
      </Text>

      {optional && (
        <Text className="ml-1 text-xs text-textMuted dark:text-textMuted-dark">
          (optional)
        </Text>
      )}
    </View>
  );
}

function LoanTypeOption({
  label,
  description,
  selected,
  onPress,
  disabled = false,
}: {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className={`flex-1 rounded-2xl border p-4 ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-white dark:border-border-dark dark:bg-surface-dark"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className={`text-sm font-bold ${
            selected ? "text-primary" : "text-text dark:text-text-dark"
          }`}
        >
          {label}
        </Text>

        <View
          className={`h-5 w-5 items-center justify-center rounded-full border ${
            selected
              ? "border-primary bg-primary"
              : "border-slate-300 dark:border-slate-600"
          }`}
        >
          {selected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
        </View>
      </View>

      <Text className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">
        {description}
      </Text>
    </TouchableOpacity>
  );
}
