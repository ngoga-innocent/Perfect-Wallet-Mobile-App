import React, { useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Calendar, DateData } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FinancialReminder,
  useDeleteFinancialReminderMutation,
  useGetFinancialRemindersQuery,
} from "@/api/financialReminderApi";
import AppHeader from "@/components/ui/Header/AppHeader";
import FinancialReminderModal from "@/components/financial-calendar/FinancialReminderModal";
import { router } from "expo-router";
import FinancialReminderDetailsModal from "@/components/financial-calendar/FinancialReminderDetailModal";
import AppLoader from "@/components/ui/Loader/AppLoader";

const PRIMARY = "#10644D";
const GOLD = "#F5C542";

export default function FinancialCalendarScreen() {
  const {
    data: Datareminders,
    isLoading,
    isFetching,
    refetch,
  } = useGetFinancialRemindersQuery();

  const [deleteFinancialReminder] = useDeleteFinancialReminderMutation();
  function getTodayDateString() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  const today = getTodayDateString();
  const reminders = Datareminders?.results ?? [];

  const [selectedDate, setSelectedDate] = useState<string | null>(today);

  const [modalVisible, setModalVisible] = useState(false);

  const [detailsVisible, setDetailsVisible] = useState(false);

  const [editingReminder, setEditingReminder] =
    useState<FinancialReminder | null>(null);

  const [selectedReminder, setSelectedReminder] =
    useState<FinancialReminder | null>(null);

  /**
   * Create calendar marks.
   */
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    reminders.forEach((reminder: FinancialReminder) => {
      if (!reminder.payment_date) {
        return;
      }

      marks[reminder.payment_date] = {
        ...(marks[reminder.payment_date] || {}),
        marked: true,
        dotColor: PRIMARY,
      };
    });

    /**
     * Selected date.
     *
     * Keep the existing dot when the selected date
     * already contains reminders.
     */
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: PRIMARY,
      };
    }

    return marks;
  }, [reminders, selectedDate]);

  /**
   * Reminders belonging to the currently selected date.
   */
  const selectedReminders = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    return reminders.filter(
      (reminder: FinancialReminder) => reminder.payment_date === selectedDate,
    );
  }, [reminders, selectedDate]);

  /**
   * User taps a calendar day.
   *
   * IMPORTANT:
   * We do NOT open a modal here.
   *
   * We simply select the date and show its reminders.
   */
  const handleDatePress = (day: DateData) => {
    setSelectedDate(day.dateString);

    // Close any previously opened details modal.
    setDetailsVisible(false);

    // Clear selected reminder.
    setSelectedReminder(null);
  };

  /**
   * User taps a reminder displayed under the calendar.
   */
  const handleReminderPress = (reminder: FinancialReminder) => {
    setSelectedReminder(reminder);
    setDetailsVisible(true);
  };

  /**
   * Open create reminder modal for the selected date.
   */
  const handleCreateReminder = () => {
    if (!selectedDate) {
      return;
    }

    setEditingReminder(null);
    setModalVisible(true);
  };

  /**
   * Open edit mode.
   */
  const handleEditReminder = (reminder: FinancialReminder) => {
    setDetailsVisible(false);

    setSelectedReminder(null);

    setEditingReminder(reminder);

    setModalVisible(true);
  };

  /**
   * Delete reminder.
   */
  const handleDeleteReminder = (reminder: FinancialReminder) => {
    Alert.alert(
      "Delete reminder",
      `Are you sure you want to delete "${reminder.name}"?`,
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
              await deleteFinancialReminder(reminder.id).unwrap();

              setDetailsVisible(false);
              setSelectedReminder(null);

              refetch();
            } catch (error) {
              console.error("Failed to delete financial reminder:", error);

              Alert.alert(
                "Delete failed",
                "Unable to delete this reminder. Please try again.",
              );
            }
          },
        },
      ],
    );
  };
  const inset = useSafeAreaInsets();
  // if (isLoading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color={PRIMARY} />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Financial Calendar"
        showBack={true}
        onBackPress={() => router.navigate("/(tabs)/more")}
        showProfile={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: inset.bottom * 3.5,
          paddingTop: inset.top,
          ...styles.scrollContent, // spread inside the same object
        }}
      >
        {/* Header */}

        {/*<View style={styles.header}>
          <Text style={styles.title}>Financial Calendar</Text>

          <Text style={styles.subtitle}>Keep track of upcoming payments</Text>
        </View>*/}

        {/* Calendar */}

        <View style={styles.calendarCard}>
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDatePress}
            theme={{
              todayTextColor: PRIMARY,
              selectedDayBackgroundColor: PRIMARY,
              selectedDayTextColor: "#FFFFFF",
              arrowColor: PRIMARY,
              monthTextColor: PRIMARY,
              textDayFontWeight: "500",
              textMonthFontWeight: "700",
              textDayHeaderFontWeight: "600",
            }}
          />
        </View>

        {/* Selected date */}

        {selectedDate && (
          <View style={styles.selectedSection}>
            <View style={styles.dateHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  {formatDate(selectedDate)}
                </Text>

                <Text style={styles.dateSubtitle}>
                  {selectedReminders.length === 0
                    ? "No reminders scheduled"
                    : `${selectedReminders.length} ${
                        selectedReminders.length === 1
                          ? "reminder"
                          : "reminders"
                      }`}
                </Text>
              </View>
            </View>

            {/* Reminders for selected date */}

            {selectedReminders.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No reminders</Text>

                <Text style={styles.emptyText}>
                  You don't have any payments scheduled for this date.
                </Text>
              </View>
            ) : (
              selectedReminders.map((reminder: FinancialReminder) => (
                <TouchableOpacity
                  key={reminder.id}
                  style={styles.reminderCard}
                  activeOpacity={0.75}
                  onPress={() => handleReminderPress(reminder)}
                >
                  <View style={styles.reminderInfo}>
                    <Text style={styles.reminderName}>{reminder.name}</Text>

                    <Text style={styles.reminderAmount}>
                      {formatAmount(reminder.amount)} RWF
                    </Text>

                    {reminder.recurrence !== "none" && (
                      <Text style={styles.recurrenceText}>
                        Repeats {reminder.recurrence}
                      </Text>
                    )}
                  </View>

                  <View style={styles.reminderRight}>
                    <View
                      style={[
                        styles.statusBadge,
                        reminder.status === "completed" &&
                          styles.completedBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          reminder.status === "completed" &&
                            styles.completedText,
                        ]}
                      >
                        {reminder.status === "completed"
                          ? "Completed"
                          : "Pending"}
                      </Text>
                    </View>

                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}

            {/* Create reminder for this date */}

            <TouchableOpacity
              style={styles.addReminderButton}
              onPress={handleCreateReminder}
              activeOpacity={0.8}
            >
              <View style={styles.addIcon}>
                <Text style={styles.addIconText}>+</Text>
              </View>

              <Text style={styles.addReminderText}>
                Add reminder for {formatShortDate(selectedDate)}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* No selected date */}

        {!selectedDate && (
          <View style={styles.selectDateCard}>
            <Text style={styles.selectDateIcon}>📅</Text>

            <Text style={styles.selectDateTitle}>Select a date</Text>

            <Text style={styles.selectDateText}>
              Select a date from the calendar to view or add financial
              reminders.
            </Text>
          </View>
        )}

        {/* Upcoming */}

        <View style={styles.upcomingSection}>
          <View style={styles.upcomingHeader}>
            <Text style={styles.sectionTitle}>Latest & Upcoming Event</Text>

            {isFetching && !isLoading && (
              <ActivityIndicator size="small" color={PRIMARY} />
            )}
          </View>

          {reminders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No upcoming payments</Text>

              <Text style={styles.emptyText}>
                Select a date above to create a reminder.
              </Text>
            </View>
          ) : (
            reminders
              .filter(
                (reminder: FinancialReminder) => reminder.status === "pending",
              )
              .slice(0, 5)
              .map((reminder: FinancialReminder) => (
                <TouchableOpacity
                  key={reminder.id}
                  style={styles.reminderCard}
                  activeOpacity={0.75}
                  onPress={() => {
                    setSelectedDate(reminder.payment_date);
                    handleReminderPress(reminder);
                  }}
                >
                  <View style={styles.reminderInfo}>
                    <Text style={styles.reminderName}>{reminder.name}</Text>

                    <Text style={styles.reminderDate}>
                      {formatDate(reminder.payment_date)}
                    </Text>
                  </View>

                  <View style={styles.reminderRight}>
                    <Text style={styles.reminderAmount}>
                      {formatAmount(reminder.amount)} RWF
                    </Text>

                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>
              ))
          )}
        </View>
      </ScrollView>

      {/* Create / Edit Reminder */}

      <FinancialReminderModal
        visible={modalVisible}
        selectedDate={selectedDate}
        reminder={editingReminder}
        onClose={() => {
          setModalVisible(false);
          setEditingReminder(null);
        }}
        onSuccess={() => {
          setModalVisible(false);
          setEditingReminder(null);
          refetch();
        }}
      />

      {/* Reminder Details */}

      <FinancialReminderDetailsModal
        visible={detailsVisible}
        selectedDate={selectedDate}
        reminders={selectedReminder ? [selectedReminder] : []}
        onClose={() => {
          setDetailsVisible(false);
          setSelectedReminder(null);
        }}
        onEdit={handleEditReminder}
        onDelete={handleDeleteReminder}
      />
      <AppLoader visible={isLoading} message="Loading calendar..." />
    </View>
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

function formatShortDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function formatAmount(amount: string) {
  return Number(amount).toLocaleString("en-US");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8F7",
  },

  scrollContent: {},

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F8F7",
  },

  header: {
    paddingHorizontal: 20,

    paddingBottom: 16,
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#64748B",
  },

  calendarCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },

  selectedSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },

  dateHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  dateSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },

  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },

  reminderInfo: {
    flex: 1,
  },

  reminderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },

  reminderDate: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },

  reminderAmount: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "700",
    color: PRIMARY,
  },

  recurrenceText: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
    textTransform: "capitalize",
  },

  reminderRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  chevron: {
    marginLeft: 10,
    fontSize: 25,
    color: "#94A3B8",
  },

  statusBadge: {
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

  addReminderButton: {
    height: 52,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderStyle: "dashed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    backgroundColor: "#F8FCFA",
  },

  addIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  addIconText: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "500",
  },

  addReminderText: {
    fontSize: 14,
    fontWeight: "700",
    color: PRIMARY,
  },

  selectDateCard: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  selectDateIcon: {
    fontSize: 28,
    marginBottom: 10,
  },

  selectDateTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },

  selectDateText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
    textAlign: "center",
  },

  upcomingSection: {
    marginTop: 28,
    paddingHorizontal: 16,
  },

  upcomingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  emptyCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  emptyText: {
    marginTop: 5,
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
  },
});
