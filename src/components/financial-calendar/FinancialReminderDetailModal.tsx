import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { FinancialReminder } from "@/api/financialReminderApi";
const PRIMARY = "#10644D";
const GOLD = "#F5C542";

type Props = {
  visible: boolean;
  reminders: FinancialReminder[];
  selectedDate: string | null;
  onClose: () => void;
  onEdit: (reminder: FinancialReminder) => void;
  onDelete: (reminder: FinancialReminder) => void;
};

export default function FinancialReminderDetailsModal({
  visible,
  reminders,
  selectedDate,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  if (!selectedDate) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatAmount = (amount: string) => {
    return Number(amount).toLocaleString("en-US");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Financial Events</Text>

              <Text style={styles.date}>{formatDate(selectedDate)}</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Events */}

          {reminders.map((reminder) => (
            <View key={reminder.id} style={styles.eventCard}>
              <View style={styles.eventTop}>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName}>{reminder.name}</Text>

                  <Text style={styles.amount}>
                    {formatAmount(reminder.amount)} RWF
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    reminder.status === "completed" && styles.completedBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      reminder.status === "completed" && styles.completedText,
                    ]}
                  >
                    {reminder.status === "completed" ? "Completed" : "Pending"}
                  </Text>
                </View>
              </View>

              {reminder.description ? (
                <Text style={styles.description}>{reminder.description}</Text>
              ) : null}

              {/* Actions */}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => onEdit(reminder)}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onDelete(reminder)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  container: {
    backgroundColor: "#F6F8F7",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 35,
    maxHeight: "85%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  date: {
    marginTop: 5,
    fontSize: 14,
    color: "#64748B",
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 27,
    lineHeight: 29,
    color: "#334155",
  },

  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  eventTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  eventInfo: {
    flex: 1,
  },

  eventName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },

  amount: {
    marginTop: 7,
    fontSize: 16,
    fontWeight: "700",
    color: PRIMARY,
  },

  statusBadge: {
    marginLeft: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#FFF7D6",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8A6D00",
  },

  completedBadge: {
    backgroundColor: "#DCFCE7",
  },

  completedText: {
    color: "#166534",
  },

  description: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
  },

  actions: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },

  editButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E8F3EF",
    alignItems: "center",
    justifyContent: "center",
  },

  editText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: "700",
  },

  deleteButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "700",
  },

  doneButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  doneText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
