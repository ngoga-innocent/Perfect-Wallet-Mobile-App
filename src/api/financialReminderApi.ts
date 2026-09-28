import { baseApi } from "./baseQuery";

export type FinancialReminder = {
  id: number;
  name: string;
  amount: string;
  payment_date: string;
  remind_days_before: number;
  reminder_date: string;
  recurrence?: "none" | "daily" | "weekly" | "monthly";
  status: "pending" | "completed";
  description?: string;
  created_at: string;
  updated_at: string;
};
export type PaginatedFinancialReminders = {
  count: number;
  next: string | null;
  previous: string | null;
  results: FinancialReminder[];
};
// recurrence.ts
export type Recurrence = "none" | "daily" | "weekly" | "monthly";

export type CreateFinancialReminderRequest = {
  name: string;
  amount: string;
  payment_date: string;
  remind_days_before: number;
  recurrence?: Recurrence;
};

export type UpdateFinancialReminderRequest =
  Partial<CreateFinancialReminderRequest>;

export const financialReminderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFinancialReminders: builder.query<PaginatedFinancialReminders, void>({
      query: () => "/financial-reminders/",
      providesTags: ["FinancialReminder"],
    }),

    getFinancialReminder: builder.query<FinancialReminder, number>({
      query: (id) => `/financial-reminders/${id}/`,
      providesTags: (_result, _error, id) => [
        {
          type: "FinancialReminder",
          id,
        },
      ],
    }),

    createFinancialReminder: builder.mutation<
      FinancialReminder,
      CreateFinancialReminderRequest
    >({
      query: (body) => ({
        url: "/financial-reminders/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FinancialReminder"],
    }),

    updateFinancialReminder: builder.mutation<
      FinancialReminder,
      {
        id: number;
        data: UpdateFinancialReminderRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `/financial-reminders/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "FinancialReminder",
        {
          type: "FinancialReminder",
          id,
        },
      ],
    }),

    deleteFinancialReminder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/financial-reminders/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["FinancialReminder"],
    }),

    completeFinancialReminder: builder.mutation<FinancialReminder, number>({
      query: (id) => ({
        url: `/financial-reminders/${id}/complete/`,
        method: "POST",
      }),
      invalidatesTags: ["FinancialReminder"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetFinancialRemindersQuery,
  useGetFinancialReminderQuery,
  useCreateFinancialReminderMutation,
  useUpdateFinancialReminderMutation,
  useDeleteFinancialReminderMutation,
  useCompleteFinancialReminderMutation,
} = financialReminderApi;
