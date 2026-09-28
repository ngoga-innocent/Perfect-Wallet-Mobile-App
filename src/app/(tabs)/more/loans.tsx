import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Plus, PlusCircleIcon } from "lucide-react-native";
import { useMemo, useState } from "react";

import {
  useGetLoansQuery,
  useCreateLoanMutation,
  useDeleteLoanMutation,
  useUpdateLoanMutation,
} from "@/api/loanApi";
import AppHeader from "@/components/ui/Header/AppHeader";
// import { useGetAccountsQuery } from "@/api/accountApi";
import CreateLoanModal from "@/components/loans/CreateLoanModal";
import LoanCard from "@/components/loans/LoanCard";
import LoanSummaryCard from "@/components/loans/LoanSummaryCard";
import LoanTypeTabs from "@/components/loans/LoanTypeTab";
import EmptyLoans from "@/components/loans/EmptyLoans";
import LoanPaymentModal from "@/components/loans/LoanPaymentModal";
import { useApiMutation } from "@/hooks/useApiMutation";

import type {
  CreateLoanRequest,
  LoanType,
  UpdateLoanRequest,
} from "@/api/loanApi";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppLoader from "@/components/ui/Loader/AppLoader";
// import { ERROR_MESSAGES } from "react-native-reanimated/lib/typescript/css/native/normalization/common/settings";
import type { Loan } from "@/api/loanApi";
import LoanDetailsModal from "@/components/loans/LoanDetails";
type LoanTab = "all" | LoanType;

