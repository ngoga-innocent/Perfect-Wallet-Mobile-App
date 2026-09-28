import { baseApi } from "./baseQuery";

export type DashboardBalance = {
  total: string;
  currency: string;
};

export type DashboardSummary = {
  income: string;
  expenses: string;
  net: string;
};

export type DashboardAccounts = {
  count: number;
  total_balance: string;
};

export type DashboardLoans = {
  lent: string;
  borrowed: string;
  outstanding: string;
};

export type DashboardUpcomingEvent = {
  id: number;
  name: string;
  amount: string;
  payment_date: string;
  days_remaining: number;
  remind_days_before: number;
  recurrence: "none" | "daily" | "weekly" | "monthly";
  status: "pending" | "completed";
};

export type DashboardTransaction = {
  id: number;
  type: "income" | "expense" | "transfer";
  amount: string;
  description: string;
  date: string;
  account_name: string | null;
  destination_account_name: string | null;
};

export type DashboardFinancialHealth = {
  income: string;
  expenses: string;
  savings: string;
  expense_ratio: number;
};

export type DashboardResponse = {
  balance: DashboardBalance;
  summary: DashboardSummary;
  accounts: DashboardAccounts;
  loans: DashboardLoans;
  upcoming_events: DashboardUpcomingEvent[];
  recent_transactions: DashboardTransaction[];
  financial_health: DashboardFinancialHealth;
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "/dashboard/",
      providesTags: ["Dashboard"],
    }),
  }),

  overrideExisting: false,
});

export const { useGetDashboardQuery } = dashboardApi;
