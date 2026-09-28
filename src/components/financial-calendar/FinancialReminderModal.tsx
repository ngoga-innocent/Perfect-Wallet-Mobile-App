import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  FinancialReminder,
  useCreateFinancialReminderMutation,
  useUpdateFinancialReminderMutation,
} from "@/api/financialReminderApi";
import type { Recurrence } from "@/api/financialReminderApi";
const PRIMARY = "#10644D";

type Props = {
  visible: boolean;
  selectedDate: string | null;
  reminder?: FinancialReminder | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function FinancialReminderModal({
  visible,
  selectedDate,
  reminder,
  onClose,
  onSuccess,
}: Props) {
  const [createReminder, { isLoading: isCreating }] =
    useCreateFinancialReminderMutation();

  const [updateReminder, { isLoading: isUpdating }] =
    useUpdateFinancialReminderMutation();

  const isEditing = !!reminder;

  const isLoading = isCreating || isUpdating;

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [daysBefore, setDaysBefore] = useState("1");

  const [periodic, setPeriodic] = useState(false);

  const [recurrence, setRecurrence] = useState<Recurrence>();

  /**
   * Populate form when editing.
   */
  useEffect(() => {
    if (!visible) {
      return;
    }

    if (reminder) {
      setName(reminder.name);

      setAmount(formatAmountForInput(reminder.amount));

      setDaysBefore(String(reminder.remind_days_before ?? 1));

      if (reminder.recurrence === "none") {
        setPeriodic(false);
        // setRecurrence("monthly");
      } else {
        setPeriodic(true);
        setRecurrence(reminder.recurrence);
      }

      return;
    }

    /**
     * New reminder.
     */
    resetForm();
  }, [visible, reminder]);

  const resetForm = () => {
    setName("");
    setAmount("");
    setDaysBefore("1");
    setPeriodic(false);
    setRecurrence("monthly");
  };

  const handleClose = () => {
    if (isLoading) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSave = async () => {
    const paymentDate = reminder?.payment_date ?? selectedDate;

    if (!paymentDate) {
      Alert.alert("Missing date", "Please select a payment date.");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter a reminder name.");
      return;
    }

    if (!amount.trim()) {
      Alert.alert("Missing amount", "Please enter the reminder amount.");
      return;
    }

    const numericAmount = amount.replace(/,/g, "").trim();

    if (
      !numericAmount ||
      Number.isNaN(Number(numericAmount)) ||
      Number(numericAmount) <= 0
    ) {
      Alert.alert("Invalid amount", "Please enter a valid amount.");
      return;
    }

    const numericDaysBefore = Number(daysBefore);

    if (Number.isNaN(numericDaysBefore) || numericDaysBefore < 0) {
      Alert.alert(
        "Invalid reminder period",
        "Days before payment must be 0 or greater.",
      );
      return;
    }

    const data = {
      name: name.trim(),
      amount: numericAmount,
      payment_date: paymentDate,
      remind_days_before: numericDaysBefore,
      recurrence: periodic ? recurrence : "none",
    };

    try {
      if (isEditing && reminder) {
        await updateReminder({
          id: reminder.id,
          data,
        }).unwrap();
      } else {
        await createReminder(data).unwrap();
      }

      resetForm();

      onSuccess();
    } catch (error) {
      console.log(
        isEditing
          ? "UPDATE FINANCIAL REMINDER ERROR:"
          : "CREATE FINANCIAL REMINDER ERROR:",
        error,
      );

      Alert.alert(
        isEditing ? "Update failed" : "Creation failed",
        isEditing
          ? "Unable to update this reminder. Please try again."
          : "Unable to create this reminder. Please try again.",
      );
    }
  };

  const displayDate = reminder?.payment_date ?? selectedDate;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.handle} />

          <Text style={styles.title}>
            {isEditing ? "Edit Reminder" : "Create Reminder"}
          </Text>

          {displayDate && (
            <Text style={styles.date}>
              Payment on {formatDate(displayDate)}
            </Text>
          )}

          {/* Name */}

          <Text style={styles.label}>Name</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Rent"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            editable={!isLoading}
          />

          {/* Amount */}

          <Text style={styles.label}>Amount</Text>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="e.g. 150000"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            style={styles.input}
            editable={!isLoading}
          />

          {/* Reminder days */}

          <Text style={styles.label}>Remind me</Text>

          <View style={styles.daysRow}>
            <TextInput
              value={daysBefore}
              onChangeText={setDaysBefore}
              keyboardType="number-pad"
              style={styles.daysInput}
              editable={!isLoading}
            />

            <Text style={styles.daysText}>days before payment</Text>
          </View>

          {/* Periodic */}

          <View style={styles.periodicRow}>
            <View style={styles.periodicInfo}>
              <Text style={styles.periodicTitle}>Periodic</Text>

              <Text style={styles.periodicSubtitle}>
                Automatically repeat this reminder
              </Text>
            </View>

            <Switch
              value={periodic}
              onValueChange={setPeriodic}
              disabled={isLoading}
              trackColor={{
                false: "#CBD5E1",
                true: "#86B5A5",
              }}
              thumbColor={periodic ? PRIMARY : "#F8FAFC"}
            />
          </View>

          {/* Recurrence */}

          {periodic && (
            <View style={styles.recurrenceContainer}>
              {(
                [
                  ["daily", "Daily"],
                  ["weekly", "Weekly"],
                  ["monthly", "Monthly"],
                ] as const
              ).map(([value, label]) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setRecurrence(value)}
                  disabled={isLoading}
                  style={[
                    styles.recurrenceButton,
                    recurrence === value && styles.recurrenceButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.recurrenceText,
                      recurrence === value && styles.recurrenceTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Actions */}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveText}>
                  {isEditing ? "Update Reminder" : "Save Reminder"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAmountForInput(amount: string) {
  return Number(amount).toLocaleString("en-US");
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },

  modal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },

  handle: {
    alignSelf: "center",
    width: 45,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#CBD5E1",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  date: {
    marginTop: 5,
    marginBottom: 20,
    fontSize: 14,
    color: PRIMARY,
    fontWeight: "600",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },

  daysRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  daysInput: {
    width: 70,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
    textAlign: "center",
  },

  daysText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#64748B",
  },

  periodicRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  periodicInfo: {
    flex: 1,
  },

  periodicTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  periodicSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#64748B",
  },

  recurrenceContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  recurrenceButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },

  recurrenceButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  recurrenceText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },

  recurrenceTextActive: {
    color: "#FFFFFF",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 25,
  },

  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },

  saveButton: {
    flex: 1.5,
    height: 52,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY,
  },

  saveText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
