import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  CalendarDays,
  CircleDollarSign,
  Pencil,
  Trash2,
  X,
} from "lucide-react-native";

import type { Loan } from "@/api/loanApi";

interface LoanDetailsModalProps {
  visible: boolean;
  loan: Loan | null;
  onClose: () => void;
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
  onPayment: (loan: Loan) => void;
  formatCurrency: (amount: string | number, currency?: string) => string;
}

export default function LoanDetailsModal({
  visible,
  loan,
  onClose,
  onEdit,
  onDelete,
  onPayment,
  formatCurrency,
}: LoanDetailsModalProps) {
  if (!loan) {
    return null;
  }

  const isLent = loan.loan_type === "lent";

  const progress =
    Number(loan.principal_amount) > 0
      ? Math.min(
          100,
          (Number(loan.paid_amount) / Number(loan.principal_amount)) * 100,
        )
      : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="max-h-[90%] rounded-t-[32px] bg-background dark:bg-slate-950">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-border px-5 pb-4 pt-5 dark:border-slate-800">
            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-900 dark:text-white">
                Loan Details
              </Text>

              <Text className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                {isLent ? "Money you lent" : "Money you borrowed"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-slate-900"
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 36,
            }}
          >
            {/* Person + amount */}
            <View className="items-center rounded-3xl bg-primary/5 px-5 py-7">
              <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-primary">
                <CircleDollarSign size={28} color="#FFFFFF" />
              </View>

              <Text className="text-lg font-semibold text-slate-900 dark:text-white">
                {loan.person}
              </Text>

              <Text className="mt-2 text-3xl font-bold text-primary">
                {formatCurrency(loan.remaining_amount, loan.currency)}
              </Text>

              <Text className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Remaining amount
              </Text>
            </View>

            {/* Status */}
            <View className="mt-5 flex-row gap-3">
              <InfoBox
                label="Principal"
                value={formatCurrency(loan.principal_amount, loan.currency)}
              />

              <InfoBox
                label="Paid"
                value={formatCurrency(loan.paid_amount, loan.currency)}
              />
            </View>

            {/* Progress */}
            <View className="mt-5 rounded-2xl bg-white p-4 dark:bg-slate-900">
              <View className="mb-2 flex-row justify-between">
                <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                  Payment progress
                </Text>

                <Text className="text-sm font-bold text-primary">
                  {Math.round(progress)}%
                </Text>
              </View>

              <View className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <View
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </View>
            </View>
            {/*Payment Button*/}
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-primary py-4"
              onPress={() => onPayment(loan)}
            >
              <Pencil size={18} color="#10644D" />

              <Text className="font-bold text-primary">Record Payment</Text>
            </TouchableOpacity>

            {/* Details */}
            <View className="mt-5 rounded-2xl bg-white dark:bg-slate-900">
              <DetailRow
                label="Type"
                value={isLent ? "Money I Lent" : "Money I Borrowed"}
              />

              <DetailRow
                label="Status"
                value={loan.status === "paid" ? "Paid" : "Active"}
              />

              <DetailRow
                label="Payment date"
                value={loan.payment_date || "Not specified"}
                icon={<CalendarDays size={18} color="#64748B" />}
              />

              {loan.description ? (
                <DetailRow label="Description" value={loan.description} />
              ) : null}
            </View>

            {/* Actions */}
            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity
                onPress={() => onEdit(loan)}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-primary py-4"
              >
                <Pencil size={18} color="#10644D" />

                <Text className="font-bold text-primary">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onDelete(loan)}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-red-50 py-4 dark:bg-red-950/30"
              >
                <Trash2 size={18} color="#DC2626" />

                <Text className="font-bold text-red-600 dark:text-red-400">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-2xl bg-white p-4 dark:bg-slate-900">
      <Text className="text-xs text-gray-500 dark:text-slate-400">{label}</Text>

      <Text className="mt-1 text-base font-bold text-slate-900 dark:text-white">
        {value}
      </Text>
    </View>
  );
}

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center border-b border-border px-4 py-4 last:border-b-0 dark:border-slate-800">
      {icon ? <View className="mr-3">{icon}</View> : null}

      <View className="flex-1">
        <Text className="text-xs text-gray-500 dark:text-slate-400">
          {label}
        </Text>

        <Text className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </Text>
      </View>
    </View>
  );
}
