import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeft, ChevronDown, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";

import { useGetLoansQuery, useRecordLoanPaymentMutation } from "@/api/loanApi";
import { useGetAccountsQuery } from "@/api/accountApi";
import type { Loan, LoanType, LoanPaymentRequest } from "@/api/loanApi";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useAlert } from "../ui/Alert/AlertProvider";
interface LoanPaymentModalProps {
  visible: boolean;

  /**
   * When a loan is supplied, Step 1 is skipped.
   */
  loan?: Loan | null;

  onClose: () => void;

  /**
   * Called after payment has been successfully recorded.
   */
  onSuccess?: (loan: any) => void;
}

type Step = 1 | 2;

export default function LoanPaymentModal({
  visible,
  loan: passedLoan = null,
  onClose,
  onSuccess,
}: LoanPaymentModalProps) {
  const { execute } = useApiMutation();

  const [step, setStep] = useState<Step>(passedLoan ? 2 : 1);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(passedLoan);

  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [description, setDescription] = useState("");

  const [showLoanSelector, setShowLoanSelector] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const { showAlert } = useAlert();
  const { data: loansData, isLoading: isLoadingLoans } = useGetLoansQuery(
    undefined,
    {
      skip: !visible || !!passedLoan,
    },
  );

  const { data: accountsData, isLoading: isLoadingAccounts } =
    useGetAccountsQuery(undefined);

  const [recordLoanPayment, { isLoading: isSubmitting }] =
    useRecordLoanPaymentMutation();

  const loans = loansData?.results ?? [];
  const accounts = accountsData?.results ?? [];

  /*
   * Keep the passed loan synchronized when the modal
   * is opened from a LoanDetails screen.
   */
  useEffect(() => {
    if (!visible) {
      return;
    }

    if (passedLoan) {
      setSelectedLoan(passedLoan);
      setStep(2);
    } else {
      setSelectedLoan(null);
      setStep(1);
    }
  }, [visible, passedLoan]);

  /*
   * Reset the form whenever the modal is closed.
   */
  useEffect(() => {
    if (!visible) {
      setAmount("");
      setSelectedAccount(null);
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setDescription("");
      setShowLoanSelector(false);
      setShowAccountSelector(false);
    }
  }, [visible]);

  const remainingAmount = useMemo(() => {
    if (!selectedLoan) {
      return 0;
    }

    return Number(selectedLoan.remaining_amount);
  }, [selectedLoan]);

  const selectedAccountObject = useMemo(() => {
    return accounts.find((account) => account.id === selectedAccount);
  }, [accounts, selectedAccount]);

  const isReceiving = selectedLoan?.loan_type === "lent";

  const directionTitle = isReceiving ? "Receive Payment" : "Make Payment";

  const directionDescription = selectedLoan
    ? isReceiving
      ? `Receive payment from ${selectedLoan.person}`
      : `Make payment to ${selectedLoan.person}`
    : "";

  const formatCurrency = (value: string | number, currency = "RWF") => {
    return `${Number(value).toLocaleString()} ${currency}`;
  };

  const resetAndClose = () => {
    setStep(passedLoan ? 2 : 1);
    setSelectedLoan(passedLoan);
    setAmount("");
    setSelectedAccount(null);
    setDescription("");
    setPaymentDate(new Date().toISOString().split("T")[0]);

    onClose();
  };

  const handleLoanSelect = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowLoanSelector(false);

    /*
     * Clear payment-specific fields whenever a different
     * loan is selected.
     */
    setAmount("");
    setSelectedAccount(null);
    setDescription("");

    setStep(2);
  };

  const handleBack = () => {
    if (passedLoan) {
      resetAndClose();
      return;
    }

    setStep(1);
    setAmount("");
    setSelectedAccount(null);
    setDescription("");
  };

  const validatePayment = () => {
    if (!selectedLoan) {
      return "Please select a loan.";
    }

    const numericAmount = Number(amount);

    if (!amount || Number.isNaN(numericAmount)) {
      return "Please enter a payment amount.";
    }

    if (numericAmount <= 0) {
      return "Payment amount must be greater than zero.";
    }

    if (numericAmount > remainingAmount) {
      return `Payment cannot exceed the remaining balance of ${formatCurrency(
        remainingAmount,
        selectedLoan.currency,
      )}.`;
    }

    if (!selectedAccount) {
      return "Please select the account used for this payment.";
    }

    if (!paymentDate) {
      return "Please select a payment date.";
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validatePayment();

    if (validationError) {
      console.log("PAYMENT VALIDATION:", validationError);
      showAlert({
        type: "error",
        title: "Payment Recording Error",
        message: validationError,
      });
      return;
    }

    if (!selectedLoan || !selectedAccount) {
      return;
    }

    const data: any = {
      amount: Number(amount).toFixed(2),
      account: selectedAccount,
      payment_date: paymentDate,
      description: description.trim(),
    };

    // console.log("========== LOAN PAYMENT ==========");
    // console.log("LOAN ID:", selectedLoan.id);
    // console.log("PAYMENT DATA:", data);
    // console.log("===================================");

    try {
      const updatedLoan = await execute(
        () =>
          recordLoanPayment({
            id: selectedLoan.id,
            data,
          }).unwrap(),
        {
          successMessage: "Loan payment recorded successfully",
          showSuccess: true,
        },
      );

      setAmount("");
      setSelectedAccount(null);
      setDescription("");

      onSuccess?.(updatedLoan);

      resetAndClose();
    } catch (error) {
      console.log("LOAN PAYMENT ERROR:", error);
    }
  };

  const renderStepIndicator = () => {
    if (passedLoan) {
      return null;
    }

    return (
      <View className="mb-5 flex-row items-center justify-center">
        <View className="items-center">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Text className="font-bold text-white">
              {step === 1 ? "1" : "✓"}
            </Text>
          </View>

          <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Loan
          </Text>
        </View>

        <View className="mx-3 h-[1px] w-12 bg-slate-300 dark:bg-slate-700" />

        <View className="items-center">
          <View
            className={`h-8 w-8 items-center justify-center rounded-full ${
              step === 2 ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
            }`}
          >
            <Text
              className={`font-bold ${
                step === 2 ? "text-white" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              2
            </Text>
          </View>

          <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Payment
          </Text>
        </View>
      </View>
    );
  };

  const renderLoanSelection = () => {
    return (
      <View>
        <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Select Loan
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowLoanSelector(!showLoanSelector)}
          className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <View className="flex-1">
            {selectedLoan ? (
              <>
                <Text className="font-semibold text-slate-900 dark:text-white">
                  {selectedLoan.person}
                </Text>

                <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedLoan.loan_type === "lent"
                    ? "Money lent"
                    : "Money borrowed"}{" "}
                  •{" "}
                  {formatCurrency(
                    selectedLoan.remaining_amount,
                    selectedLoan.currency,
                  )}{" "}
                  remaining
                </Text>
              </>
            ) : (
              <Text className="text-slate-400">Choose a loan</Text>
            )}
          </View>

          <ChevronDown size={20} color="#64748B" />
        </TouchableOpacity>

        {showLoanSelector && (
          <View className="mt-2 max-h-64 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            {isLoadingLoans ? (
              <View className="items-center py-6">
                <ActivityIndicator color="#10644D" />
              </View>
            ) : loans.length === 0 ? (
              <View className="px-4 py-6">
                <Text className="text-center text-slate-500 dark:text-slate-400">
                  No active loans found.
                </Text>
              </View>
            ) : (
              <ScrollView>
                {loans
                  .filter((loan) => loan.status === "active")
                  .map((loan) => (
                    <TouchableOpacity
                      key={loan.id}
                      onPress={() => handleLoanSelect(loan)}
                      className="border-b border-slate-100 px-4 py-4 dark:border-slate-800"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="font-semibold text-slate-900 dark:text-white">
                            {loan.person}
                          </Text>

                          <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {loan.loan_type === "lent"
                              ? "Money lent"
                              : "Money borrowed"}
                          </Text>
                        </View>

                        <Text className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(loan.remaining_amount, loan.currency)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            )}
          </View>
        )}

        {selectedLoan && (
          <TouchableOpacity
            onPress={() => setStep(2)}
            className="mt-5 items-center rounded-2xl bg-primary py-4"
          >
            <Text className="font-bold text-white">Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPaymentDetails = () => {
    if (!selectedLoan) {
      return null;
    }

    return (
      <View>
        {/* Direction */}
        <View className="mb-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
          <Text className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {isReceiving ? "Receiving payment" : "Making payment"}
          </Text>

          <Text className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            {selectedLoan.person}
          </Text>

          <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {directionDescription}
          </Text>
        </View>

        {/* Remaining balance */}
        <View className="mb-5">
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            Remaining balance
          </Text>

          <Text className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(
              selectedLoan.remaining_amount,
              selectedLoan.currency,
            )}
          </Text>
        </View>

        {/* Amount */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Payment Amount
          </Text>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />

          <Text className="mt-1 text-xs text-slate-400">
            Maximum:{" "}
            {formatCurrency(
              selectedLoan.remaining_amount,
              selectedLoan.currency,
            )}
          </Text>
        </View>

        {/* Account */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Account Used
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowAccountSelector(!showAccountSelector)}
            className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900"
          >
            <View className="flex-1">
              {selectedAccountObject ? (
                <>
                  <Text className="font-semibold text-slate-900 dark:text-white">
                    {selectedAccountObject.name}
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Balance:{" "}
                    {formatCurrency(
                      selectedAccountObject.balance,
                      selectedAccountObject.currency,
                    )}
                  </Text>
                </>
              ) : (
                <Text className="text-slate-400">Select account</Text>
              )}
            </View>

            <ChevronDown size={20} color="#64748B" />
          </TouchableOpacity>

          {showAccountSelector && (
            <View className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              {isLoadingAccounts ? (
                <View className="items-center py-6">
                  <ActivityIndicator color="#10644D" />
                </View>
              ) : (
                accounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    onPress={() => {
                      setSelectedAccount(account.id);
                      setShowAccountSelector(false);
                    }}
                    className="border-b border-slate-100 px-4 py-4 dark:border-slate-800"
                  >
                    <Text className="font-semibold text-slate-900 dark:text-white">
                      {account.name}
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {formatCurrency(account.balance, account.currency)}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>

        {/* Payment date */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Payment Date
          </Text>

          <TextInput
            value={paymentDate}
            onChangeText={setPaymentDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#94A3B8"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </View>

        {/* Description */}
        <View className="mb-5">
          <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Description
            <Text className="font-normal text-slate-400"> (optional)</Text>
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={
              isReceiving ? "e.g. Payment received" : "e.g. Monthly repayment"
            }
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="min-h-[90px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isSubmitting}
          onPress={handleSubmit}
          className={`items-center rounded-2xl bg-primary py-4 ${
            isSubmitting ? "opacity-60" : ""
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="font-bold text-white">{directionTitle}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={resetAndClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[92%] rounded-t-3xl bg-white dark:bg-slate-950">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <View className="flex-row items-center">
              {step === 2 && !passedLoan && (
                <TouchableOpacity
                  onPress={handleBack}
                  className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900"
                >
                  <ChevronLeft size={20} color="#64748B" />
                </TouchableOpacity>
              )}

              <View>
                <Text className="text-xl font-bold text-slate-900 dark:text-white">
                  {step === 1 ? "Record Loan Payment" : directionTitle}
                </Text>

                <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {step === 1 ? "Choose the loan" : "Enter payment details"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={resetAndClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900"
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 40,
            }}
          >
            {renderStepIndicator()}

            {step === 1 ? renderLoanSelection() : renderPaymentDetails()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