export default function LoansScreen() {
  const [selectedType, setSelectedType] = useState<LoanTab>("all");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createLoan, { isLoading: isCreating, isError }] =
    useCreateLoanMutation();
  const { execute } = useApiMutation();
  // const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateLoan, { isLoading: isUpdating }] = useUpdateLoanMutation();

  const [deleteLoan, { isLoading: isDeleting }] = useDeleteLoanMutation();
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const [paymentLoan, setPaymentLoan] = useState<Loan | null>(null);
  const insets = useSafeAreaInsets();
  const queryParams =
    selectedType === "all"
      ? undefined
      : {
          loan_type: selectedType,
        };
  const { data, isLoading, isFetching, refetch } =
    useGetLoansQuery(queryParams);
  const handleSubmit = async (data: CreateLoanRequest) => {
    try {
      await execute(() => createLoan(data).unwrap(), {
        successMessage: "Loan Created Successfully",
        showSuccess: true,
      });
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditLoan = (loan: Loan) => {
    setSelectedLoan(null);
    setEditingLoan(loan);
    setCreateModalVisible(true);
  };
  const handleUpdateLoan = async (data: any) => {
    if (!editingLoan) {
      return;
    }
    // console.log("editing Loan", data);
    try {
      await execute(
        () =>
          updateLoan({
            id: editingLoan.id,
            data,
          }).unwrap(),
        {
          successMessage: "Loan Updated Successfully",
          showSuccess: true,
        },
      );

      setCreateModalVisible(false);
      setEditingLoan(null);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  const handlePayment = (loan: Loan) => {
    setDetailsModalVisible(false);
    setSelectedLoan(null);

    setPaymentLoan(loan);
    setPaymentModalVisible(true);
  };

  const loans = data?.results ?? [];

  const summary = useMemo(() => {
    let lent = 0;
    let borrowed = 0;

    let lentCount = 0;
    let borrowedCount = 0;

    for (const loan of loans) {
      const remaining = Number(loan.remaining_amount);

      if (loan.loan_type === "lent") {
        lent += remaining;
        lentCount++;
      } else {
        borrowed += remaining;
        borrowedCount++;
      }
    }

    return {
      lent,
      borrowed,
      lentCount,
      borrowedCount,
    };
  }, [loans]);

  const formatCurrency = (amount: string | number, currency = "RWF") => {
    return `${Number(amount).toLocaleString()} ${currency}`;
  };

  const handleAddLoan = () => {
    setCreateModalVisible(!createModalVisible);
    // router.push("/loans/create");
  };

  const handleLoanPress = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailsModalVisible(true);
  };
  const handleDeleteLoan = (loan: Loan) => {
    Alert.alert(
      "Delete Loan",
      `Are you sure you want to delete the loan with ${loan.person}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await execute(() => deleteLoan(loan.id).unwrap(), {
                successMessage: "Loan Deleted Successfully",
                showSuccess: true,
              });

              setDetailsModalVisible(false);

              setSelectedLoan(null);
              refetch();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    );
  };
  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader
        title="Loans Management"
        showBack={true}
        rightIcon={PlusCircleIcon}
        onRightPress={() => handleAddLoan()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom * 1.6,
          // paddingTop: insets.top,
        }}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {/* Header */}
        {/*<View className="px-5 pb-5 pt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-slate-900 dark:text-white">
                Loans
              </Text>

              <Text className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Manage money you lend and borrow
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleAddLoan}
              activeOpacity={0.8}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-primary"
            >
              <Plus size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>*/}

        {/* Summary */}
        <View className="px-5">
          <View className="flex-row gap-3">
            <LoanSummaryCard
              title="Money Lent"
              amount={formatCurrency(summary.lent)}
              subtitle={`${summary.lentCount} ${
                summary.lentCount === 1 ? "loan" : "loans"
              }`}
              type="lent"
            />

            <LoanSummaryCard
              title="Money Borrowed"
              amount={formatCurrency(summary.borrowed)}
              subtitle={`${summary.borrowedCount} ${
                summary.borrowedCount === 1 ? "loan" : "loans"
              }`}
              type="borrowed"
            />
          </View>
        </View>

        {/* Type filter */}
        <View className="mt-6 px-5">
          <LoanTypeTabs value={selectedType} onChange={setSelectedType} />
        </View>

        {/* Loan list */}
        <View className="mt-6 px-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedType === "all"
                ? "All Loans"
                : selectedType === "lent"
                  ? "Money Lent"
                  : "Money Borrowed"}
            </Text>

            <Text className="text-sm text-gray-500 dark:text-slate-400">
              {loans.length}
            </Text>
          </View>

          {isLoading ? (
            <View className="items-center py-12">
              <AppLoader visible={isLoading} message="Getting Your loans.." />
              <ActivityIndicator size="small" color="#10644D" />
            </View>
          ) : loans.length === 0 ? (
            <EmptyLoans type={selectedType} onAddLoan={handleAddLoan} />
          ) : (
            loans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                formatCurrency={formatCurrency}
                onPress={() => handleLoanPress(loan)}
              />
            ))
          )}
        </View>
        <CreateLoanModal
          visible={createModalVisible}
          loan={editingLoan}
          // accounts={accounts?.results ?? []}
          onClose={() => {
            setCreateModalVisible(false);
            setEditingLoan(null);
          }}
          isSubmitting={isCreating || isUpdating}
          onSubmit={editingLoan ? handleUpdateLoan : handleSubmit}
        />

        <LoanDetailsModal
          visible={detailsModalVisible}
          loan={selectedLoan}
          onClose={() => {
            setDetailsModalVisible(false);
            setSelectedLoan(null);
          }}
          onEdit={handleEditLoan}
          onPayment={handlePayment}
          onDelete={handleDeleteLoan}
          formatCurrency={formatCurrency}
        />
        <LoanPaymentModal
          visible={paymentModalVisible}
          loan={paymentLoan}
          onClose={() => {
            setPaymentModalVisible(false);
            setPaymentLoan(null);
          }}
          onSuccess={(updatedLoan) => {
            console.log("UPDATED LOAN AFTER PAYMENT:", updatedLoan);

            refetch();
          }}
        />
      </ScrollView>
    </View>
  );
}
